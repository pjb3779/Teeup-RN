package com.teeup.teeup_backend.controller;

import java.security.Principal;
import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.teeup.teeup_backend.dto.ChatMessageRes;
import com.teeup.teeup_backend.dto.SendMessageReq;
import com.teeup.teeup_backend.model.ChatMessage;
import com.teeup.teeup_backend.model.ChatRoom;
import com.teeup.teeup_backend.repository.ChatMessageRepository;
import com.teeup.teeup_backend.repository.ChatRoomRepository;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatStompController {

    private final ChatMessageRepository msgRepo;
    private final ChatRoomRepository roomRepo;
    private final SimpMessagingTemplate template;

    // 클라이언트 publish: /app/rooms/{roomId}/send
    @MessageMapping("/rooms/{roomId}/send")
    public void send(@DestinationVariable String roomId,
                     @Payload SendMessageReq req,
                     Principal principal) {

        // 1) 기본 검증 + 정규화
        if (principal == null || principal.getName() == null || principal.getName().isBlank()) {
            throw new IllegalArgumentException("Unauthorized (no principal)");
        }
        String sender = principal.getName().trim();               // 필요시 .toLowerCase()도 고려
        String normRoomId = roomId.trim();
        String type = (req.getType() == null || req.getType().isBlank()) ? "TEXT" : req.getType().trim();
        String content = req.getContent() == null ? "" : req.getContent().trim();

        if (content.isBlank()) {
            // 빈 메시지 차단
            return;
        }

        System.out.println("[MSG SEND] roomId=" + normRoomId + ", sender=" + sender + ", type=" + type + ", content=" + content);

        // 2) 방 조회 + 멤버 검사
        ChatRoom room = roomRepo.findById(new ObjectId(normRoomId))
                .orElseThrow(() -> new IllegalArgumentException("Invalid roomId"));

        if (!room.getMembers().contains(sender)) {
            System.out.println("[MSG BLOCK] not a member. members=" + room.getMembers());
            throw new IllegalArgumentException("Not a member of this room");
        }

        // 3) 저장
        ChatMessage saved = msgRepo.save(new ChatMessage(
                null,
                new ObjectId(normRoomId),
                sender,
                type,
                content,
                LocalDateTime.now()
        ));

        // 4) 방 메타 업데이트
        room.setLastMessage(content);
        room.setUpdatedAt(LocalDateTime.now());
        roomRepo.save(room);

        // 5) 방 토픽 브로드캐스트 (채팅 화면용)
        ChatMessageRes payload = new ChatMessageRes(
                saved.getId().toHexString(),
                normRoomId,
                sender,
                saved.getType(),
                saved.getContent(),
                saved.getCreatedAt()
        );
        template.convertAndSend("/topic/rooms/" + normRoomId, payload);

        // 6) 개인 토픽 브로드캐스트 (알림용) — 본인 제외
        for (String m : room.getMembers()) {
            if (!m.equals(sender)) {
                template.convertAndSend("/topic/users/" + m, payload);
            }
        }
    }

    // 에러가 나면 서버 로그 남기고 종료 (클라 콘솔에 STOMP ERROR로 표시됨)
    @MessageExceptionHandler(Exception.class)
    public void wsErrorHandler(Exception e) {
        System.err.println("[WS ERROR] " + e.getClass().getSimpleName() + " - " + e.getMessage());
    }
}
