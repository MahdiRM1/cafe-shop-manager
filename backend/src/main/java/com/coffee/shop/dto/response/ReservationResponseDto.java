package com.coffee.shop.dto.response;


import com.coffee.shop.enums.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponseDto {
    private Long id;
    private Long tableId;
    private String tableNumber;
    private String customerName;
    private String customerPhone;
    private LocalDateTime reservationTime;
    private ReservationStatus status;
    private String note;
}
