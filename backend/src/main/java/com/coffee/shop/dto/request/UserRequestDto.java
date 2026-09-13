package com.coffee.shop.dto.request;

import com.coffee.shop.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDto {

    @NotBlank(message = "نام کامل یوزر نمی‌تواند خالی باشد")
    @Size(max = 100, message = "نام کامل یوزر نمیتواند از 100 کاراکتر بیشتر باشد")
    private String fullName;

    @NotBlank(message = "رمز عبور نمی‌تواند خالی باشد")
    @Size(min = 6, message = "رمز عبور باید حداقل ۶ کاراکتر باشد")
    private String password;

    @NotBlank(message = "یوزرنیم نمی‌تواند خالی باشد")
    @Size(max = 50, message = "یوزرنیم نمیتواند از 100 کاراکتر بیشتر باشد")
    private String username;

    @NotNull(message = "وظیفه نمی‌تواند خالی باشد")
    private UserRole role;
}
