package com.coffee.shop.controller;


import com.coffee.shop.dto.request.*;
import com.coffee.shop.dto.response.PurchaseItemResponseDto;
import com.coffee.shop.dto.response.PurchaseResponseDto;
import com.coffee.shop.dto.response.PaymentResponseDto;
import com.coffee.shop.entity.User;
import com.coffee.shop.enums.OrderStatus;
import com.coffee.shop.services.PurchaseServices;
import com.coffee.shop.services.PaymentServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseServices purchaseServices;
    private final PaymentServices paymentServices;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<List<PurchaseResponseDto>> getAll
            (@PathVariable(required = false) OrderStatus status){
        if (status == null) return ResponseEntity.ok(purchaseServices.getAll());
        return ResponseEntity.ok(purchaseServices.getAll(status));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<PurchaseResponseDto> create
            (@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(purchaseServices.create(user.getId()));
    }

    @GetMapping("/{purchaseId}/items")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER', 'BARISTA')")
    public ResponseEntity<List<PurchaseItemResponseDto>> addItem
            (@PathVariable Long purchaseId) {
        return ResponseEntity.ok(purchaseServices.getItems(purchaseId));
    }

    @PostMapping("/{purchaseId}/items")
    public ResponseEntity<PurchaseItemResponseDto> addItem
            (@PathVariable Long purchaseId, @RequestBody @Valid PurchaseItemRequestDto dto) {
        return ResponseEntity.ok(purchaseServices.addItem(purchaseId, dto));
    }

    @PatchMapping("/{purchaseId}/items/{itemId}")
    public ResponseEntity<PurchaseItemResponseDto> updateItem
            (@PathVariable Long itemId, @RequestBody @Valid PurchaseItemUpdateQuantityRequestDto dto) {
        return ResponseEntity.ok(purchaseServices.updateItemQuantity(itemId, dto));
    }

    @DeleteMapping("/{purchaseId}/items/{itemId}")
    public ResponseEntity<String> removeItem
            (@PathVariable Long itemId) {
        return ResponseEntity.ok(purchaseServices.removeItem(itemId));
    }

    @PostMapping("/{purchaseId}/checkout")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<PurchaseResponseDto> checkout
            (@PathVariable Long purchaseId) {
        return ResponseEntity.ok(purchaseServices.checkout(purchaseId));
    }

    @PatchMapping("/{purchaseId}/cancel")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<PurchaseResponseDto> cancel
            (@PathVariable Long purchaseId) {
        return ResponseEntity.ok(purchaseServices.cancel(purchaseId));
    }

    @PostMapping("/{purchaseId}/payment")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<PaymentResponseDto> createPayment
            (@AuthenticationPrincipal User user, @PathVariable Long purchaseId, @RequestBody @Valid PaymentRequestDto dto) {
        return ResponseEntity.ok(paymentServices.createForPurchase(user.getId(), purchaseId, dto));
    }

}
