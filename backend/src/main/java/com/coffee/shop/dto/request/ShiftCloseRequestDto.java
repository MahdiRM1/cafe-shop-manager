package com.coffee.shop.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShiftCloseRequestDto {

    @NotNull(message = "مقدار نقد شمارش‌شده نمی‌تواند خالی باشد")
    @PositiveOrZero(message = "مقدار نقد شمارش‌شده نمی‌تواند منفی باشد")
    private BigDecimal closingCash;

}