package com.coffee.shop.dto.response;

import com.coffee.shop.enums.InventoryTransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryTransactionResponseDto {
    private Long id;
    private Long rawMaterialId;
    private String rawMaterialName;
    private BigDecimal changeAmount;
    private InventoryTransactionType type;
    private String reason;
    private Long relatedOrderId;
    private LocalDateTime createdAt;
}

