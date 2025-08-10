package com.teeup.teeup_backend.controller;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.teeup.teeup_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserRepository userRepo;

    @GetMapping("/exists")
    public Map<String, Boolean> exists(@RequestParam String loginId) {
        return Map.of("exists", userRepo.existsByLoginId(loginId));
    }
}
