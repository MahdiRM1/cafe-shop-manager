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
public class PurchaseItemRequestDto {
    @NotNull(message = "محصول مورد نظر نباید خالی باشد")
    private Long materialId;

    @NotNull(message = "تعداد محصول نمیتواند خالی باشد")
    @Positive(message = "تعداد محصولات باید مثبت باشند")
    private BigDecimal quantity;

    @NotNull(message = "قیمت نمیتواند خالی باشد")
    @Positive(message = "قیمت محصول باید مثبت باشند")
    private BigDecimal unitPrice;

    private String note;
}
