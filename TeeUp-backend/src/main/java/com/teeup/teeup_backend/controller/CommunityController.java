package com.teeup.teeup_backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.teeup.teeup_backend.dto.CommunityUserResponse;
import com.teeup.teeup_backend.dto.UserResponse;
import com.teeup.teeup_backend.model.User;
import com.teeup.teeup_backend.repository.UserRepository;
import com.teeup.teeup_backend.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {
    
    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping("/recommendations")
    public ResponseEntity<List<CommunityUserResponse>> getRecommendations(
        @RequestParam(defaultValue = "10") int limit,
        @RequestHeader("loginId") String loginId
        ) {
            List<CommunityUserResponse> users = userService.getRandomCommunityUsers(limit, loginId);
        return ResponseEntity.ok(users);
    }
    
}
