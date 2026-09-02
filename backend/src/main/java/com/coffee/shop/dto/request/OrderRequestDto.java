package com.coffee.shop.dto.request;

import com.coffee.shop.enums.OrderType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDto {
    private Long tableId;

    @NotNull(message = "نوع سفارش نمی تواند خالی باشد")
    private OrderType type;
}
