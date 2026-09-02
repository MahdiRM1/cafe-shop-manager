package com.coffee.shop.dto.response;

import com.coffee.shop.enums.TableStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantTableResponseDto {
    private Long id;
    private String tableNumber;
    private Integer capacity;
    private TableStatus status;
}
