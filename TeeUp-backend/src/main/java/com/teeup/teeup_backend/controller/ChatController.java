package com.teeup.teeup_backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.teeup.teeup_backend.dto.ChatMessageRes;
import com.teeup.teeup_backend.dto.ChatRoomRes;
import com.teeup.teeup_backend.model.ChatMessage;
import com.teeup.teeup_backend.model.ChatRoom;
import com.teeup.teeup_backend.repository.ChatRoomRepository;
import com.teeup.teeup_backend.repository.UserRepository;
import com.teeup.teeup_backend.service.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    // ✅ final + @RequiredArgsConstructor (필드 주입 / @Autowired 금지)
    private final ChatService chatService;
    private final ChatRoomRepository roomRepo;
    private final UserRepository userRepo;

    // 내 채팅방 목록
    @GetMapping("/rooms/my")
    public List<ChatRoomRes> myRooms(@RequestParam String loginId) {
        List<ChatRoom> rooms = roomRepo.findByMembersContainsOrderByUpdatedAtDesc(loginId);
        return rooms.stream().map(r ->
            new ChatRoomRes(
                r.getId().toHexString(),
                r.getRoomKey(),
                r.getMembers(),
                r.getLastMessage(),
                r.getUpdatedAt()
            )
        ).collect(Collectors.toList());
    }

    // 특정 방 히스토리
    @GetMapping("/rooms/{roomId}/history")
    public Page<ChatMessageRes> history(@PathVariable String roomId,
                                        @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "30") int size) {
        Page<ChatMessage> p = chatService.history(new ObjectId(roomId), page, size);
        return p.map(m -> new ChatMessageRes(
            m.getId().toHexString(),
            m.getRoomId().toHexString(),
            m.getSenderLoginId(),
            m.getType(),
            m.getContent(),
            m.getCreatedAt()
        ));
    }

    // 1:1 방 생성/가져오기 (존재 확인 포함)  ※ 메서드 파라미터에 레포 X
    @PostMapping("/rooms/1to1")
    public ChatRoomRes create1to1(@RequestParam String me, @RequestParam String peer) {
        if (!userRepo.existsByLoginId(me))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "me not found");
        if (!userRepo.existsByLoginId(peer))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "peer not found");

        ChatRoom r = chatService.getOrCreate1to1Room(me, peer);
        return new ChatRoomRes(
            r.getId().toHexString(),
            r.getRoomKey(),
            r.getMembers(),
            r.getLastMessage(),
            r.getUpdatedAt()
        );
    }
}
