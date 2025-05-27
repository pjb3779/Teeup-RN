package com.teeup.teeup_backend.dto;

import com.teeup.teeup_backend.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String id;
    private String nickname;
    private String golf_level;
    private String avatar_url;

    public UserResponse(User user) {
        this.id = user.getId().toHexString();
        this.nickname = user.getNickname();
        this.golf_level = user.getGolfLevel();
        this.avatar_url = user.getAvatarUrl();
    }
}
