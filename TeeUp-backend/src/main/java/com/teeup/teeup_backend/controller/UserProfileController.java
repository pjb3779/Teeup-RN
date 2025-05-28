package com.teeup.teeup_backend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teeup.teeup_backend.dto.UserProfileResponse;
import com.teeup.teeup_backend.model.User;
import com.teeup.teeup_backend.service.UserService;
import com.teeup.teeup_backend.util.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private static final Logger logger = LoggerFactory.getLogger(UserProfileController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping
    public ResponseEntity<?> getProfoile(@RequestHeader("Authorization") String authHead) {
        try {
            // Bearer 부분 삭제 후 user-open id 추출
            String rawToken = authHead.replace("Bearer ", "");
            String openid = jwtUtils.getUserNameFromJwtToken(rawToken);

            // openid 기준 사용자 조회
            Optional<User> userOpt = userService.getUserProfile(openid);

            if (userOpt.isPresent()) {
                User user = userOpt.get();
                logger.debug("✅ [DEBUG] 유저 프로필 조회 성공: {}", user.getNickname());

                UserProfileResponse profile = new UserProfileResponse(
                    user.getNickname(),
                    user.getAvatarUrl(),
                    user.getGender(),
                    user.getAge(),
                    user.getGolfLevel()
                );

                return ResponseEntity.ok(profile);
            } else {
                return ResponseEntity.status(404).body("뭔가 단단히 잘못된거 같습니다만");
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
        }
    }
}
