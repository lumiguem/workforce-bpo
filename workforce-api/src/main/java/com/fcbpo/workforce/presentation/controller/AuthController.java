package com.fcbpo.workforce.presentation.controller;

import com.fcbpo.workforce.application.dto.AuthResponse;
import com.fcbpo.workforce.application.dto.LoginRequest;
import com.fcbpo.workforce.application.dto.RegisterRequest;
import com.fcbpo.workforce.application.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}