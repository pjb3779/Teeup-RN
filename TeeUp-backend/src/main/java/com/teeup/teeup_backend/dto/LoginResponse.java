package com.teeup.teeup_backend.dto;

import com.teeup.teeup_backend.model.User;

public class LoginResponse {

    private User user;
    private String token;

    // 생성자
    public LoginResponse(User user, String token) {
        this.user = user;
        this.token = token;
    }

    // getter, setter
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
