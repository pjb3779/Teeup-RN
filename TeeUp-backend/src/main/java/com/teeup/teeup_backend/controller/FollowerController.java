package com.teeup.teeup_backend.controller;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.teeup.teeup_backend.model.User;
import com.teeup.teeup_backend.repository.UserRepository;
import com.teeup.teeup_backend.service.FollowService;
import com.teeup.teeup_backend.service.UserService;
import com.teeup.teeup_backend.util.JwtUtils;

@RestController
@RequestMapping("/api/follows")
public class FollowerController {

    private final FollowService followService;
    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @Autowired
    public FollowerController(UserService userService, FollowService followService, JwtUtils jwtUtils, UserRepository userRepository){
        this.followService = followService;
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
    }

    /* 팔로우 생성하기 */
    @PostMapping("/{followeeLoginId}")
    public ResponseEntity<?> follow(
        @RequestHeader("loginId") String followerLoginId,
        @PathVariable String followeeLoginId
    ) {
        try {
            followService.follow(followerLoginId, followeeLoginId);
            return ResponseEntity.ok("팔로우 성공");
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());  // "자기 자신을 팔로우할 수 없습니다."
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("팔로우 처리 중 오류");
        }
    }


    /* 언팔로우 하기 */
    @DeleteMapping("/{followeeId}")
    public ResponseEntity<?> unfollow(
            @RequestHeader("loginId") String loginId,
            @PathVariable String followeeId
    ) {
        try{
            User follower = userRepository.findByLoginId(loginId)
                            .orElseThrow(()-> new NoSuchElementException("대상 사용자가 없습니다."));
            User followee = userRepository.findByLoginId(followeeId)
                            .orElseThrow(()-> new NoSuchElementException("대상 사용자가 없습니다."));

            followService.unfollow(
                    follower.getId().toString(),
                    followee.getId().toString()
            );
            return ResponseEntity.ok("언팔로우 성공");        
        }catch(NoSuchElementException e){
            return ResponseEntity.status(404).body(e.getMessage());
        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("언팔로우 처리 중 오류가 발생했습니다.");
        }
    }

    /* 특정 사용자의 팔로워 목록 조회하기 */
    @GetMapping("/followers/{targetLoginId}")
    public ResponseEntity<?> getFollowers(
            @RequestHeader("loginId") String loginId,      // 요청자(loginId)
            @PathVariable String targetLoginId             // 조회 대상(loginId)
    ) {
        try {
            // 1) 조회 대상이 실제로 존재하는지 확인
            userRepository.findByLoginId(targetLoginId)
                .orElseThrow(() -> new NoSuchElementException("조회 대상 사용자가 없습니다: " + targetLoginId));

            // 2) 서비스에서 대상 사용자를 팔로우한 사람들의 loginId 리스트 가져오기
            List<String> followerLogins = followService.getFollowerIds(targetLoginId);
            if(followerLogins.isEmpty()) {
                return ResponseEntity.ok("팔로워가 없습니다.");
            }

            // 3) loginId들로 User 객체들 한 번에 조회
            List<User> followers = userRepository.findByLoginIdIn(followerLogins);

            return ResponseEntity.ok(followers);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("팔로워 조회 중 오류가 발생했습니다.");
        }
    }

    /* 특정 사용자의 팔로잉 목록 조회하기 */
    @GetMapping("/followees/{targetLoginId}")
    public ResponseEntity<?> getFollowees(
            @RequestHeader("loginId") String loginId,      // 요청자(loginId)
            @PathVariable String targetLoginId             // 조회 대상(loginId)
    ) {
        try {
            // 1) 조회 대상이 실제로 존재하는지 확인
            userRepository.findByLoginId(targetLoginId)
                .orElseThrow(() -> new NoSuchElementException("조회 대상 사용자가 없습니다: " + targetLoginId));

            // 2) 서비스에서 대상 사용자가 팔로우한 사람들의 loginId 리스트 가져오기
            List<String> followeeLogins = followService.getFollowingIds(targetLoginId);
            if(followeeLogins.isEmpty()) {
                return ResponseEntity.ok("팔로잉이 없습니다.");
            }

            // 3) loginId들로 User 객체들 한 번에 조회
            List<User> followees = userRepository.findByLoginIdIn(followeeLogins);

            return ResponseEntity.ok(followees);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("팔로잉 조회 중 오류가 발생했습니다.");
        }
    }
}
