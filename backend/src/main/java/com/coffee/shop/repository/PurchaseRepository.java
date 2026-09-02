package com.coffee.shop.repository;

import com.coffee.shop.entity.Purchase;
import com.coffee.shop.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByStatus(OrderStatus status);
    List<Purchase> findByClosedAt_Date(LocalDate date);
}
