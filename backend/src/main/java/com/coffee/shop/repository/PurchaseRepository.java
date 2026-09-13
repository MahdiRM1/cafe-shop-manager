package com.coffee.shop.repository;

import com.coffee.shop.entity.Purchase;
import com.coffee.shop.entity.User;
import com.coffee.shop.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByStatus(OrderStatus status);
    List<Purchase> findByClosedAtBetween(LocalDateTime from, LocalDateTime to);
    Optional<Purchase> findByUserAndStatus(User user, OrderStatus status);
}
