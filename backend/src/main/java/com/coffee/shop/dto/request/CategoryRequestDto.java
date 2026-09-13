package com.coffee.shop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequestDto {

    @NotBlank(message = "نام دسته بندی نمی تواند خالی باشد")
    @Size(max = 60, message = "طول نام نمیتواند از 60 کاراکتر بیشتر شود")
    private String name;

    private Integer displayOrder;
}
