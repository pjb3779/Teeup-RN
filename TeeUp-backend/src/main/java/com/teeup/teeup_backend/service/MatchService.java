package com.teeup.teeup_backend.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.teeup.teeup_backend.dto.UserResponse;
import com.teeup.teeup_backend.model.User;
import com.teeup.teeup_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MatchService {
    
    private UserRepository userRepository;
    //private PreferenceRepository preferenceRepository;    //구현필요

    public List<UserResponse> getRecommendations(String userId) {
        Optional<User> userOpt = userRepository.findByUserid(userId);
        if (userOpt.isEmpty()) return Collections.emptyList();

        User user = userOpt.get();

        // 기본적으로 모든 유저를 가져오고 (자기 자신 제외)
        //추후 진짜 추천로직 구현
        List<User> candidates = userRepository.findAll().stream()
            .filter(u -> !u.getId().equals(user.getId()))
            .collect(Collectors.toList());

        // 나중에 선호 조건이나 거리 계산을 추가하면 좋음

        // UserResponse로 변환
        return candidates.stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }
}
