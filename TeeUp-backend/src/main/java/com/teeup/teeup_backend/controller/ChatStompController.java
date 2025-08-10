package com.teeup.teeup_backend.controller;

import java.security.Principal;
import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.messaging.handler.annotation.DestinationVariable;
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
        public void send(@DestinationVariable String roomId, @Payload SendMessageReq req, Principal principal) {
        String sender = principal != null ? principal.getName() : null;
        System.out.println("[MSG SEND] roomId=" + roomId + ", sender=" + sender + ", content=" + req.getContent());

        ChatRoom room = roomRepo.findById(new ObjectId(roomId))
                .orElseThrow(() -> new IllegalArgumentException("Invalid roomId"));

        // 멤버 검사 로그
        if (!room.getMembers().contains(sender)) {
                System.out.println("[MSG BLOCK] not a member. members=" + room.getMembers());
                throw new IllegalArgumentException("Not a member of this room");
        }

        ChatMessage saved = msgRepo.save(new ChatMessage(
                null,
                new ObjectId(roomId),
                sender,
                (req.getType() == null || req.getType().isBlank()) ? "TEXT" : req.getType(),
                req.getContent(),
                LocalDateTime.now()
        ));

        room.setLastMessage(req.getContent());
        room.setUpdatedAt(LocalDateTime.now());
        roomRepo.save(room);

        template.convertAndSend("/topic/rooms/" + roomId, new ChatMessageRes(
                saved.getId().toHexString(), roomId, sender, saved.getType(), saved.getContent(), saved.getCreatedAt()
        ));
        }
}