package com.teeup.teeup_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.teeup.teeup_backend.dto.ChatRoomRequestDto;
import com.teeup.teeup_backend.model.ChatRoom;
import com.teeup.teeup_backend.model.Message;
import com.teeup.teeup_backend.service.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chatrooms")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<Map<String, String>> createOrGetChatRoom(@RequestBody ChatRoomRequestDto request) {
        ChatRoom room = chatService.getOrCreateChatRoom(request.getLoginId1(), request.getLoginId2());
        return ResponseEntity.ok(Map.of("id", room.getRoomId().toHexString()));
    }

    @GetMapping("/my/{loginId}")
    public ResponseEntity<List<ChatRoom>> getChatRoomsByLoginId(@PathVariable String loginId) {
        List<ChatRoom> rooms = chatService.getChatRoomsByLoginId(loginId);
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(
            @PathVariable String roomId,
            @RequestParam(required = false) String loginId) {
        List<Message> messages = chatService.getMessagesByRoomId(roomId, loginId);
        return ResponseEntity.ok(messages);
    }
}

