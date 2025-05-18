package com.teeup.teeup_backend.util;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

@Component
public class JwtUtils {

    @Value("${jwt.secretKey}") 
    private String secretKey;  // 비밀키 (application.properties 또는 application.yml에서 관리)

    final private long expirationTime = 1000 * 60 * 60;  // 1시간 만료

    // JWT 생성 메소드
    public String generateJwtToken(String username) {
        return JWT.create()
                .withSubject(username)  // 사용자명
                .withIssuedAt(new Date())  // 발행 시간
                .withExpiresAt(new Date(System.currentTimeMillis() + expirationTime))  // 만료 시간
                .sign(Algorithm.HMAC512(secretKey));  // 서명
    }

    // JWT에서 사용자명 추출
    public String getUserNameFromJwtToken(String token) {
        DecodedJWT decodedJWT = JWT.require(Algorithm.HMAC512(secretKey))
                .build()
                .verify(token);  // 토큰 검증
        return decodedJWT.getSubject();  // 사용자명 반환
    }
}
