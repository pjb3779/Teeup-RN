package com.teeup.teeup_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor // ✅ 모든 필드 생성자 자동 생성됨
public class UserProfileResponse {
    private String nickname;
    private String avatarUrl;
    private String gender;
    private int age;
    private String golfLevel;
}
