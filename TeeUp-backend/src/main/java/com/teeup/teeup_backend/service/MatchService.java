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
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    //private PreferenceRepository preferenceRepository;    //구현필요

    public List<UserResponse> getRecommendations(String loginId) {
        Optional<User> userOpt = userRepository.findByLoginId(loginId);
        if (userOpt.isEmpty()) return Collections.emptyList();

        User user = userOpt.get();

        // 기본적으로 모든 유저를 가져오고 (자기 자신 제외)
        // 추후 진짜 추천로직 구현
        List<User> candidates = userRepository.findAll().stream()
            .filter(u -> !u.getUserId().equals(user.getUserId()))
            .limit(5)
            .collect(Collectors.toList());

        return candidates.stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    public List<User> searchBuddies(BuddySearchRequest req) {
        List<User> allUsers = userRepository.findAll();

        return allUsers.stream()
<<<<<<< HEAD
        //.filter(user -> isGenderMatched(user, req.getGender()))
        //.filter(user -> isAgeInRange(user, req.getAgeMin(), req.getAgeMax()))
        //.filter(user -> isLevelMatched(user, req.getLevel()))
        // .filter(user -> hasMatchingPurpose(user.getUserId(), req.getPurposeIds()))
        // .filter(user -> isWithinDistance(user.getUserId(), req.getLat(), req.getLng(), req.getRadius()))
        .collect(Collectors.toList());
=======
            .filter(user -> isGenderMatched(user, req.getGender()))
            .filter(user -> isAgeInRange(user, req.getAgeMin(), req.getAgeMax()))
            .filter(user -> isLevelMatched(user, req.getLevel()))
            .filter(user -> isNicknameMatched(user, req.getNickname()))
            .filter(user -> isAreaMatched(user, req.getArea()))
            // .filter(user -> hasMatchingPurpose(user.getUserId(), req.getPurposeIds()))
            // .filter(user -> isWithinDistance(user.getUserId(), req.getLat(), req.getLng(), req.getRadius()))
            .collect(Collectors.toList());
>>>>>>> 1e6b5e627413331230e393dd8da9641e9dad8ddb
    }

    private boolean isGenderMatched(User user, String gender) {
        return gender == null || gender.isBlank() || gender.equals(user.getGender());
    }

    private boolean isAgeInRange(User user, Integer min, Integer max) {
        if (min == null && max == null) return true;

        int age = user.getAge();

        if (min != null && age < min) return false;
        if (max != null && age > max) return false;

        return true;
    }

    private boolean isLevelMatched(User user, String level) {
        return level == null || level.isBlank() || level.equals(user.getGolfLevel());
    }

    private boolean isNicknameMatched(User user, String nickname) {
        return nickname == null 
            || nickname.isBlank()
            || (user.getNickname() != null && user.getNickname().contains(nickname));
    }

    private boolean isAreaMatched(User user, String area) {
        return area == null 
            || area.isBlank()
            || (user.getArea() != null && user.getArea().contains(area));
    }

    // private boolean hasMatchingPurpose(ObjectId userId, List<String> reqPurposeIds) { ... }

    // private boolean isWithinDistance(ObjectId userId, double lat, double lng, double radiusKm) { ... }
}
