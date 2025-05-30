package com.teeup.teeup_backend.controller;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.teeup.teeup_backend.dto.UserResponse;
import com.teeup.teeup_backend.service.MatchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/match")
@RequiredArgsConstructor
public class MatchController {
    
    @Autowired
    private MatchService matchService;

    @GetMapping("/recommendations")
    public ResponseEntity<List<UserResponse>> getRecommendations(@RequestParam ObjectId userId) {
        List<UserResponse> recommended = matchService.getRecommendations(userId);
        return ResponseEntity.ok(recommended);
    }
}
