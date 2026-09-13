package com.coffee.shop.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantTableRequestDto {

    @NotBlank(message = "شماره برای رزرو نمی‌تواند خالی باشد")
    private String tableNumber;

    private Integer capacity;
}
