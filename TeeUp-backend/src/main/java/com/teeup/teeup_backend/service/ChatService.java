package com.teeup.teeup_backend.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.teeup.teeup_backend.dto.ChatMessageDto;
import com.teeup.teeup_backend.model.ChatRoom;
import com.teeup.teeup_backend.model.Message;
import com.teeup.teeup_backend.repository.ChatRoomRepository;
import com.teeup.teeup_backend.repository.MessageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final ChatRoomRepository chatRoomRepository;

    /**
     * 메시지를 저장하고, 해당 채팅방의 최근 메시지와 시간 갱신
     */
    public Message saveMessage(ChatMessageDto chatMessageDto) {
        ObjectId roomId = new ObjectId(chatMessageDto.getRoomId());

        // Message 엔티티 생성
        Message message = Message.builder()
                .roomId(roomId)
                .senderId(new ObjectId(chatMessageDto.getSenderId()))
                .content(chatMessageDto.getContent())
                .type(chatMessageDto.getType())
                .timestamp(LocalDateTime.now())
                .build();

        Message savedMessage = messageRepository.save(message);

        //채팅방 최근 메시지 갱신
        Optional<ChatRoom> chatRoomOpt = chatRoomRepository.findById(roomId);
        chatRoomOpt.ifPresent(room -> {
            room.setLastMessage(chatMessageDto.getContent());
            room.setLastUpdated(LocalDateTime.now());
            chatRoomRepository.save(room);
        });

        return savedMessage;
    }
}
