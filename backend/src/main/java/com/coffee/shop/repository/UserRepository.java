package com.coffee.shop.repository;

import com.coffee.shop.entity.User;
import com.coffee.shop.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByRole(UserRole role);
}
