package com.coffee.shop.dto.response;

import com.coffee.shop.enums.OrderStatus;
import com.coffee.shop.enums.OrderType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponseDto {
    private Long id;
    private Long tableId;
    private String tableNumber;
    private Long userId;
    private String userFullName;
    private OrderType type;
    private OrderStatus status;
    private BigDecimal amount;
    private BigDecimal discount;
    private LocalDateTime createdAt;
    private LocalDateTime closedAt;
}
