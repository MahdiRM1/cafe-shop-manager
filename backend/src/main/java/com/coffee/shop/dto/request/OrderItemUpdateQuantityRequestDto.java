package com.coffee.shop.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemUpdateQuantityRequestDto {

    @NotNull(message = "مقدار محصول نمیتواند خالی باشد")
    private BigDecimal quantity;

}
