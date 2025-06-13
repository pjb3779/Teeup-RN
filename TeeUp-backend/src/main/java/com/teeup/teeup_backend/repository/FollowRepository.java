package com.teeup.teeup_backend.repository;

import com.teeup.teeup_backend.model.Follow;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;

public interface FollowRepository extends MongoRepository<Follow, ObjectId> {
    Optional<Follow> findByFollowerIdAndFolloweeId(ObjectId followerId, ObjectId followeeId);

    List<Follow> findAllByFollowerId(ObjectId followerId); // 내가 팔로우한 유저들
    List<Follow> findAllByFolloweeId(ObjectId followeeId); // 나를 팔로우한 유저들

    // long: 삭제된 도큐먼트 수
    long deleteByFollowerIdAndFolloweeId(ObjectId followerId, ObjectId followeeId);
}