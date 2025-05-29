package com.teeup.teeup_backend.dto;

import lombok.Data;

// 로그인 요청 시 필요한 데이터 포맷 (openid 기반 로그인)
@Data
public class LoginRequest {
    private String loginid;
    private String password;
}
