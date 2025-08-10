package com.teeup.teeup_backend.dto;

import lombok.*;

@Getter @Setter
public class SendMessageReq {
    private String type;    // TEXT, IMAGE...
    private String content;
}
