package com.teeup.teeup_backend.dto;

import lombok.Data;

@Data
public class UserUpdateProfile {
    private String nickname;
    private String avatarUrl;
    private String gender;
    private int age;
    private String golfLevel;
}
