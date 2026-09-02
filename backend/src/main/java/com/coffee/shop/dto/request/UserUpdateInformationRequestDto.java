package com.coffee.shop.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateInformationRequestDto {

//    @NotBlank(message = "نام کامل یوزر نمی‌تواند خالی باشد")
    @Size(max = 100, message = "نام کامل یوزر نمی‌تواند از ۱۰۰ کاراکتر بیشتر باشد")
    private String fullName;

//    @NotBlank(message = "یوزرنیم نمی‌تواند خالی باشد")
    @Size(max = 50, message = "یوزرنیم نمی‌تواند از ۵۰ کاراکتر بیشتر باشد")
    private String username;
}