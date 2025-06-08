package com.teeup.teeup_backend.dto;

import lombok.Data;

@Data
public class ChatMessageDto {
    private String roomId;     // 채팅방 ID
    private String senderId;   // 발신자 userId
    private String receiverId; // 수신자 userId
    private String content;    // 메시지 내용
    private String type;       // 메시지 타입 (TEXT, IMAGE 등)
}
