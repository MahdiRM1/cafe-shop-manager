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
public class RestockRequestDto {

    @NotNull(message = "مقدار ورودی نمی‌تواند خالی باشد")
    @Positive(message = "مقدار ورودی باید مثبت باشد")
    private BigDecimal amount;

    private String reason;
}