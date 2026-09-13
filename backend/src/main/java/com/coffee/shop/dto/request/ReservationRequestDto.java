package com.coffee.shop.dto.request;

import com.coffee.shop.enums.ReservationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRequestDto {

    @NotNull(message = "نام مشتری نمی‌تواند خالی باشد")
    @Size(max = 100, message = "نام مشتری نمی‌تواند از 100 کاراکتر بیشتر باشد")
    private String customerName;

    @NotNull(message = "شماره تلفن مشتری نمی‌تواند خالی باشد")
    @Size(max = 20, message = "شماره مشتری نمی‌تواند از 20 کاراکتر بیشتر باشد")
    private String customerPhone;

    @NotNull(message = "زمان رزرو نمی‌تواند خالی باشد")
    private LocalDateTime reservationTime;

    private String note;
}
