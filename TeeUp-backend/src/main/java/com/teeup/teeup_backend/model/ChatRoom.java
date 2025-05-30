package com.teeup.teeup_backend.model;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 채팅방 정보 Document
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "chat_rooms")
public class ChatRoom {

    @Id
    private ObjectId id;            // 채팅방 고유 ID
    private ObjectId userId1;       // 채팅 참여자 1
    private ObjectId userId2;       // 채팅 참여자 2
    private String lastMessage;     // 마지막 메시지 내용
    private LocalDateTime lastUpdated; // 마지막 메시지 전송 시간
}
