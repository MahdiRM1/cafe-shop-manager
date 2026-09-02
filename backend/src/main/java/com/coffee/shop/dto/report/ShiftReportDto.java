package com.coffee.shop.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShiftReportDto {
    private Long userId;
    private String userFullName;
    private BigDecimal openingCash;
    private BigDecimal cashSales;
    private BigDecimal cardSales;
    private BigDecimal closingCash;
    private BigDecimal discrepancy;
    private LocalDateTime openedAt;
    private LocalDateTime closedAt;
}
