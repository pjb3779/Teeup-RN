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
    private ObjectId openid;      //userId

    private String userid;      //loginid
    private String password;    //로그인 비밀번호
    private String avatarUrl;
    private String gender;
    private int age;
    private String golfLevel;
    private String nickname;
    
    public String getNickname() {
        return this.nickname;
    }
    public String getId() {
        return this.userid != null ? this.userid : null;
    }

    private LocalDateTime createdAt = LocalDateTime.now();
}
