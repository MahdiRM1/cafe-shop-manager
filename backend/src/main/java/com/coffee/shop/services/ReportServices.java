package com.coffee.shop.services;

import com.coffee.shop.dto.report.*;
import com.coffee.shop.dto.response.OrderResponseDto;
import com.coffee.shop.entity.Order;
import com.coffee.shop.entity.Payment;
import com.coffee.shop.entity.Purchase;
import com.coffee.shop.entity.Shift;
import com.coffee.shop.enums.OrderStatus;
import com.coffee.shop.enums.PaymentMethod;
import com.coffee.shop.exception.ErrorCode;
import com.coffee.shop.exception.ResourceNotFoundException;
import com.coffee.shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServices {

    private final OrderRepository orderRepository;
    private final PurchaseRepository purchaseRepository;
    private final OrderItemRepository orderItemRepository;
    private final ShiftRepository shiftRepository;
    private final PaymentRepository paymentRepository;

    public DailyReportDto daily(LocalDate date){
        LocalDateTime from = date.atStartOfDay();
        LocalDateTime to = date.plusDays(1).atStartOfDay();
        List<Order> orders = orderRepository.findByStatusAndClosedAtBetween(OrderStatus.CLOSED, from, to);
        BigDecimal prices = orders.stream().map(Order::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal discounts = orders.stream().map(Order::getDiscount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal received = prices.subtract(discounts);

        List<OrderResponseDto> ordersDto = orders.stream().map(order ->
                new OrderResponseDto(
                        order.getId(),
                        order.getTable() != null ? order.getTable().getId() : null,
                        order.getTable() != null ? order.getTable().getTableNumber() : null,
                        order.getUser().getId(),
                        order.getUser().getFullName(),
                        order.getType(),
                        order.getStatus(),
                        order.getAmount(),
                        order.getDiscount(),
                        order.getCreatedAt(),
                        order.getClosedAt())
        ).toList();
        return new DailyReportDto(orders.size(), received, ordersDto);
    }

    public TimeRangeSalesResponseDto rangeSalesReport(LocalDateTime from, LocalDateTime to){
        List<Order> orders = orderRepository.findByStatusAndClosedAtBetween(OrderStatus.CLOSED, from, to);

        // قبلاً فقط شناسه‌ی سفارش‌ها برگردانده می‌شد؛ حالا مثل daily() یک خلاصه‌ی
        // کامل (مبلغ، وضعیت، نوع سفارش، میز و ...) برای هر سفارش ساخته می‌شود
        // تا فرانت بتواند به‌جای نمایش صرف id، کارت خلاصه نمایش دهد.
        List<OrderResponseDto> ordersDto = orders.stream().map(order ->
                new OrderResponseDto(
                        order.getId(),
                        order.getTable() != null ? order.getTable().getId() : null,
                        order.getTable() != null ? order.getTable().getTableNumber() : null,
                        order.getUser().getId(),
                        order.getUser().getFullName(),
                        order.getType(),
                        order.getStatus(),
                        order.getAmount(),
                        order.getDiscount(),
                        order.getCreatedAt(),
                        order.getClosedAt())
        ).toList();

        BigDecimal totalAmount = orders.stream().map(Order::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new TimeRangeSalesResponseDto(orders.size(), ordersDto, totalAmount);
    }

    public TimeRangeProfitDto rangeProfit(LocalDate from, LocalDate to){
        List<DailyReportDto> orders = new ArrayList<>();
        List<List<Purchase>> purchases = new ArrayList<>();

        for (LocalDate date = from; date.isBefore(to); date = date.plusDays(1)) {
            orders.add(daily(date));
            LocalDateTime forFrom = date.atStartOfDay();
            LocalDateTime forTo = date.plusDays(1).atStartOfDay();
            purchases.add(purchaseRepository.findByClosedAtBetween(forFrom, forTo));
        }

        List<Integer> orderCountByDay = orders.stream().map(DailyReportDto::getOrderCount).toList();
        List<BigDecimal> orderPricesByDay = orders.stream().map(DailyReportDto::getReceived).toList();
        BigDecimal saleAmount = orders.stream().map(DailyReportDto::getReceived).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal purchaseAmount = purchases.stream().map(purchasesByDay ->
                purchasesByDay.stream().map(Purchase::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add)
        ).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal profit = saleAmount.subtract(purchaseAmount);
        Integer totalOrderCount = 0;
        for (Integer day : orderCountByDay) totalOrderCount += day;

        return new TimeRangeProfitDto(totalOrderCount, orderCountByDay, orderPricesByDay, saleAmount, purchaseAmount, profit);
    }

    public List<TopSellingItemDto> topSelling (LocalDateTime from, LocalDateTime to) {
        List<Object[]> rows = orderItemRepository.findTopSellingItems(from, to);

        return rows.stream().map(row ->
                new TopSellingItemDto((Long) row[0], (String) row[1], (BigDecimal) row[2], (BigDecimal) row[3])
        ).toList();
    }

    public ShiftReportDto shiftReport(Long shiftId) {
        Shift shift = shiftRepository.findById(shiftId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.SHIFT_NOT_FOUND));

        List<Payment> payments = paymentRepository.findByShiftId(shiftId);

        BigDecimal cashSales = payments.stream()
                .filter(p -> p.getMethod() != PaymentMethod.CARD)
                .filter(p -> p.getOrder() != null)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal cardSales = payments.stream()
                .filter(p -> p.getMethod() == PaymentMethod.CARD)
                .filter(p -> p.getOrder() != null)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discrepancy = shift.getClosingCash() != null && shift.getExpectedCash() != null
                ? shift.getClosingCash().subtract(shift.getExpectedCash())
                : null;

        return new ShiftReportDto(
                shift.getUser().getId(),
                shift.getUser().getFullName(),
                shift.getOpeningCash(),
                cashSales,
                cardSales,
                shift.getClosingCash(),
                discrepancy,
                shift.getOpenedAt(),
                shift.getClosedAt()
        );
    }
}