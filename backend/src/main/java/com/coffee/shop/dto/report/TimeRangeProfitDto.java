package com.coffee.shop.dto.report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeRangeProfitDto {
    private Integer totalOrderCount;
    private List<Integer> orderCountByDay;
    private List<BigDecimal> orderPriceByDay;
    private BigDecimal saleAmount;
    private BigDecimal purchaseAmount;
    private BigDecimal profitAmount;
}
