package com.coffee.shop.dto.response;

import com.coffee.shop.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {
    private Long id;
    private Long orderId;
    private Long purchaseId;
    private BigDecimal amount;
    private PaymentMethod method;
    private LocalDateTime paidAt;
    private Long shiftId;
}
