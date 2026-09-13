package com.coffee.shop.controller;

import com.coffee.shop.dto.request.LoginRequestDto;
import com.coffee.shop.dto.request.RegisterRequestDto;
import com.coffee.shop.dto.response.AuthResponseDto;
import com.coffee.shop.dto.response.UserResponseDto;
import com.coffee.shop.services.AuthServices;
import com.coffee.shop.services.UserServices;
import com.coffee.shop.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthServices authServices;
    private final UserServices userServices;

    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody @Valid RegisterRequestDto dto) {
        return ResponseEntity.ok(authServices.register(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody @Valid LoginRequestDto dto) {
        return ResponseEntity.ok(authServices.login(dto));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> me(@AuthenticationPrincipal User principal) {
        return ResponseEntity.ok(userServices.getById(principal.getId()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok().build();
    }

}
