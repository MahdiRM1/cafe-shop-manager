package com.coffee.shop.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeItemRequestDto {

    @NotNull(message = "ماده اولیه رسپی نمیتواند خالی باشد")
    private Long rawMaterialId;

    @NotNull(message = "مقدار ماده رسپی نمیتواند خالی باشد")
    private BigDecimal quantityNeeded;

}
