package com.teeup.teeup_backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.teeup.teeup_backend.model.ChatMessage;
import com.teeup.teeup_backend.model.ChatRoom;
import com.teeup.teeup_backend.repository.ChatMessageRepository;
import com.teeup.teeup_backend.repository.ChatRoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository roomRepo;
    private final ChatMessageRepository msgRepo;

    public ChatRoom getOrCreate1to1Room(String a, String b) {
        List<String> members = List.of(a, b).stream().sorted().collect(Collectors.toList());
        String key = String.join("|", members);
        return roomRepo.findByRoomKey(key).orElseGet(() -> {
            ChatRoom r = new ChatRoom(null, key, members, null, LocalDateTime.now());
            return roomRepo.save(r);
        });
    }

    public Page<ChatMessage> history(ObjectId roomId, int page, int size) {
        return msgRepo.findByRoomIdOrderByCreatedAtDesc(roomId, PageRequest.of(page, size));
    }
}