package com.teeup.teeup_backend.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.teeup.teeup_backend.model.PostLikeCount;
import java.util.Optional;

public interface PostLikeRepository extends MongoRepository<PostLikeCount, ObjectId> {

    // 해당 게시글에 사용자가 이미 좋아요를 눌렀는지
    boolean existsByPostIdAndUserId(String postId, String userId);

    // 특정 사용자가 작성한 게시물을 조회
    Optional<PostLikeCount> findByPostIdAndUserId(String postId, String userId);

    // 게시물 삭제
    void deleteByPostIdAndUserId(String postId, String userId);

    // 모든 좋아요 확인하기 
    Iterable<PostLikeCount> findByPostId(String postId);
}
