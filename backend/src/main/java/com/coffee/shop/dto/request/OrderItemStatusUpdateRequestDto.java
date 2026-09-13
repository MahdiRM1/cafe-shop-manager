package com.coffee.shop.dto.request;

import com.coffee.shop.enums.ItemStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemStatusUpdateRequestDto {
    @NotNull(message = "وضعیت نمی‌تواند خالی باشد")
    private ItemStatus status;
}