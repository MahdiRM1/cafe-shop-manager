package com.coffee.shop.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopSellingItemDto {
    private Long menuItemId;
    private String menuItemName;
    private BigDecimal totalQuantitySold;
    private BigDecimal totalRevenue;
}