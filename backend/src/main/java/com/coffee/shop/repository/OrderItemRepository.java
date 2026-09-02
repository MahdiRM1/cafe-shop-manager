package com.coffee.shop.repository;

import com.coffee.shop.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);

    @Query("""
    SELECT oi.menuItem.id, oi.menuItem.name, SUM(oi.quantity), SUM(oi.unitPrice * oi.quantity)
    FROM OrderItem oi
    WHERE oi.order.status = 'CLOSED' AND oi.order.closedAt BETWEEN :from AND :to
    GROUP BY oi.menuItem.id, oi.menuItem.name
    ORDER BY SUM(oi.quantity) DESC
""")
    List<Object[]> findTopSellingItems(LocalDateTime from, LocalDateTime to);
}
