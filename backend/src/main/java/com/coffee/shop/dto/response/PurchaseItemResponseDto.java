package com.coffee.shop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseItemResponseDto {
    private Long id;
    private Long purchaseId;
    private Long materialId;
    private String materialName;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private String note;
}
