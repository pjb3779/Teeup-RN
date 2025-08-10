package com.teeup.teeup_backend.dto;
import java.time.LocalDateTime;
import lombok.*;

@Getter @AllArgsConstructor
public class ChatMessageRes {
    private String id;       // ObjectId.toHexString()
    private String roomId;   // ObjectId hex
    private String senderLoginId;
    private String type;
    private String content;
    private LocalDateTime createdAt;
}