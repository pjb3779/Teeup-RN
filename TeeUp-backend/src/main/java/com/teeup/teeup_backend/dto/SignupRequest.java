package com.teeup.teeup_backend.dto;

import lombok.Data;


// 클라이언트에서 전송하는 회원가입 요청 데이터 포맷
@Data
public class SignupRequest {
    private String loginid;
    private String password;
}