package com.coffee.shop.services;

import com.coffee.shop.dto.request.PaymentRequestDto;
import com.coffee.shop.dto.response.PaymentResponseDto;
import com.coffee.shop.entity.Order;
import com.coffee.shop.entity.Payment;
import com.coffee.shop.entity.Purchase;
import com.coffee.shop.entity.Shift;
import com.coffee.shop.enums.OrderStatus;
import com.coffee.shop.enums.ShiftStatus;
import com.coffee.shop.exception.BusinessRuleException;
import com.coffee.shop.exception.ErrorCode;
import com.coffee.shop.exception.ResourceNotFoundException;
import com.coffee.shop.repository.OrderRepository;
import com.coffee.shop.repository.PaymentRepository;
import com.coffee.shop.repository.PurchaseRepository;
import com.coffee.shop.repository.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PaymentServices {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final PurchaseRepository purchaseRepository;
    private final ShiftRepository shiftRepository;


    public PaymentResponseDto createForOrder(Long userId, Long orderId, PaymentRequestDto dto) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() != OrderStatus.OPEN)
            throw new BusinessRuleException(ErrorCode.ORDER_NOT_OPEN);

        Shift shift = shiftRepository.findByUserIdAndStatus(userId, ShiftStatus.OPEN)
                .orElseThrow(() -> new BusinessRuleException(ErrorCode.NO_OPEN_SHIFT));

        BigDecimal alreadyPaid = paymentRepository.findByOrderId(orderId)
                .stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal payable = order.getAmount().subtract(order.getDiscount());

        BigDecimal remain = payable.subtract(alreadyPaid);
        if (remain.subtract(dto.getAmount()).compareTo(BigDecimal.ZERO) < 0)
            throw new BusinessRuleException(ErrorCode.PAYMENT_EXCEEDS_REMAINING);

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPurchase(null);
        payment.setAmount(dto.getAmount() != null ? dto.getAmount() : order.getAmount());
        payment.setMethod(dto.getMethod());
        payment.setShift(shift);

        Payment saved = paymentRepository.save(payment);
        return toResponseDto(saved);
    }
    public PaymentResponseDto createForPurchase(Long userId, Long purchaseId, PaymentRequestDto dto) {
        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.PURCHASE_NOT_FOUND));
        System.out.println(1);

        if (purchase.getStatus() != OrderStatus.OPEN)
            throw new BusinessRuleException(ErrorCode.PURCHASE_NOT_OPEN);

        Shift shift = shiftRepository.findByUserIdAndStatus(userId, ShiftStatus.OPEN)
                .orElseThrow(() -> new BusinessRuleException(ErrorCode.NO_OPEN_SHIFT));
        System.out.println(2);

        BigDecimal alreadyPaid = paymentRepository.findByPurchaseId(purchaseId)
                .stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal payable =  purchase.getAmount();
        BigDecimal remain = payable.subtract(alreadyPaid);
        if (remain.subtract(dto.getAmount()).compareTo(BigDecimal.ZERO) < 0)
            throw new BusinessRuleException(ErrorCode.PAYMENT_EXCEEDS_REMAINING);
        System.out.println(3);

        Payment payment = new Payment();
        payment.setOrder(null);
        payment.setPurchase(purchase);
        payment.setAmount(dto.getAmount());
        payment.setMethod(dto.getMethod());
        payment.setShift(shift);
        System.out.println(4);

        Payment saved = paymentRepository.save(payment);
        return toResponseDto(saved);
    }

    public PaymentResponseDto getById(Long id){
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.PAYMENT_NOT_FOUND));
        return toResponseDto(payment);
    }

    private PaymentResponseDto toResponseDto(Payment payment){
        return new PaymentResponseDto(
                payment.getId(),
                payment.getOrder() != null ? payment.getOrder().getId() : null,
                payment.getPurchase() != null ? payment.getPurchase().getId() : null,
                payment.getAmount(),
                payment.getMethod(),
                payment.getPaidAt(),
                payment.getShift().getId()
        );
    }
    
}
