package com.teeup.teeup_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teeup.teeup_backend.dto.PostResponse;
import com.teeup.teeup_backend.service.PostaddLikeService;

import lombok.RequiredArgsConstructor;
import java.util.*;
@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostLikeController {
    
    private final PostaddLikeService likeService;

    @PostMapping("/{postId}/like/{userId}")
    public ResponseEntity<?> toggleLike(
        @PathVariable String postId,
        @PathVariable String userId
    ){

        PostResponse resp = likeService.toggleLike(postId, userId);

        Map<String, Object> body = new HashMap<>();
        body.put("message", "좋아요 상태가 변경되었습니다.");
        body.put("data", resp);

        return ResponseEntity.ok(body);
    }
}
