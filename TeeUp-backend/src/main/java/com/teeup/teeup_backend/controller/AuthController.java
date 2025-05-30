package com.teeup.teeup_backend.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teeup.teeup_backend.dto.LoginRequest;
import com.teeup.teeup_backend.dto.LoginResponse;
import com.teeup.teeup_backend.dto.SignupRequest;
import com.teeup.teeup_backend.model.User;
import com.teeup.teeup_backend.service.UserService;
import com.teeup.teeup_backend.util.JwtUtils;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils; // JwtUtils 주입받기

    //회원가입 API 엔드포인트
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest req) {
        userService.register(req);
        return ResponseEntity.ok("회원가입 성공공");         //성공시 사용자 정보 반환
    }

    //로그인인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {        
        log.info("🔍 받은 로그인 요청 전체: {}", req);
        log.info("🔍 로그인 요청 받음 - loginId: {}", req.getLoginId());

        Optional<User> userOpt = userService.login(req.getLoginId(), req.getPassword());

        if(userOpt.isPresent()) {
            User user = userOpt.get();
            String token = jwtUtils.generateJwtToken(user.getLoginId()); 
            return ResponseEntity.ok(new LoginResponse(user, token));    //사용자 존재시 200 ok + 사용자 정ㄷ보
        } else {
            log.warn("❌ 로그인 실패 - userOpt is empty for loginId: {}", req.getLoginId());
            return ResponseEntity.status(401).body("login failedㅠㅠ"); //로그인 실패 401 띄우기
        }
    }
    
}
