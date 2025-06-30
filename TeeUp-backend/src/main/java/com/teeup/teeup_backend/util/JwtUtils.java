package com.teeup.teeup_backend.util;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

@Component
public class JwtUtils {

    @Value("${jwt.secretKey}") 
    private String secretKey;  // 비밀키 (application.properties 또는 application.yml에서 관리)

    final private long expirationTime = 1000L * 60 * 60 * 24 * 7;  // 7일 만료

    // JWT 생성 메소드
    public String generateJwtToken(String username) {
        Date issuedAt = new Date();
        Date expiresAt = new Date(System.currentTimeMillis() + expirationTime);
        System.out.println("시스템 기본 시간대: " + java.util.TimeZone.getDefault().getID());
        System.out.println("토큰 발행 시간(iat): " + issuedAt);
        System.out.println("토큰 만료 시간(exp): " + expiresAt);
        
        return JWT.create()
                .withSubject(username)
                .withIssuedAt(issuedAt)
                .withExpiresAt(expiresAt)
                .sign(Algorithm.HMAC512(secretKey));

    }

    public String getUserNameFromJwtToken(String token) {
        try {
            // 검증 없이 토큰 내용(만료시간 포함)을 파싱
            DecodedJWT decodedWithoutVerification = JWT.decode(token);
            System.out.println("토큰의 만료 시간(exp): " + decodedWithoutVerification.getExpiresAt());
            System.out.println("현재 시간: " + new Date());

            // 실제 서명 및 만료 검증 (예외 발생 가능)
            JWTVerifier verifier = JWT.require(Algorithm.HMAC512(secretKey)).build();
            DecodedJWT decoded = verifier.verify(token);

            return decoded.getSubject();
        } catch (TokenExpiredException e) {
            System.out.println("토큰 만료됨: " + e.getMessage());
            return null;
        } catch (JWTVerificationException e) {
            e.printStackTrace();
            return null;
        }
    }
}
