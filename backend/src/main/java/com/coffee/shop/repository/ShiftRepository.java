package com.coffee.shop.repository;

import com.coffee.shop.entity.Shift;
import com.coffee.shop.enums.ShiftStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShiftRepository extends JpaRepository<Shift, Long> {
    List<Shift> findByUserId(Long userId);
    Optional<Shift> findByUserIdAndStatus(Long user_id, ShiftStatus status);
}
