package com.coffee.shop.dto.request;

import com.coffee.shop.enums.InventoryTransactionType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransactionRequestDto {
    @NotNull(message = "ماده اولیه نمی تواند خالی باشد")
    private Long rawMaterialId;

    @NotNull(message = "تغییر قیمت نمی تواند خالی باشد")
    private BigDecimal changeAmount;

    @NotNull(message = "نوع تراکنش نمی‌تواند خالی باشد")
    private InventoryTransactionType type;

    private String reason;
    private Long relatedOrderId;
}

