package com.coffee.shop.controller;


import com.coffee.shop.dto.request.*;
import com.coffee.shop.dto.response.OrderItemResponseDto;
import com.coffee.shop.dto.response.OrderResponseDto;
import com.coffee.shop.dto.response.PaymentResponseDto;
import com.coffee.shop.entity.User;
import com.coffee.shop.enums.OrderStatus;
import com.coffee.shop.services.OrderServices;
import com.coffee.shop.services.PaymentServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderServices orderServices;
    private final PaymentServices paymentServices;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<List<OrderResponseDto>> getAll
            (@RequestParam(required = false)OrderStatus status, @RequestParam(required = false)Long tableId){
        if (status == null){
            if (tableId == null) return ResponseEntity.ok(orderServices.getAll());
            return ResponseEntity.ok(orderServices.getByTableId(tableId));
        }
        return ResponseEntity.ok(orderServices.getByStatus(status));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<OrderResponseDto> create
            (@AuthenticationPrincipal User user, @RequestBody @Valid OrderRequestDto dto) {
        return ResponseEntity.ok(orderServices.create(user.getId(), dto));
    }

    @GetMapping("/kitchen-queue")
    @PreAuthorize("hasAuthority('BARISTA')")
    public ResponseEntity<List<OrderResponseDto>> kitchenQueue() {
        return ResponseEntity.ok(orderServices.getByStatus(OrderStatus.CLOSED));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER', 'BARISTA')")
    public ResponseEntity<OrderResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(orderServices.getById(id));
    }

    @GetMapping("/{orderId}/items")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER', 'BARISTA')")
    public ResponseEntity<List<OrderItemResponseDto>> getOrderItems
            (@PathVariable Long orderId) {
        return ResponseEntity.ok(orderServices.getItems(orderId));
    }

    @PostMapping("/{orderId}/items")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER', 'BARISTA')")
    public ResponseEntity<OrderItemResponseDto> addItem
            (@PathVariable Long orderId, @RequestBody @Valid OrderItemRequestDto dto) {
        return ResponseEntity.ok(orderServices.addItem(orderId, dto));
    }

    @PatchMapping("/{orderId}/items/{itemId}")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER', 'BARISTA')")
    public ResponseEntity<OrderItemResponseDto> updateItem
            (@PathVariable Long itemId, @RequestBody @Valid OrderItemUpdateQuantityRequestDto dto) {
        return ResponseEntity.ok(orderServices.updateItemQuantity(itemId, dto));
    }

    @PatchMapping("/{orderId}/items/{itemId}/status")
    @PreAuthorize("hasAnyAuthority('BARISTA')")
    public ResponseEntity<OrderItemResponseDto> updateStatusItem
            (@PathVariable Long itemId, @RequestBody @Valid OrderItemStatusUpdateRequestDto dto) {
        return ResponseEntity.ok(orderServices.updateItemStatus(itemId, dto));
    }

    @DeleteMapping("/{orderId}/items/{itemId}")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER', 'BARISTA')")
    public ResponseEntity<String> removeItem
            (@PathVariable Long itemId) {
        return ResponseEntity.ok(orderServices.removeItem(itemId));
    }

    @PostMapping("/{orderId}/discount")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<OrderResponseDto> discount
            (@PathVariable Long orderId, @RequestBody @Valid OrderDiscountRequestDto dto) {
        return ResponseEntity.ok(orderServices.discount(orderId, dto));
    }

    @PostMapping("/{orderId}/checkout")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<OrderResponseDto> checkout
            (@PathVariable Long orderId) {
        return ResponseEntity.ok(orderServices.checkout(orderId));
    }

    @PatchMapping("/{orderId}/cancel")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<OrderResponseDto> cancel
            (@PathVariable Long orderId) {
        return ResponseEntity.ok(orderServices.cancel(orderId));
    }

    @PostMapping("/{orderId}/payment")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<PaymentResponseDto> createPayment
            (@AuthenticationPrincipal User user, @PathVariable Long orderId, @RequestBody @Valid PaymentRequestDto dto) {
        return ResponseEntity.ok(paymentServices.createForOrder(user.getId(), orderId, dto));
    }

}
