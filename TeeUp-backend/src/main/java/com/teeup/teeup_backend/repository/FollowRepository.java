package com.teeup.teeup_backend.repository;

import com.teeup.teeup_backend.model.Follow;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface FollowRepository extends MongoRepository<Follow, ObjectId> {

    // 특정 사용자가 팔로잉한 목록
    List<Follow> findByFollowerId(String followerId);

    // 특정 사용자를 팔로우한 목록
    List<Follow> findByFolloweeId(String followeeId);

    // 이미 팔로우 중인지 확인
    boolean existsByFollowerIdAndFolloweeId(String followerId, String followeeId);

    // 언팔로우
    void deleteByFollowerIdAndFolloweeId(String followerId, String followeeId);

    // 선택적 단건 조회 (언팔로우 로깅용)
    Optional<Follow> findFirstByFollowerIdAndFolloweeId(String followerId, String followeeId);
}