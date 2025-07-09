package com.teeup.teeup_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.teeup.teeup_backend.model.User;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommunityUserResponse {
    private String loginId;
    private String nickname;
    private String golf_level;
    private String avatar_url;
    private int followerCount;
    private int followingCount;
    private String postId;
    
    public CommunityUserResponse(User user){
        this.loginId = user.getLoginId();
        this.nickname = user.getNickname();
        this.golf_level = user.getGolfLevel();
        this.avatar_url = user.getAvatarUrl();
        this.followerCount = user.getFollowerCount();
        this.followingCount = user.getFollowingCount();
    }
}
