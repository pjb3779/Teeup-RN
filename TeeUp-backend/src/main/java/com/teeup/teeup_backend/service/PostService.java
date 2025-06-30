package com.teeup.teeup_backend.service;

import org.bson.types.ObjectId;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teeup.teeup_backend.dto.PostCreateRequest;
import com.teeup.teeup_backend.dto.PostResponse;
import com.teeup.teeup_backend.repository.PostRepository;
import com.teeup.teeup_backend.repository.UserRepository;
import com.teeup.teeup_backend.model.User;
import com.teeup.teeup_backend.model.Post;
import lombok.RequiredArgsConstructor;

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
        Post saved = postRepository.save(post);

        return new PostResponse(
            saved.getId().toHexString(),
            saved.getTitle(),
            saved.getContent(),
            saved.getAuthorId(),
            saved.getImageUrl(),
            saved.getLocation(),
            saved.getCategory(),
            saved.getCreatedAt(),
            saved.getUpdatedAt(),
            saved.getLikesCount(),
            saved.getCommentsCount()
        );
    }
    
    @Transactional
    public void deletePost(String postId) {
        postRepository.deleteById(new ObjectId(postId));
    }
}