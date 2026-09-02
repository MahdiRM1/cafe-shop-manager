package com.coffee.shop.services;

import com.coffee.shop.dto.request.PurchaseItemRequestDto;
import com.coffee.shop.dto.request.PurchaseItemUpdateQuantityRequestDto;
import com.coffee.shop.dto.request.PurchaseRequestDto;
import com.coffee.shop.dto.response.PurchaseItemResponseDto;
import com.coffee.shop.dto.response.PurchaseResponseDto;
import com.coffee.shop.entity.*;
import com.coffee.shop.enums.OrderStatus;
import com.coffee.shop.exception.BusinessRuleException;
import com.coffee.shop.exception.ErrorCode;
import com.coffee.shop.exception.ResourceNotFoundException;
import com.coffee.shop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseServices {

    private final PurchaseRepository purchaseRepository;
    private final PurchaseItemRepository purchaseItemRepository;
    private final UserRepository userRepository;
    private final RawMaterialRepository materialRepository;
    private final PaymentRepository paymentRepository;
    private final InventoryServices inventoryServices;

    public PurchaseResponseDto create(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND));

        Purchase purchase = new Purchase();
        purchase.setUser(user);

        Purchase saved = purchaseRepository.save(purchase);
        return toResponseDto(saved);
    }

    public PurchaseResponseDto getById(Long id){
        Purchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.PURCHASE_NOT_FOUND));
        return toResponseDto(purchase);
    }

    public List<PurchaseResponseDto> getAll(){
        return purchaseRepository.findAll().stream()
                .map(this::toResponseDto).toList();
    }

    public List<PurchaseResponseDto> getAll(OrderStatus status){
        return purchaseRepository.findByStatus(status).stream()
                .map(this::toResponseDto).toList();
    }

    @Transactional
    public PurchaseResponseDto checkout(Long purchaseId) {
        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.PURCHASE_NOT_FOUND));

        if (purchase.getStatus() != OrderStatus.OPEN)
            throw new BusinessRuleException(ErrorCode.PURCHASE_NOT_OPEN);

        BigDecimal totalPaid = paymentRepository.findByPurchaseId(purchaseId)
                .stream().map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (purchase.getAmount().compareTo(totalPaid) > 0)
            throw new BusinessRuleException(ErrorCode.PAYMENT_INCOMPLETE);

        purchaseItemRepository.findByPurchaseId(purchaseId)
                .forEach(item -> inventoryServices.restock(item.getMaterial().getId(), item.getQuantity()));

        purchase.setStatus(OrderStatus.CLOSED);
        purchase.setClosedAt(LocalDateTime.now());
        purchaseRepository.save(purchase);

        return toResponseDto(purchase);
    }

    @Transactional
    public PurchaseResponseDto cancel(Long purchaseId) {
        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.PURCHASE_NOT_FOUND));

        if (purchase.getStatus() != OrderStatus.OPEN)
            throw new BusinessRuleException(ErrorCode.PURCHASE_NOT_OPEN);

        purchase.setStatus(OrderStatus.CANCELED);
        purchase.setClosedAt(LocalDateTime.now());

        Purchase saved = purchaseRepository.save(purchase);
        return toResponseDto(saved);
    }

    public PurchaseItemResponseDto getItemById(Long purchaseId, Long itemId){
        PurchaseItem item = purchaseItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.PURCHASE_ITEM_NOT_FOUND));
        if (!item.getPurchase().getId().equals(purchaseId))
            throw new ResourceNotFoundException(ErrorCode.PURCHASE_ITEM_NOT_FOUND);
        return itemToResponseDto(item);
    }

    public List<PurchaseItemResponseDto> getItems(Long purchaseId) {
        return purchaseItemRepository.findByPurchaseId(purchaseId).stream()
                .map(this::itemToResponseDto).toList();
    }

    @Transactional
    public PurchaseItemResponseDto addItem(Long purchaseId, PurchaseItemRequestDto dto) {
        Purchase purchase = purchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.PURCHASE_NOT_FOUND));
        if (purchase.getStatus() != OrderStatus.OPEN)
            throw new BusinessRuleException(ErrorCode.PURCHASE_NOT_OPEN);
        RawMaterial material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RAW_MATERIAL_NOT_FOUND));

        PurchaseItem purchaseItem = new PurchaseItem();
        purchaseItem.setPurchase(purchase);
        purchaseItem.setMaterial(material);
        purchaseItem.setQuantity(dto.getQuantity());
        purchaseItem.setUnitPrice(dto.getUnitPrice());
        purchaseItem.setNote(dto.getNote());

        BigDecimal price = purchaseItem.getUnitPrice().multiply(purchaseItem.getQuantity());
        purchase.setAmount(purchase.getAmount().add(price));
        PurchaseItem saved = purchaseItemRepository.save(purchaseItem);
        purchaseRepository.save(purchase);
        return itemToResponseDto(saved);
    }

    public PurchaseItemResponseDto updateItemQuantity(Long itemId, PurchaseItemUpdateQuantityRequestDto dto) {
        PurchaseItem purchaseItem = purchaseItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.PURCHASE_ITEM_NOT_FOUND));
        Purchase purchase = purchaseRepository.findById(purchaseItem.getPurchase().getId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.PURCHASE_NOT_FOUND));
        if (purchase.getStatus() != OrderStatus.OPEN)
            throw new BusinessRuleException(ErrorCode.ORDER_NOT_OPEN);

        purchaseItem.setQuantity(dto.getQuantity());

        PurchaseItem saved = purchaseItemRepository.save(purchaseItem);
        return itemToResponseDto(saved);
    }

    @Transactional
    public String removeItem(Long itemId) {
        PurchaseItem purchaseItem = purchaseItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.PURCHASE_ITEM_NOT_FOUND));
        Purchase purchase = purchaseRepository.findById(purchaseItem.getPurchase().getId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.PURCHASE_NOT_FOUND));
        if (purchase.getStatus() != OrderStatus.OPEN)
            throw new BusinessRuleException(ErrorCode.PURCHASE_NOT_OPEN);

        BigDecimal price = purchaseItem.getUnitPrice().multiply(purchaseItem.getQuantity());
        BigDecimal amount = purchase.getAmount().subtract(price);
        if (amount.compareTo(BigDecimal.ZERO) < 0)
            throw new BusinessRuleException(ErrorCode.AMOUNT_LT_ZERO);

        purchase.setAmount(amount);
        purchaseRepository.save(purchase);
        purchaseItemRepository.deleteById(itemId);
        return "purchase item deleting successfully";
    }

    private PurchaseResponseDto toResponseDto(Purchase purchase){
        return new PurchaseResponseDto(
                purchase.getId(),
                purchase.getUser().getId(),
                purchase.getUser().getFullName(),
                purchase.getStatus(),
                purchase.getAmount(),
                purchase.getCreatedAt(),
                purchase.getClosedAt()
        );
    }

    private PurchaseItemResponseDto itemToResponseDto(PurchaseItem purchaseItem){
        return new PurchaseItemResponseDto(
                purchaseItem.getId(),
                purchaseItem.getPurchase().getId(),
                purchaseItem.getMaterial().getId(),
                purchaseItem.getMaterial().getName(),
                purchaseItem.getQuantity(),
                purchaseItem.getUnitPrice(),
                purchaseItem.getNote()
        );
    }

}
