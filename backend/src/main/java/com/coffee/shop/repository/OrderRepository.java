package com.coffee.shop.repository;

import com.coffee.shop.entity.Order;
import com.coffee.shop.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByTableId(Long tableId);
    List<Order> findByClosedAt_Date(LocalDate closedAtDate);
    List<Order> findByClosedAtBetween(LocalDateTime from, LocalDateTime to);
}
