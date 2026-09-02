package com.coffee.shop.dto.request;

import com.coffee.shop.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDto {

    @NotNull(message = "مقدار پرداخت نمی تواند خالی باشد")
    @Positive(message = "مقدار پرداخت باید مثبت باشد")
    private BigDecimal amount;

    @NotNull(message = "نوع پرداخت نمی تواند خالی باشد")
    private PaymentMethod method;
}
