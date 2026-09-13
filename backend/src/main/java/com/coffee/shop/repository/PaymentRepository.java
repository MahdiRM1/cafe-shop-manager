package com.coffee.shop.repository;

import com.coffee.shop.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByOrderId(Long orderId);
    List<Payment> findByPurchaseId(Long purchaseId);
    List<Payment> findByShiftId(Long shiftId);
}
