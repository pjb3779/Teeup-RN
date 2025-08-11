package com.teeup.teeup_backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;

public class CommentResponse {
    
    @Getter
    @Setter
    @NoArgsConstructor
    public static class Create{
        private String authorId;
        private String content;
        private String parentId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class Response{
        private String commentId;
        private String postId;
        private String authorId;
        private String parentId;
        private String content;
        private Date createdAt;
        private Date updatedAt;
        private int likeCount;
        private String authorAvatarUrl;

        public Response(String commentId, String postId, String authorId, String parentId, String content, Date createdAt, Date updatedAt, int likeCount, String authorAvatarUrl) {
            this.commentId = commentId;
            this.postId = postId;
            this.authorId = authorId;
            this.parentId = parentId;
            this.content = content;
            this.createdAt = createdAt;
            this.updatedAt = updatedAt;
            this.likeCount = likeCount;
            this.authorAvatarUrl = authorAvatarUrl;
        }
    }
    
    @Getter
    @Setter
    @NoArgsConstructor
    public static class LikeResponse {
        private String commentId;
        private int likeCount;

        public LikeResponse(String commentId, int likeCount) {
            this.commentId = commentId;
            this.likeCount = likeCount;
        }
    }
}
