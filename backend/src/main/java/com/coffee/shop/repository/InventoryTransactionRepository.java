package com.coffee.shop.repository;

import com.coffee.shop.entity.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {
    List<InventoryTransaction> findByRawMaterialId(Long rawMaterialId);
    List<InventoryTransaction> findByRelatedOrderId(Long orderId);
}
