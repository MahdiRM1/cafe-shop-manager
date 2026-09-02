package com.coffee.shop.dto.response;

import com.coffee.shop.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseResponseDto {
    private Long id;
    private Long userId;
    private String userFullName;
    private OrderStatus status;
    private BigDecimal amount = BigDecimal.ZERO;
    private LocalDateTime createdAt;
    private LocalDateTime closedAt;
}
