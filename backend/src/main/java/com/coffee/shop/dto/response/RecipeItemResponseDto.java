package com.coffee.shop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeItemResponseDto {
    private Long id;
    private Long menuItemId;
    private String menuItemName;
    private Long rawMaterialId;
    private String rawMaterialName;
    private BigDecimal quantityNeeded;
}
