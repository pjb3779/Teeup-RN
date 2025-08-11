package com.teeup.teeup_backend.model;

import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

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
    @CreatedDate
    private Instant createdAt;      // 생성 시각 자동 주입

    @LastModifiedDate
    private Instant updatedAt;      // 수정 시각 자동 주입
    private int likesCount;
    private int commentsCount;
}
