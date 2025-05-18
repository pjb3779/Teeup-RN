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
    private ObjectId id;        //고유 아이디 번호
    private String openid;      //공개 고유 아이디디

    private String userid;      //로그인 아이디
    private String password;    //로그인 비밀번호
    private String nickname;
    private String avatarUrl;
    private String gender;
    private int age;
    private String golfLevel;
    
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
