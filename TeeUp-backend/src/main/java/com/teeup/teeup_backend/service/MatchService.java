package com.teeup.teeup_backend.service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.teeup.teeup_backend.dto.BuddySearchRequest;
import com.teeup.teeup_backend.dto.UserResponse;
import com.teeup.teeup_backend.model.User;
import com.teeup.teeup_backend.repository.LocationRepository;
import com.teeup.teeup_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MatchService {
    
    @Autowired
    private UserRepository userRepository;
    private LocationRepository locationRepository;
    //private PreferenceRepository preferenceRepository;    //구현필요

    public List<UserResponse> getRecommendations(String loginId) {
        Optional<User> userOpt = userRepository.findByLoginId(loginId);
        if (userOpt.isEmpty()) return Collections.emptyList();

        User user = userOpt.get();

        // 기본적으로 모든 유저를 가져오고 (자기 자신 제외)
        //추후 진짜 추천로직 구현
        List<User> candidates = userRepository.findAll().stream()
            .filter(u -> !u.getUserId().equals(user.getUserId()))
            .limit(5)//인원 제한
            .collect(Collectors.toList());

        // 나중에 선호 조건이나 거리 계산을 추가하면 좋음

        // UserResponse로 변환
        return candidates.stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    public List<User> searchBuddies(BuddySearchRequest req) {
        List<User> allUsers = userRepository.findAll();

        return allUsers.stream()
        //.filter(user -> isGenderMatched(user, req.getGender()))
        //.filter(user -> isAgeInRange(user, req.getAgeMin(), req.getAgeMax()))
        //.filter(user -> isLevelMatched(user, req.getLevel()))
        // .filter(user -> hasMatchingPurpose(user.getUserId(), req.getPurposeIds()))
        // .filter(user -> isWithinDistance(user.getUserId(), req.getLat(), req.getLng(), req.getRadius()))
        .collect(Collectors.toList());
    }

    // private boolean hasMatchingPurpose(ObjectId userId, List<String> reqPurposeIds) {
    //     List<ObjectId> userPurposeIds = preferencePurposeRepository.findPurposeIdsByUserId(userId);
    //     return userPurposeIds.stream()
    //             .map(ObjectId::toHexString)
    //             .anyMatch(reqPurposeIds::contains);
    // }

    // private boolean isWithinDistance(ObjectId userId, double lat, double lng, double radiusKm) {
    //     Location loc = LocationRepository.findByUserId(userId);
    //     if (loc == null) return false;
    //     return DistanceUtil.calculateDistance(lat, lng, loc.getLat(), loc.getLng()) <= radiusKm;
    // }
    private boolean isGenderMatched(User user, String gender) {
        return gender == null || gender.isBlank() || gender.equals(user.getGender());
    }

    private boolean isAgeInRange(User user, Integer min, Integer max) {
        if (min == null || max == null) return true;
        int age = user.getAge();
        return age >= min && age <= max;
    }

    private boolean isLevelMatched(User user, String level) {
        return level == null || level.isBlank() || level.equals(user.getGolfLevel());
    }

    // private boolean hasMatchingPurpose(ObjectId userId, List<String> targetPurposeIds) {
    //     if (targetPurposeIds == null || targetPurposeIds.isEmpty()) return true;

    //     List<ObjectId> userPurposeIds = preferencePurposeRepository.findPurposeIdsByUserId(userId);
    //     return userPurposeIds.stream()
    //         .map(ObjectId::toHexString)
    //         .anyMatch(targetPurposeIds::contains);
    // }

    // private boolean isWithinDistance(ObjectId userId, Double lat, Double lng, Double radiusKm) {
    //     if (lat == null || lng == null || radiusKm == null) return true;

    //     Location loc = locationRepository.findById(userId);
    //     if (loc == null) return false;

    //     return DistanceUtil.calculateDistance(lat, lng, loc.getLat(), loc.getLng()) <= radiusKm;
    // }

}  
