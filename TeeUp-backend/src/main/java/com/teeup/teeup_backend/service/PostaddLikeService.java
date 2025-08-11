package com.teeup.teeup_backend.service;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teeup.teeup_backend.dto.PostResponse;
import com.teeup.teeup_backend.model.Post;
import com.teeup.teeup_backend.model.PostLikeCount;
import com.teeup.teeup_backend.repository.PostLikeRepository;
import com.teeup.teeup_backend.repository.PostRepository;
import com.teeup.teeup_backend.model.User; 
import com.teeup.teeup_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class PostaddLikeService {
    
    private final PostLikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public PostResponse toggleLike(String postId, String userId) {
        // 1) 좋아요 기존 여부 확인
        var existing = likeRepository.findByPostIdAndUserId(postId, userId);

        // 2) 포스트 조회
        Post post = postRepository.findById(new ObjectId(postId))
            .orElseThrow(() -> new IllegalStateException("존재하지 않는 게시글 입니다: " + postId));

        // 3) 좋아요 토글 & 카운트 조정
        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            post.setLikesCount(post.getLikesCount() - 1);
        } else {
            PostLikeCount like = PostLikeCount.builder()
                .postId(postId)
                .userId(userId)
                .createdAt(LocalDateTime.now().toString())
                .build();
            likeRepository.save(like);
            post.setLikesCount(post.getLikesCount() + 1);
        }

        // 4) 포스트 저장
        Post updated = postRepository.save(post);

        // 5) 작성자(User) 정보 조회
        User author = userRepository.findByLoginId(updated.getAuthorId())
            .orElseThrow(() -> new UsernameNotFoundException(
                "작성자를 찾을 수 없습니다: " + updated.getAuthorId()
            ));

        // 6) DTO 변환 (새로운 필드 추가!)
        return new PostResponse(
            updated.getId().toHexString(),
            updated.getTitle(),
            updated.getContent(),
            updated.getAuthorId(),
            updated.getImageUrl(),
            updated.getLocation(),
            updated.getCategory(),
            updated.getCreatedAt() != null ? updated.getCreatedAt().toString() : "",
            updated.getUpdatedAt() != null ? updated.getUpdatedAt().toString() : "",
            updated.getLikesCount(),
            updated.getCommentsCount(),
            author.getNickname(),      // ← 작성자 닉네임
            author.getAvatarUrl()      // ← 작성자 아바타 URL
        );
    }

}
