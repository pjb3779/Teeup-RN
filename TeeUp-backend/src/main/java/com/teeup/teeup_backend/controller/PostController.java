package com.teeup.teeup_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
        try {
            PostResponse resp = postService.createNewPosting(authLoginId, req);

            Map<String, Object> result = new HashMap<>();
            result.put("message", "포스팅 완료 !!");
            result.put("data", resp);

            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (Exception e) {
            e.printStackTrace();                                 // ① 예외 스택트레이스 찍기
            Map<String, Object> error = new HashMap<>();
            error.put("message", "서버에러 발생");
            error.put("error", e.getMessage());                  // ② 메시지도 응답에 담기
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
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

    /* 작성자가 작성한 포스팅 목록들 가져오는 메서드 */
    @GetMapping("/list/{authLoginId}")
    public ResponseEntity<?> getMyPost(
        @PathVariable String authLoginId
    ){
        List<PostResponse> myPosts = postService.getPostByUser(authLoginId);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "내 포스팅 목록 가져오기 성공 !");
        result.put("data", myPosts);

        return ResponseEntity.ok(result);
    }

    /* 모든 사용자가 작성한 포스팅 목록들 가져오는 메서드 */
    @GetMapping("/list/all")
    public ResponseEntity<?> getAllPosts() {
        List<PostResponse> posts = postService.getAllPosts();

        Map<String, Object> result = new HashMap<>();
        result.put("message", "전체 포스트 가져오기 성공 !");
        result.put("data", posts);

        return ResponseEntity.ok(result);
    }


    /* 특정 포스트만 가져오는 메서드 */
    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(
        @PathVariable String postId
    ){
        PostResponse resp = postService.getPostById(postId);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "포스트 가져오기 성공 !");
        result.put("data", resp);

        return ResponseEntity.ok(result);
    }
}
