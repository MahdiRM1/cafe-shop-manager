package com.coffee.shop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemResponseDto {
    private Long id;
    private String name;
    private BigDecimal price;
    private boolean available;
    private String imagePath;
    private String description;
    private Long categoryId;
    private String categoryName;
}
