package com.teeup.teeup_backend.exception;

import java.util.Map;
import org.springframework.http.*;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class ChatExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String,String>> badRequest(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }

    // STOMP 에러를 프론트로 보낼 때
    @MessageExceptionHandler
    public Map<String, String> stompError(Exception e) {
        return Map.of("message", e.getMessage());
    }
}
