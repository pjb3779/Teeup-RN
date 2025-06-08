package com.teeup.teeup_backend.model;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "messages")
public class Message {
    @Id
    private ObjectId id;

    private ObjectId roomId;       // 채팅방 ID (참조용)
    private ObjectId senderId;     // 메시지 발신자 ID
    private String content;        // 메시지 내용
    private String type;           // 메시지 타입 (TEXT, IMAGE, etc.)
    private LocalDateTime timestamp; // 메시지 전송 시간
}
