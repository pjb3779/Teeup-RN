package com.teeup.teeup_backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.teeup.teeup_backend.dto.BuddySearchRequest;
import com.teeup.teeup_backend.dto.UserResponse;
import com.teeup.teeup_backend.model.User;
import com.teeup.teeup_backend.service.MatchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/match")
@RequiredArgsConstructor
public class MatchController {
    
    @Autowired
    private MatchService matchService;

    @GetMapping("/recommendations")
    public ResponseEntity<List<UserResponse>> getRecommendations(@RequestParam String loginId) {
        List<UserResponse> recommended = matchService.getRecommendations(loginId);
        return ResponseEntity.ok(recommended);
    }

    //목적 추가하기
    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchBuddies(@ModelAttribute BuddySearchRequest req) {
        List<User> result = matchService.searchBuddies(req);
        // User → UserResponse 변환
        List<UserResponse> responseList = result.stream()
            .map(UserResponse::new)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }
}
