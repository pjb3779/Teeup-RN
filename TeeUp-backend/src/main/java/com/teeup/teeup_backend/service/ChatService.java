package com.teeup.teeup_backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.teeup.teeup_backend.dto.ChatMessageDto;
import com.teeup.teeup_backend.model.ChatRoom;
import com.teeup.teeup_backend.model.Message;
import com.teeup.teeup_backend.repository.ChatRoomRepository;
import com.teeup.teeup_backend.repository.MessageRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
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
                .senderId(chatMessageDto.getSenderId())   //LoginId
                .receiverId(chatMessageDto.getReceiverId())
                .content(chatMessageDto.getContent())
                .type(chatMessageDto.getType())
                .timestamp(LocalDateTime.now())
                .build();

        Message savedMessage = messageRepository.save(message);

        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다: " + roomId));

        //채팅방 최근 메시지 갱신
        chatRoom.setLastMessage(chatMessageDto.getContent());
        chatRoom.setLastUpdated(LocalDateTime.now());
        chatRoomRepository.save(chatRoom);

        return savedMessage;
    }

    /**
     * 두 loginId 기준으로 채팅방을 조회하거나 없으면 생성
     */
    public ChatRoom getOrCreateChatRoom(String loginId1, String loginId2) {
        ChatRoom sortedRoom = ChatRoom.createSortedRoom(loginId1, loginId2);

        Optional<ChatRoom> existingRoom = chatRoomRepository
                .findByLoginId1AndLoginId2(sortedRoom.getLoginId1(), sortedRoom.getLoginId2());

        return existingRoom.orElseGet(() -> {
            ChatRoom newRoom = chatRoomRepository.save(sortedRoom);
            return newRoom;
        });
    }

    /*
     *  디비에서 메세지 가져오기 접속시 미접속시 받은 메세지 받기
     */
    public List<Message> findMessagesForUser(String loginId, String roomId) {
        if (roomId == null || roomId.isEmpty()) {
            log.warn("roomId is null → 메시지 조회 건너뜀 loginId={}", loginId);
            return List.of();
        }
        ObjectId roomObjectId = new ObjectId(roomId);
        return messageRepository.findByRoomIdAndReceiverId(roomObjectId, loginId);
    }

    /*
     * 로그인아이디 기준으로 채팅방 가져오기
     */
    public List<ChatRoom> getChatRoomsByLoginId(String loginId) {
        return chatRoomRepository
            .findByLoginId1OrLoginId2(loginId, loginId);
    }

    /*
     * 채팅방아이디로 상대방 채팅 내역 가져오기
     */
    public List<Message> getMessagesByRoomId(String roomId, String loginId) {
        ObjectId roomObjectId = new ObjectId(roomId);
        if (loginId == null || loginId.isEmpty()) {
            return messageRepository.findByRoomId(roomObjectId);
        } else {
            // 만약 안읽은 메시지만 받고 싶으면 아래 코드
            return messageRepository.findByRoomIdAndReceiverId(roomObjectId, loginId);
        }
    }

    /*
     *  채팅방 아이디로 모든 대화내역 가져오기
     */
    public List<Message> getMessagesByRoomId(String roomId) {
        ObjectId roomObjectId = new ObjectId(roomId);
        return messageRepository.findByRoomIdOrderByTimestampAsc(roomObjectId);
    }
}
