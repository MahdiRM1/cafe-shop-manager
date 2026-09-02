package com.coffee.shop.dto.response;

import com.coffee.shop.enums.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String fullName;
    private String username;
    private UserRole role;
    private boolean active;
    private LocalDateTime createdAt;
}
