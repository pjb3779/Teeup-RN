package com.teeup.teeup_backend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.service.annotation.PatchExchange;

import com.teeup.teeup_backend.dto.CommentResponse;
import com.teeup.teeup_backend.service.CommentService;
import com.teeup.teeup_backend.model.Comment;
import com.teeup.teeup_backend.repository.CommentRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/post/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {
    
    private final CommentService commentService;

    // 댓글 생성하기
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<CommentResponse.Response> createComment(
            @PathVariable String postId,
            @RequestBody CommentResponse.Create req    
    ) {
        Comment comment = commentService.addComment(
            postId,
            req.getAuthorId(),
            req.getContent(),
            req.getParentId()
        );

        // 엔티티 → DTO 변환
        CommentResponse.Response resp = new CommentResponse.Response(
            comment.getId().toString(),   // commentId
            comment.getPostId(),
            comment.getAuthorId(),
            comment.getParentId(),
            comment.getContent(),
            comment.getCreatedAt(),
            comment.getUpdatedAt(),
            comment.getLikeBy().size(),
            comment.getAuthorAvatarUrl()  // authorAvatarUrl
        );

        return new ResponseEntity<>(resp, HttpStatus.CREATED);
    }

    // // 댓글 삭제 
    // @DeleteMapping("/{commentId}/{userId}")
    // public ResponseEntity<Map<String,ObjectId>> deleteComment(
    //     @PathVariable String postId,
    //     @PathVariable String commentId,
    //     @PathVariable String userId
    // ){
        
    // }
    
    // 댓글 가져오기
    @GetMapping
    public ResponseEntity<List<CommentResponse.Response>> getComments(
            @PathVariable String postId
        ) {
        List<Comment> comments = commentService.getCommentsByPost(postId);
        List<CommentResponse.Response> result = comments.stream()
                .map(c -> new CommentResponse.Response(
                        c.getId().toString(),
                        c.getPostId(),
                        c.getAuthorId(),
                        c.getParentId(),
                        c.getContent(),
                        c.getCreatedAt(),
                        c.getUpdatedAt(),
                        c.getLikeBy().size(),
                        c.getAuthorAvatarUrl()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // 좋아요 토글 버튼
    @PostMapping("/{commentId}/like/{userId}")
    public ResponseEntity<Map<String,Object>> toggleCommentLike(
            @PathVariable String postId,
            @PathVariable String commentId,
            @PathVariable String userId
    ) {
        int likeCount = commentService.toggleLike(commentId, userId);

        Map<String,Object> body = new HashMap<>();
        body.put("message", "댓글 좋아요 상태가 변경되었습니다.");
        // data 필드에 commentId와 최신 좋아요 개수를 담은 DTO를 반환
        body.put("data", new CommentResponse.LikeResponse(commentId, likeCount));

        return ResponseEntity.ok(body);
    }

    // 댓글 좋아요 누른 사용자 목록 반환 
    @GetMapping("/{commentId}/likes")
    public ResponseEntity<List<String>> getCommentLikers(
            @PathVariable String postId,
            @PathVariable String commentId
    ) {
        List<String> likers = commentService.getLikedUsers(commentId);
        return ResponseEntity.ok(likers);
    }
    
    // 대댓글 달기
    @PostMapping("/{commentId}/reply")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<CommentResponse.Response> replyToComment(
        @PathVariable String postId,
        @PathVariable String commentId,
        @RequestBody CommentResponse.Create req
    ){
        Comment reply = commentService.addComment(
            postId,
            req.getAuthorId(),
            req.getContent(),
            commentId
        );

        CommentResponse.Response resp = new CommentResponse.Response(
            reply.getAuthorId().toString(),
            reply.getPostId(),
            reply.getAuthorId(),
            reply.getParentId(),
            reply.getContent(),
            reply.getCreatedAt(),
            reply.getUpdatedAt(),
            reply.getLikeBy().size(),
            reply.getAuthorAvatarUrl()  // authorAvatarUrl
        );

        return new ResponseEntity<>(resp, HttpStatus.CREATED);
    }
}
