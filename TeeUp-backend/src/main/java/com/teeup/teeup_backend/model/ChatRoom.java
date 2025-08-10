package com.teeup.teeup_backend.model;

import java.time.LocalDateTime;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_rooms")
public class ChatRoom {
    @Id
    private ObjectId id;

    @Indexed(unique = true)
    private String roomKey;        // "alice|bob" (정렬 후 조인)

    private List<String> members;  // loginId들
    private String lastMessage;
    private LocalDateTime updatedAt = LocalDateTime.now();
}
