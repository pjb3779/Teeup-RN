package com.teeup.teeup_backend.dto;

import lombok.Getter;

@Getter
public class PostResponse {
    private final String id;
    private final String title;
    private final String content;
    private final String authorId;
    private final String imageUrl;
    private final String location;
    private final String category;
    private final String createdAt;
    private final String updatedAt;
    private final int likesCount;
    private final int commentsCount;
    private String authorName;
    private String authorAvatarUrl;

    public PostResponse(
        String id, String title, String content, String authorId,
        String imageUrl, String location, String category,
        String createdAt, String updatedAt, int likesCount, int commentsCount,
        String authorName, String authorAvatarUrl
    ) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.authorId = authorId;
        this.imageUrl = imageUrl;
        this.location = location;
        this.category = category;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.likesCount = likesCount;
        this.commentsCount = commentsCount;
        this.authorName        = authorName;
        this.authorAvatarUrl   = authorAvatarUrl;
    }
}
