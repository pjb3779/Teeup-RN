package com.teeup.teeup_backend.service;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.teeup.teeup_backend.model.Follow;
import com.teeup.teeup_backend.repository.FollowRepository;
import com.teeup.teeup_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor   // Lombok
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    @Transactional
    public void follow(String followerLoginId, String followeeLoginId) {

        // 1) 이미 팔로우하면 무시
        if (followerLoginId.equals(followeeLoginId)) {
            throw new IllegalArgumentException("자기 자신을 팔로우할 수 없습니다.");
        }

        // ⭐ followee or follower가 DB에 존재하는지 먼저 검사
        boolean followeeExists = userRepository.findByLoginId(followeeLoginId).isPresent();
        if (!followeeExists) {
            throw new NoSuchElementException("팔로우 대상 사용자가 존재하지 않습니다: " + followeeLoginId);
        }
        boolean followerExists = userRepository.findByLoginId(followerLoginId).isPresent();
        if (!followerExists) {
            throw new NoSuchElementException("팔로워 사용자가 존재하지 않습니다: " + followerLoginId);
        }
        // 2) 이미 팔로우 중인 경우 무시
        if (followRepository.existsByFollowerIdAndFolloweeId(followerLoginId, followeeLoginId)) {
            return;
        }
        
        // 3) Follow 레코드 저장
        Follow follow = Follow.builder()
                .followerId(followerLoginId)
                .followeeId(followeeLoginId)
                .createdAt(Instant.now())
                .build();
        followRepository.save(follow);

        // 4) followee의 FollowerCount +1
        userRepository.findByLoginId(followeeLoginId)
                .ifPresent(user -> {
                    user.setFollowerCount(user.getFollowerCount() + 1);
                    userRepository.save(user);
                });

        // 5) follower(Follower)의 FollowingCount +1
        userRepository.findByLoginId(followerLoginId)
                .ifPresent(user -> {
                    user.setFollowingCount(user.getFollowingCount() + 1);
                    userRepository.save(user);
                });
    }

    /**
     * 언팔로우 
     */
    @Transactional
    public void unfollow(String followerLoginId, String followeeLoginId) {
        
        // 1) Follow 레코드 삭제
        followRepository.deleteByFollowerIdAndFolloweeId(followerLoginId, followeeLoginId);

        // 2) followee의 FollowerCount -1
        userRepository.findByLoginId(followeeLoginId)
                .ifPresent(user -> {
                    user.setFollowerCount(Math.max(user.getFollowerCount() - 1, 0));
                    userRepository.save(user);
                });

        // 3) follower의 FollowingCount -1
        userRepository.findByLoginId(followerLoginId)
                .ifPresent(user -> {
                    user.setFollowingCount(Math.max(user.getFollowingCount() - 1, 0));
                    userRepository.save(user);
                });
    }

    /**
     * 내가 팔로잉한 사람 목록
     */
    public List<String> getFollowingIds(String userId) {
        return followRepository.findByFollowerId(userId)
                            .stream()
                            .map(Follow::getFolloweeId)
                            .collect(Collectors.toList());
    }

    /**
     * 나를 팔로우한 사람 목록
     */
    public List<String> getFollowerIds(String userId) {
        return followRepository.findByFolloweeId(userId)
                            .stream()
                            .map(Follow::getFollowerId)
                            .collect(Collectors.toList());
    }

    /**
     * 팔로우 여부 확인
     */
    public boolean isFollowing(String followerId, String followeeId) {
        return followRepository.existsByFollowerIdAndFolloweeId(followerId, followeeId);
    }
}
