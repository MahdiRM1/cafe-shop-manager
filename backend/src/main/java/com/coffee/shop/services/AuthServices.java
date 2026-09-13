package com.coffee.shop.services;

import com.coffee.shop.auth.JwtUtil;
import com.coffee.shop.dto.request.LoginRequestDto;
import com.coffee.shop.dto.request.RegisterRequestDto;
import com.coffee.shop.dto.response.AuthResponseDto;
import com.coffee.shop.entity.User;
import com.coffee.shop.enums.UserRole;
import com.coffee.shop.exception.DuplicateResourceException;
import com.coffee.shop.exception.ErrorCode;
import com.coffee.shop.exception.IncorrectPasswordException;
import com.coffee.shop.exception.ResourceNotFoundException;
import com.coffee.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServices {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;


    public AuthResponseDto register(RegisterRequestDto dto) {
        if (userRepository.existsByUsername(dto.getUsername()))
            throw new DuplicateResourceException(ErrorCode.USERNAME_ALREADY_EXISTS);

        User user = new User();
        user.setFullName(dto.getFullName());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setUsername(dto.getUsername());
        user.setRole(UserRole.CASHIER);

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getId(), saved.getUsername(), saved.getRole());
        return toResponseDto(user.getUsername(), token);
    }

    public AuthResponseDto login(LoginRequestDto dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND));

        boolean checkPassword = passwordEncoder.matches(dto.getPassword(), user.getPassword());
        if (!checkPassword) throw new IncorrectPasswordException();
        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());

        return toResponseDto(user.getUsername(), token);
    }

    public AuthResponseDto toResponseDto(String username, String token) {
        return new AuthResponseDto(username, token);
    }

}
