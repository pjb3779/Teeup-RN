package com.teeup.teeup_backend.service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

import com.teeup.teeup_backend.config.S3config;
import com.teeup.teeup_backend.dto.SignupRequest;
import com.teeup.teeup_backend.exception.DuplicateLoginIdException;
import com.teeup.teeup_backend.model.User;
import com.teeup.teeup_backend.repository.UserRepository;
import com.teeup.teeup_backend.dto.UserUpdateProfile;
import jakarta.validation.constraints.Null;
import com.teeup.teeup_backend.service.S3Service;
import com.teeup.teeup_backend.service.FollowService;
// 사용자 관련 핵심 비즈니스 로직 처리 서비스
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    private FollowService followService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // 비밀번호 암호황

    @Value("${file.upload-dir}")
    private String uploadDir;

    // 회원가입 처리 메서드
    public User register(SignupRequest req) {
        // 로그인 아이디 중복 확인
        if (userRepository.findByLoginId(req.getLoginId()).isPresent()) {
            // 중복 시 예외 던지기 (또는 원하는 에러 처리)
            throw new DuplicateLoginIdException("이미 사용 중인 아이디입니다.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(req.getPassword());

        User user = new User();
        // SignupRequest의 필드를 User 객체로 복사
        BeanUtils.copyProperties(req, user);
        user.setLoginId(req.getLoginId());
        user.setPassword(encodedPassword); // 암호화된 비밀번호 저장
        user.setCreatedAt(LocalDateTime.now()); // 생성 시간 설정
        return userRepository.save(user); // DB에 저장
    }

    // 로그인 처리 메서드
    public Optional<User> login(String loginId, String password) {
        // userid로 사용자 존재 여부 확인
        Optional<User> userOpt = userRepository.findByLoginId(loginId);
        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return userOpt; // 비밀번호 일치하면 로그인 성공
        }
        return Optional.empty(); // 실패
    }

    // 회원 정보 처리 메서드
    public Optional<User> getUserProfile(String loginId) {
        return userRepository.findByLoginId(loginId);
    }

    // 회원 정보 업데이트 메서드
    public User updateUserProfile(String loginId, UserUpdateProfile dto) {

        User user = userRepository.findByLoginId(loginId).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        System.out.println("업데이트 전 user: " + user);

        user.setNickname(dto.getNickname());
        user.setGender(dto.getGender());
        user.setAge(dto.getAge());
        user.setGolfLevel(dto.getGolfLevel());
        user.setAvatarUrl(dto.getAvatarUrl());

        User updateUser = userRepository.save(user);
        System.out.println("업데이트 후 user: " + updateUser);
        return updateUser;
    }

    private final S3Service s3Service;
    
    public UserService(UserRepository userRepository,
                        S3Service s3Service,
                        FollowService followService) {
        this.userRepository = userRepository;
        this.s3Service = s3Service;
        this.followService = followService;
    }

    // 회원 아바타 저장 메서드
    public String storeUserAvatar(String loginId, MultipartFile file) throws IOException {
        // S3Service의 uploadFileToS3 호출
        String avatarUrl = s3Service.uploadFileToS3(file);

        User user = userRepository.findByLoginId(loginId)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);
        return avatarUrl;
    }

    public List<User> getFollowers(String loginId){
        List<String> followerLogins = followService.getFollowerIds(loginId);
        return userRepository.findByLoginIdIn(followerLogins);
    }

    public List<User> getFollowees(String loginId) {
        List<String> followeeLogins = followService.getFollowingIds(loginId);
        return userRepository.findByLoginIdIn(followeeLogins);
    }
}
