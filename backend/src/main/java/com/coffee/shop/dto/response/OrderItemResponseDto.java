package com.coffee.shop.dto.response;


import com.coffee.shop.enums.ItemStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponseDto {
    private Long id;
    private Long orderId;
    private Long menuItemId;
    private String menuItemName;
    private BigDecimal quantity;
    private BigDecimal unitPrice;
    private ItemStatus status;
    private String note;
}
