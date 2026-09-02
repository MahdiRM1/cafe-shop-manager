package com.coffee.shop.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeRangeSalesResponseDto {
    private Integer totalOrderCount;
    private List<Long> orders;
    private BigDecimal saleAmount;
}
