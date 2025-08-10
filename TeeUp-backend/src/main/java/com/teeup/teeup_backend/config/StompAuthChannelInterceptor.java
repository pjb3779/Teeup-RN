package com.teeup.teeup_backend.config;

import java.util.List;
import org.springframework.messaging.*;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.messaging.support.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
public class StompAuthChannelInterceptor implements ChannelInterceptor {
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor acc = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (acc != null && StompCommand.CONNECT.equals(acc.getCommand())) {
            String loginId = acc.getFirstNativeHeader("loginId");
            System.out.println("[WS CONNECT] loginId=" + loginId); // ★ 로그
            if (loginId == null || loginId.isBlank()) {
                throw new IllegalArgumentException("loginId header required");
            }
            acc.setUser(new UsernamePasswordAuthenticationToken(loginId.trim(), null, List.of()));
        }
        return message;
    }
}
