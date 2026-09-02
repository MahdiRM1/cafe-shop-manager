package com.coffee.shop.dto.request;

import com.coffee.shop.enums.TableStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantTableStatusUpdateRequestDto {

    @NotNull(message = "وضعیت میز نمی‌تواند خالی باشد")
    private TableStatus status;
}