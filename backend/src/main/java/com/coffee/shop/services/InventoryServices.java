package com.coffee.shop.services;

import com.coffee.shop.dto.request.RestockRequestDto;
import com.coffee.shop.dto.response.InventoryTransactionResponseDto;
import com.coffee.shop.entity.*;
import com.coffee.shop.enums.InventoryTransactionType;
import com.coffee.shop.exception.ErrorCode;
import com.coffee.shop.exception.InsufficientStockException;
import com.coffee.shop.exception.ResourceNotFoundException;
import com.coffee.shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryServices {

    private final InventoryTransactionRepository itRepository;
    private final RawMaterialRepository materialRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final RecipeItemRepository recipeItemRepository;

    public List<InventoryTransactionResponseDto> getAll(){
        return itRepository.findAll().stream().map(this::toResponseDto).toList();
    }

    public InventoryTransactionResponseDto getById(Long id) {
        InventoryTransaction it = itRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.INVENTORY_TRANSACTION_NOT_FOUND));
        return toResponseDto(it);
    }

    public List<InventoryTransactionResponseDto> getByMaterialId(Long materialId){
        return itRepository.findByRawMaterialId(materialId).stream().map(this::toResponseDto).toList();
    }

    public List<InventoryTransactionResponseDto> getByRelatedOrderId(Long orderId){
        return itRepository.findByRelatedOrderId(orderId).stream().map(this::toResponseDto).toList();
    }

    @Transactional
    public void deductForOrder(Long orderId){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.ORDER_NOT_FOUND));
        List<OrderItem> items = orderItemRepository.findByOrderId(orderId);


        for (OrderItem orderItem : items) {
            List<RecipeItem> recipeItems = recipeItemRepository.findByMenuItemId(orderItem.getMenuItem().getId());
            recipeItems.forEach(recipeItem ->{
                RawMaterial material = materialRepository.findByIdForUpdate(recipeItem.getRawMaterial().getId())
                        .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RAW_MATERIAL_NOT_FOUND));
                BigDecimal quantity = recipeItem.getQuantityNeeded().multiply(orderItem.getQuantity());
                if (quantity.compareTo(material.getCurrentStock()) > 0)
                    throw new InsufficientStockException(ErrorCode.INSUFFICIENT_STOCK);
                });
        }

        items.forEach(item -> {
            List<RecipeItem> recipeItems = recipeItemRepository.findByMenuItemId(item.getMenuItem().getId());
            recipeItems.forEach(recipeItem -> createTransaction(order, item.getQuantity(), recipeItem));
        });
    }

    @Transactional
    public InventoryTransactionResponseDto restock(Long materialId, BigDecimal amount) {
        RawMaterial material = materialRepository.findById(materialId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RAW_MATERIAL_NOT_FOUND));
        material.setCurrentStock(material.getCurrentStock().add(amount));

        RawMaterial updatedMaterial = materialRepository.save(material);

        InventoryTransaction transaction = new InventoryTransaction();
        transaction.setRawMaterial(updatedMaterial);
        transaction.setChangeAmount(amount);
        transaction.setType(InventoryTransactionType.RESTOCK);
        transaction.setReason("افزودن محصول " + material.getName() +
                              " به مقدار " + amount + material.getUnit());
        InventoryTransaction updated = itRepository.save(transaction);

        return toResponseDto(updated);
    }

    @Transactional
    public InventoryTransactionResponseDto waste(Long id, RestockRequestDto dto) {
        RawMaterial material = materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RAW_MATERIAL_NOT_FOUND));
        material.setCurrentStock(material.getCurrentStock().add(dto.getAmount().negate()));

        RawMaterial updatedMaterial = materialRepository.save(material);

        InventoryTransaction transaction = new InventoryTransaction();
        transaction.setRawMaterial(updatedMaterial);
        transaction.setChangeAmount(dto.getAmount());
        transaction.setType(InventoryTransactionType.WASTE);
        transaction.setReason(dto.getReason());
        InventoryTransaction updated = itRepository.save(transaction);

        return toResponseDto(updated);
    }

    @Transactional
    protected void createTransaction(Order order, BigDecimal orderItemQuantity, RecipeItem recipeItem){
        RawMaterial rawMaterial = recipeItem.getRawMaterial();
        BigDecimal quantity = recipeItem.getQuantityNeeded()
                .multiply(orderItemQuantity);
        BigDecimal newStock = rawMaterial.getCurrentStock().subtract(quantity);
        rawMaterial.setCurrentStock(newStock);
        materialRepository.save(rawMaterial);

        BigDecimal totalCost = rawMaterial.getUnitCost().multiply(quantity);

        InventoryTransaction transaction = new InventoryTransaction();
        transaction.setRawMaterial(recipeItem.getRawMaterial());
        transaction.setChangeAmount(quantity.negate());
        transaction.setType(InventoryTransactionType.SALE_DEDUCTION);
        transaction.setReason("برای سفارش محصول " + recipeItem.getRawMaterial().getName() +
                "به تعداد " + quantity +
                "با قیمت هر واحد " + rawMaterial.getUnitCost() +
                "\n مجموع قیمت: " + totalCost);
        transaction.setRelatedOrder(order);
        itRepository.save(transaction);
    }

    public void delete(Long id) {
        if (!itRepository.existsById(id)) throw new ResourceNotFoundException(ErrorCode.INVENTORY_TRANSACTION_NOT_FOUND);
        itRepository.deleteById(id);
    }

    public InventoryTransactionResponseDto toResponseDto(InventoryTransaction it) {
        return new InventoryTransactionResponseDto(
                it.getId(),
                it.getRawMaterial().getId(),
                it.getRawMaterial().getName(),
                it.getChangeAmount(),
                it.getType(),
                it.getReason(),
                it.getRelatedOrder() != null ? it.getRelatedOrder().getId() : null,
                it.getCreatedAt()
        );
    }
}
