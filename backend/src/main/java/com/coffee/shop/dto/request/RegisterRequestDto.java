package com.coffee.shop.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDto {

    @NotBlank(message = "نام کاربری نمی تواند خالی باشد")
    @Size(min = 4, max = 50, message = "نام کاربری باید بین 4 تا 50 کاراکتر باشد")
    private String username;

    @NotBlank(message = "رمزعبور نمی تواند خالی باشد")
    @Size(min = 6, max = 50, message = "رمزعبور باید بین 6 تا 50 کاراکتر باشد")
    private String password;

    @NotBlank(message = "نام نمی تواند خالی باشد")
    @Size(min = 4, max = 50, message = "نام باید بین 4 تا 50 کاراکتر باشد")
    private String fullName;

    private String email;
    private String phone;

}
