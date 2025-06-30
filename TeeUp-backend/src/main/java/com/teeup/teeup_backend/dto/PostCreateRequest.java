package com.teeup.teeup_backend.dto;

import com.teeup.teeup_backend.model.Post;
import com.teeup.teeup_backend.model.User;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class PostCreateRequest {
    @NotBlank(message = "제목을 작성하시지 않았습니다")
    private String title;

    @NotBlank(message = "내용을 작성하시지 않았습니다")
    private String contents;

    public Post toEntity(User author) {
        return Post.builder()
                .title(this.title)
                .content(this.contents)
                .authorId(author.getId())
                .build();
    }
}
