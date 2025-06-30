package com.teeup.teeup_backend.service;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teeup.teeup_backend.dto.PostResponse;
import com.teeup.teeup_backend.model.Post;
import com.teeup.teeup_backend.model.PostLikeCount;
import com.teeup.teeup_backend.repository.PostLikeRepository;
import com.teeup.teeup_backend.repository.PostRepository;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class PostaddLikeService {
    
    private final PostLikeRepository likeRepository;
    private final PostRepository postRepository;

    @Transactional
    public PostResponse toggleLike(String postId, String userId){

        var existing = likeRepository.findByPostIdAndUserId(postId, userId);
        // post 조회
        Post post = postRepository.findById(new ObjectId(postId))
                        .orElseThrow(() -> new IllegalStateException("존재하지 않는 게시글 입니다" + postId));
        
        // 이미 좋아요를 눌렀으면 -> 취소
        if(existing.isPresent()){
            likeRepository.delete(existing.get());
            post.setLikesCount(post.getLikesCount() - 1);
        }
        else{
            PostLikeCount like = PostLikeCount.builder()
                            .postId(postId)
                            .userId(userId)
                            .createdAt(LocalDateTime.now().toString())
                            .build();
            likeRepository.save(like);
            post.setLikesCount(post.getLikesCount() + 1);
        }
        
        
        // 3) Post 업데이트
        Post updated = postRepository.save(post);

        // 4) DTO 변환
        return new PostResponse(
            updated.getId().toHexString(),
            updated.getTitle(),
            updated.getContent(),
            updated.getAuthorId(),
            updated.getImageUrl(),
            updated.getLocation(),
            updated.getCategory(),
            updated.getCreatedAt(),
            updated.getUpdatedAt(),
            updated.getLikesCount(),
            updated.getCommentsCount()
        );
    }
}
