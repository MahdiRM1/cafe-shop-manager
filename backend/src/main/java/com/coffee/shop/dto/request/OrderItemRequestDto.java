package com.coffee.shop.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequestDto {
    @NotNull(message = "آیتم منو مربوطه نمی تواند خالی باشد")
    private Long menuItemId;

    @NotNull(message = "تعداد نمی تواند خالی باشد")
    @Positive(message = "تعداد باید مثبت باشد")
    private BigDecimal quantity;

    private String note;
}
