package com.coffee.shop.dto.report;

import com.coffee.shop.dto.response.OrderResponseDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyReportDto {
    private Integer orderCount;
    private BigDecimal received;
    private List<OrderResponseDto> orders;
}
