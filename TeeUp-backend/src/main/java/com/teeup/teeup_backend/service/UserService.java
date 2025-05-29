package com.teeup.teeup_backend.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.teeup.teeup_backend.dto.SignupRequest;
import com.teeup.teeup_backend.model.User;
import com.teeup.teeup_backend.repository.UserRepository;

// 사용자 관련 핵심 비즈니스 로직 처리 서비스
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); //비밀번호 암호황

    // 회원가입 처리 메서드
    public User register(SignupRequest req) {
        //비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(req.getPassword());

        User user = new User();
        // SignupRequest의 필드를 User 객체로 복사
        BeanUtils.copyProperties(req, user);
        user.setPassword(encodedPassword);  // 암호화된 비밀번호 저장
        user.setCreatedAt(LocalDateTime.now()); // 생성 시간 설정
        return userRepository.save(user); // DB에 저장
    }

    //로그인 처리 메서드
    public Optional<User> login(String loginId, String password) {
        //userid로 사용자 존재 여부 확인
        Optional<User> userOpt = userRepository.findByLoginId(loginId);
        if(userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return userOpt;  // 비밀번호 일치하면 로그인 성공
        }
        return Optional.empty(); // 실패
    }
}
