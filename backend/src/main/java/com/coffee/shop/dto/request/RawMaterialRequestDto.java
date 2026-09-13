package com.coffee.shop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RawMaterialRequestDto {

    @NotBlank(message = "نام ماده اولیه نمی‌تواند خالی باشد")
    @Size(max = 100, message = "نام ماده نمی‌تواند از ۱۰۰ کاراکتر بیشتر باشد")
    private String name;

    @NotBlank(message = "واحد ماده نمی‌تواند خالی باشد")
    @Size(max = 10, message = "واحد ماده نمی‌تواند از ۱۰ کاراکتر بیشتر باشد")
    private String unit;

    @PositiveOrZero(message = "آستانه هشدار نمی‌تواند منفی باشد")
    private BigDecimal minStockAlert;
}