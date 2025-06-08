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

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHead) {
        System.out.println("📦 전달받은 Authorization 헤더: " + authHead);

        try {
            // Bearer 부분 삭제 후 userid 추출
            String rawToken = authHead.replace("Bearer ", "");
            System.out.println("📦 추출된 토큰: " + rawToken);
            String userid = jwtUtils.getUserNameFromJwtToken(rawToken);
            System.out.println("📦 추출된 userid: " + userid);

            if(userid == null || userid.isEmpty()) {
                return ResponseEntity.status(401).body("야 userid가 아마 없을껄?");
            }

            // userid 기준 사용자 조회
            Optional<User> userOpt = userService.getUserProfile(userid);

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
                return ResponseEntity.status(404).body("뭔가 단단히 잘못된거 같습니다만");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("유효하지 않은 토큰입니다.");
        }
    }

    @PutMapping("/edit")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String authHead, @RequestBody @Valid UserUpdateProfile dto){
        try{

            String rawToken = authHead.replace("Bearer ", "");
            String userid = jwtUtils.getUserNameFromJwtToken(rawToken);

            if(userid == null || userid.isEmpty()) {
                return ResponseEntity.status(401).body("야 userid가 아마 없을껄?");
            }

            User updated = userService.updateUserProfile(userid, dto);
            UserUpdateProfile updatedProfile = new UserUpdateProfile();
            updatedProfile.setNickname(updated.getNickname());
            updatedProfile.setAvatarUrl(updated.getAvatarUrl());
            updatedProfile.setGender(updated.getGender());
            updatedProfile.setAge(updated.getAge());
            updatedProfile.setGolfLevel(updated.getGolfLevel());

            return ResponseEntity.ok(updatedProfile);
        }
        catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(401).body("업데이트 실패 ㅜㅜ");
        }
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestHeader("Authorization") String authHead, @RequestParam("file") MultipartFile file){
        try{
            String rawToken = authHead.replace("Bearer ", "");
            String userid = jwtUtils.getUserNameFromJwtToken(rawToken);

            if(userid == null || userid.isEmpty()) {
                return ResponseEntity.status(401).body("야 userid가 아마 없을껄?");
            }
            
            String avataUrl = userService.storeUserAvatar(userid, file);
            
            UserUpdateProfile updatedProfile = new UserUpdateProfile();
            updatedProfile.setAvatarUrl(avataUrl);

            return ResponseEntity.ok(updatedProfile);
        }
        catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body("아바타 업로드 실패");
        }
    }
}