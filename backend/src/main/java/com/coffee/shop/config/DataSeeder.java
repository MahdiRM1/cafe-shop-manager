package com.coffee.shop.config;

import com.coffee.shop.entity.User;
import com.coffee.shop.enums.UserRole;
import com.coffee.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @Override
    public void run(String @NonNull ... args) {
        if (!userRepository.existsByRole(UserRole.MANAGER)){
            User manager = new User();
            manager.setUsername("admin");
            manager.setPasswordHash(encoder.encode("admin123"));
            manager.setFullName("مدیر سیستم");
            manager.setRole(UserRole.MANAGER);
            userRepository.save(manager);
        }
    }
}
