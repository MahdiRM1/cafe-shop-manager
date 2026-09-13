package com.coffee.shop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemRequestDto {

    @NotBlank(message = "نام آیتم منو نمی تواند خالی باشد")
    @Size(max = 100, message = "نام آیتم منو نمی تواند از 100 کاراکتر بیشتر باشد")
    private String name;

    @NotNull(message = "قیمت نمی تواند خالی باشد")
    @Positive(message = "قیمت باید مثبت باشد")
    private BigDecimal price;

    private String imagePath;

    private String description;

    @NotNull(message = "دسته بندی منو نمی تواند خالی باشد")
    private Long categoryId;
}
