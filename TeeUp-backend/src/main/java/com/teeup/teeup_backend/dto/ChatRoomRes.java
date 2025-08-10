package com.teeup.teeup_backend.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.*;

@Getter @AllArgsConstructor
public class ChatRoomRes {
    private String id;            // ObjectId.toHexString()
    private String roomKey;
    private List<String> members;
    private String lastMessage;
    private LocalDateTime updatedAt;
}