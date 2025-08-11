package com.teeup.teeup_backend.service;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.teeup.teeup_backend.dto.PostCreateRequest;
import com.teeup.teeup_backend.dto.PostResponse;
import com.teeup.teeup_backend.repository.PostRepository;
import com.teeup.teeup_backend.repository.UserRepository;
import com.teeup.teeup_backend.model.User;
import com.teeup.teeup_backend.model.Post;
import lombok.RequiredArgsConstructor;
import java.time.Instant;
@Service
@RequiredArgsConstructor
public class PostService{
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Transactional
    public PostResponse createNewPosting(String authLoginId, PostCreateRequest req) {
        User author = userRepository.findByLoginId(authLoginId)
            .orElseThrow(() -> new UsernameNotFoundException(
                "등록된 사용자가 아닙니다: " + authLoginId
        ));

        Post post = req.toEntity(author);

        // ← 여기에 추가
        Instant now = Instant.now();
        post.setCreatedAt(now);
        post.setUpdatedAt(now);

        Post saved = postRepository.save(post);
        

        return new PostResponse(
            saved.getId().toHexString(),
            saved.getTitle(),
            saved.getContent(),
            saved.getAuthorId(),
            saved.getImageUrl(),
            saved.getLocation(),
            saved.getCategory(),
            saved.getCreatedAt().toString(),   // 이제 null 아님
            saved.getUpdatedAt().toString(),
            saved.getLikesCount(),
            saved.getCommentsCount(),
            author.getNickname(),
            author.getAvatarUrl()
        );
    }

    @Transactional
    public void deletePost(String postId) {
        postRepository.deleteById(new ObjectId(postId));
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getPostByUser(String authLoginId){
        User author = userRepository.findByLoginId(authLoginId)
                        .orElseThrow( () -> new UsernameNotFoundException(
                            "등록된 사용자가 아닙니다 : " + authLoginId
                        ));
        List<Post> posts = postRepository.findByAuthorId(author.getId());

        return posts.stream()
            .map(post -> new PostResponse(
                post.getId().toHexString(),
                post.getTitle(),
                post.getContent(),
                post.getAuthorId(),
                post.getImageUrl(),
                post.getLocation(),
                post.getCategory(),
                post.getCreatedAt() != null ? post.getCreatedAt().toString() : "",
                post.getUpdatedAt() != null ? post.getUpdatedAt().toString() : "",
                post.getLikesCount(),
                post.getCommentsCount(),
                author.getNickname(),
                author.getAvatarUrl()
            ))
            .toList();
    }

    @Transactional(readOnly = true)
    public PostResponse getPostById(String postId) {

        Post post = postRepository.findById(new ObjectId(postId))
            .orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "포스트를 찾을 수 없습니다: " + postId)
            );
        
        User author = userRepository.findByLoginId(post.getAuthorId())
            .orElseThrow(() ->
                new UsernameNotFoundException(
                    "작성자를 찾을 수 없습니다: " + post.getAuthorId()
                )
            );

        return new PostResponse(
            post.getId().toHexString(),
            post.getTitle(),
            post.getContent(),
            post.getAuthorId(),
            post.getImageUrl(),
            post.getLocation(),
            post.getCategory(),
            post.getCreatedAt() != null ? post.getCreatedAt().toString() : "",
            post.getUpdatedAt() != null ? post.getUpdatedAt().toString() : "",
            post.getLikesCount(),
            post.getCommentsCount(),
            author.getNickname(),      
            author.getAvatarUrl()      
        );
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getAllPosts() {
        List<Post> posts = postRepository.findAll();

        return posts.stream().map(post -> {
            User author = userRepository.findByLoginId(post.getAuthorId())
                .orElseThrow(() ->
                    new UsernameNotFoundException("작성자를 찾을 수 없습니다: " + post.getAuthorId())
                );

            return new PostResponse(
                post.getId().toHexString(),
                post.getTitle(),
                post.getContent(),
                post.getAuthorId(),
                post.getImageUrl(),
                post.getLocation(),
                post.getCategory(),
                post.getCreatedAt() != null ? post.getCreatedAt().toString() : "",
                post.getUpdatedAt() != null ? post.getUpdatedAt().toString() : "",
                post.getLikesCount(),
                post.getCommentsCount(),
                author.getNickname(),
                author.getAvatarUrl()
            );
        }).toList();
    }

}