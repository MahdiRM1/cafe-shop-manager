package com.coffee.shop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdatePasswordRequestDto {

    @NotBlank(message = "رمز عبور فعلی نمی‌تواند خالی باشد")
    private String currentPassword;

    @NotBlank(message = "رمز عبور جدید نمی‌تواند خالی باشد")
    @Size(min = 6, message = "رمز عبور جدید باید حداقل ۶ کاراکتر باشد")
    private String newPassword;
}