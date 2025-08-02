package com.teeup.teeup_backend.model;

import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.ArrayList;
@Getter
@Setter
@NoArgsConstructor
@Document(collection = "comments")
public class Comment {
    
    @Id
    private ObjectId id;

    private String postId;
    private String authorId;
    private String parentId;
    private String content;
    private String authorAvatarUrl;

    @CreatedDate
    private Date createdAt;
    @LastModifiedDate
    private Date updatedAt;

    private List<String> likeBy = new ArrayList<>();
}
