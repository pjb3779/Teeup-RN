package com.teeup.teeup_backend.model;

import java.time.LocalDateTime;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "chat_messages")
public class ChatMessage {
    @Id
    private ObjectId id;

    @Indexed
    private ObjectId roomId;

    @Indexed
    private String senderLoginId;

    private String type;    // TEXT, IMAGE...
    private String content;
    private LocalDateTime createdAt = LocalDateTime.now();
}
