package com.coffee.shop.dto.response;

import com.coffee.shop.enums.ShiftStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShiftResponseDto {
    private Long id;
    private Long userId;
    private String userFullName;
    private BigDecimal openingCash;
    private BigDecimal closingCash;
    private BigDecimal expectedCash;
    private LocalDateTime openedAt;
    private LocalDateTime closedAt;
    private ShiftStatus status;
}
