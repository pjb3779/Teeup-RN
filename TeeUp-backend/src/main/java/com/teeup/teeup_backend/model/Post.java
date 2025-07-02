package com.teeup.teeup_backend.model;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    private ObjectId id;
    private String title;
    private String content;
    private String authorId;
    private String imageUrl;
    private String location;
    private String category;
    private String createdAt;
    private String updatedAt;
    private int likesCount;
    private int commentsCount;    
}
