package com.teeup.teeup_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teeup.teeup_backend.dto.PostCreateRequest;
import com.teeup.teeup_backend.dto.PostResponse;
import com.teeup.teeup_backend.repository.PostRepository;
import com.teeup.teeup_backend.repository.UserRepository;
import com.teeup.teeup_backend.service.PostService;
import com.teeup.teeup_backend.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.util.*;
@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    /* 포스팅 생성하기 */
    @PostMapping("/{authLoginId}")
    public ResponseEntity<?> posting(
        @PathVariable("authLoginId") String authLoginId,
        @RequestBody @Valid PostCreateRequest req
    ) {
        try{    
            PostResponse resp = postService.createNewPosting(authLoginId, req);

            Map<String, Object> result = new HashMap<>();
            result.put("message", "포스팅 완료 !!");
            result.put("data", resp);

            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서버에러");
        }
    }

    /* 포스팅 삭제하기 */
    @DeleteMapping("/delete/{postId}")
    public ResponseEntity<?> deletePost(
        @PathVariable String postId
    ){
        try{
            postService.deletePost(postId);
            Map<String, Object> result = new HashMap<>();
            result.put("message", "포스팅 삭제 완료!!");
            return ResponseEntity.ok(result);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서버 에러");
        }
    }
}
