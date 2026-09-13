package com.coffee.shop.controller;

import com.coffee.shop.dto.report.DailyReportDto;
import com.coffee.shop.dto.report.TimeRangeProfitDto;
import com.coffee.shop.dto.report.TimeRangeSalesResponseDto;
import com.coffee.shop.dto.report.TopSellingItemDto;
import com.coffee.shop.services.ReportServices;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportServices reportServices;

    @GetMapping("/sales/daily")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<DailyReportDto> dailyReport
            (@RequestParam(required = false)LocalDate date){
        if (date == null)
            ResponseEntity.ok(reportServices.daily(LocalDate.now()));

        return ResponseEntity.ok(reportServices.daily(date));
    }

    @GetMapping("/sales/range")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<TimeRangeSalesResponseDto> rangeSales
            (@RequestParam LocalDateTime from, @RequestParam LocalDateTime to){
        return ResponseEntity.ok(reportServices.rangeSalesReport(from, to));
    }

    @GetMapping("/top-items")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<List<TopSellingItemDto>> topItems
            (@RequestParam LocalDateTime from, @RequestParam LocalDateTime to){
        return ResponseEntity.ok(reportServices.topSelling(from, to));
    }

    @GetMapping("/profit")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<TimeRangeProfitDto> topItems
            (@RequestParam LocalDate from, @RequestParam LocalDate to){
        return ResponseEntity.ok(reportServices.rangeProfit(from, to));
    }

}
