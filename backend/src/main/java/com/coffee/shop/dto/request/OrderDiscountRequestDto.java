package com.coffee.shop.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDiscountRequestDto {

    @NotNull(message = "مقدار تخفیف نمیتواند خالی باشد")
    private Double discountPercent;

}
