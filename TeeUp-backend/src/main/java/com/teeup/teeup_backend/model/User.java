package com.teeup.teeup_backend.model;

import java.time.LocalDateTime;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private ObjectId userId;      //공개 고유 아이디디

    private String loginId;      //로그인 아이디
    private String password;    //로그인 비밀번호
    private String avatarUrl;
    private String gender;
    private int age;
    private String golfLevel;
    private String nickname;
    private int FollowerCount = 0;
    private int FollowingCount = 0;

    public String getNickname() {
        return this.nickname;
    }
    public String getId() {
        return this.loginId != null ? this.loginId : null;
    }

    private LocalDateTime createdAt = LocalDateTime.now();
}
