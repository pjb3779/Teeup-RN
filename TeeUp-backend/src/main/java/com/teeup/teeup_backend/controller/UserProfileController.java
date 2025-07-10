package com.teeup.teeup_backend.controller;

import java.util.Optional;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teeup.teeup_backend.dto.AvatarResponse;
import com.teeup.teeup_backend.dto.UserProfileResponse;
import com.teeup.teeup_backend.dto.UserUpdateProfile;
import com.teeup.teeup_backend.model.User;
import com.teeup.teeup_backend.repository.UserRepository;
import com.teeup.teeup_backend.service.UserService;
import com.teeup.teeup_backend.util.JwtUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @Autowired
    public UserProfileController(UserService userService, JwtUtils jwtUtils, UserRepository userRepository) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(
        @RequestHeader("loginId") String loginId
    ) {
        try {
            Optional<User> userOpt = userRepository.findByLoginId(loginId);
            System.out.println("\n\nloginId: " + loginId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                UserProfileResponse profile = new UserProfileResponse(
                        user.getNickname(),
                        user.getAvatarUrl(),
                        user.getGender(),
                        user.getAge(),
                        user.getGolfLevel()
                );
                return ResponseEntity.ok(profile);
            } else {
                return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
        }
    }

    @PutMapping("/edit")
    public ResponseEntity<?> updateProfile(
        @RequestHeader("loginId") String loginId, 
        @RequestBody @Valid UserUpdateProfile dto
    ) {
        try {
            User updated = userService.updateUserProfile(loginId, dto);
            UserUpdateProfile updatedProfile = new UserUpdateProfile();
            updatedProfile.setNickname(updated.getNickname());
            updatedProfile.setAvatarUrl(updated.getAvatarUrl());
            updatedProfile.setGender(updated.getGender());
            updatedProfile.setAge(updated.getAge());
            updatedProfile.setGolfLevel(updated.getGolfLevel());
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("업데이트 실패 ㅜㅜ");
        }
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(
        @RequestHeader("loginId") String loginId, 
        @RequestParam("file") MultipartFile file
    ) {
        System.out.println("\n\n\n\nAvatar upload requested for loginId: " + loginId);

        try {
            String avatarUrl = userService.storeUserAvatar(loginId, file);
            UserUpdateProfile updatedProfile = new UserUpdateProfile();
            updatedProfile.setAvatarUrl(avatarUrl);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("아바타 업로드 실패");
        }
    }

    @GetMapping("/avatar/get")
    public ResponseEntity<AvatarResponse> fetchAvatar(
        @RequestHeader("loginId") String loginId
    ){
        String url = userService.getAvatarUrl(loginId);
        return ResponseEntity.ok(new AvatarResponse(url));
    }
}
