package com.coffee.shop.services;

import com.coffee.shop.dto.request.*;
import com.coffee.shop.dto.response.OrderItemResponseDto;
import com.coffee.shop.dto.response.OrderResponseDto;
import com.coffee.shop.entity.*;
import com.coffee.shop.enums.OrderStatus;
import com.coffee.shop.enums.OrderType;
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
public class OrderServices {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final RestaurantTableRepository tableRepository;
    private final MenuItemRepository menuItemRepository;
    private final PaymentRepository paymentRepository;
    private final InventoryServices inventoryServices;

    public List<OrderResponseDto> getAll(){
        return orderRepository.findAll().stream()
                .map(this::toResponseDto).toList();
    }

    public OrderResponseDto create(Long userId, OrderRequestDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND));
        if (dto.getType() == OrderType.DINE_IN && dto.getTableId() == null) {
            throw new BusinessRuleException(ErrorCode.TABLE_REQUIRED_FOR_DINE_IN);
        }
        if (dto.getType() == OrderType.TAKEAWAY && dto.getTableId() != null) {
            throw new BusinessRuleException(ErrorCode.TABLE_NOT_ALLOWED_FOR_TAKEAWAY);
        }

        RestaurantTable table = null;
        if (dto.getTableId() != null)
            table = tableRepository.findById(dto.getTableId())
                    .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.TABLE_NOT_FOUND));


        Order order = new Order();
        order.setUser(user);
        order.setType(dto.getType());
        order.setTable(table);

        Order saved = orderRepository.save(order);
        return toResponseDto(saved);
    }

    public OrderResponseDto discount(Long orderId, OrderDiscountRequestDto dto){
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.ORDER_NOT_FOUND));
        if (dto.getDiscountPercent() >= 100)
            throw new BusinessRuleException(ErrorCode.DISCOUNT_PERCENT_OVER_100);

        BigDecimal discountAmount = order.getAmount()
                .multiply(BigDecimal.valueOf(dto.getDiscountPercent()))
                .divide(BigDecimal.valueOf(100));
        order.setDiscount(discountAmount);
        Order saved = orderRepository.save(order);
        return toResponseDto(saved);
    }

    public OrderResponseDto getById(Long id){
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.ORDER_NOT_FOUND));
        return toResponseDto(order);
    }

    public List<OrderResponseDto> getByStatus(OrderStatus status){
        return orderRepository.findByStatus(status).stream()
                .map(this::toResponseDto).toList();
    }

    public List<OrderResponseDto> getByTableId(Long tableId){
        return orderRepository.findByTableId(tableId).stream()
                .map(this::toResponseDto).toList();
    }

    @Transactional
    public OrderResponseDto checkout(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() != OrderStatus.OPEN)
            throw new BusinessRuleException(ErrorCode.ORDER_NOT_OPEN);

        BigDecimal totalPaid = paymentRepository.findByOrderId(orderId)
                .stream().map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal discount = order.getDiscount() != null ? order.getDiscount() : BigDecimal.ZERO;
        BigDecimal payable = order.getAmount().subtract(discount);

        if (payable.compareTo(totalPaid) > 0)
            throw new BusinessRuleException(ErrorCode.PAYMENT_INCOMPLETE);

        inventoryServices.deductForOrder(orderId);

        order.setStatus(OrderStatus.CLOSED);
        order.setClosedAt(LocalDateTime.now());
        Order saved = orderRepository.save(order);

        return toResponseDto(saved);
    }

    @Transactional
    public OrderResponseDto cancel(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() != OrderStatus.OPEN)
            throw new BusinessRuleException(ErrorCode.ORDER_NOT_OPEN);

        order.setStatus(OrderStatus.CANCELED);
        order.setClosedAt(LocalDateTime.now());

        Order saved = orderRepository.save(order);
        return toResponseDto(saved);
    }
    public List<OrderItemResponseDto> getItems(Long orderId) {
        return orderItemRepository.findByOrderId(orderId).stream()
                .map(this::itemToResponseDto).toList();
    }

    @Transactional
    public OrderItemResponseDto addItem(Long orderId, OrderItemRequestDto dto) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.ORDER_NOT_FOUND));
        if (order.getStatus() != OrderStatus.OPEN)
            throw new BusinessRuleException(ErrorCode.ORDER_NOT_OPEN);
        MenuItem menuItem = menuItemRepository.findById(dto.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.MENU_ITEM_NOT_FOUND));

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setMenuItem(menuItem);
        orderItem.setQuantity(dto.getQuantity());
        orderItem.setUnitPrice(menuItem.getPrice());
        orderItem.setNote(dto.getNote());

        BigDecimal price = orderItem.getUnitPrice().multiply(orderItem.getQuantity());
        order.setAmount(order.getAmount().add(price));
        OrderItem saved = orderItemRepository.save(orderItem);
        orderRepository.save(order);
        return itemToResponseDto(saved);
    }

    public OrderItemResponseDto updateItemQuantity(Long itemId, OrderItemUpdateQuantityRequestDto dto) {
        OrderItem orderItem = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.ORDER_ITEM_NOT_FOUND));
        Order order = orderRepository.findById(orderItem.getOrder().getId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.ORDER_NOT_FOUND));
        if (order.getStatus() != OrderStatus.OPEN)
            throw new BusinessRuleException(ErrorCode.ORDER_NOT_OPEN);

        orderItem.setQuantity(dto.getQuantity());

        OrderItem saved = orderItemRepository.save(orderItem);
        return itemToResponseDto(saved);
    }

    @Transactional
    public OrderItemResponseDto updateItemStatus(Long itemId, OrderItemStatusUpdateRequestDto dto) {
        OrderItem orderItem = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.ORDER_ITEM_NOT_FOUND));
        Order order = orderRepository.findById(orderItem.getOrder().getId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.ORDER_NOT_FOUND));
        if (order.getStatus() != OrderStatus.OPEN)
            throw new BusinessRuleException(ErrorCode.ORDER_NOT_OPEN);

        orderItem.setStatus(dto.getStatus());

        OrderItem saved = orderItemRepository.save(orderItem);
        return itemToResponseDto(saved);
    }

    @Transactional
    public String removeItem(Long itemId) {
        OrderItem orderItem = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.ORDER_ITEM_NOT_FOUND));
        Order order = orderRepository.findById(orderItem.getOrder().getId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.ORDER_NOT_FOUND));
        if (order.getStatus() != OrderStatus.OPEN)
            throw new BusinessRuleException(ErrorCode.ORDER_NOT_OPEN);

        BigDecimal price = orderItem.getUnitPrice().multiply(orderItem.getQuantity());
        BigDecimal amount = order.getAmount().subtract(price);
        if (amount.compareTo(BigDecimal.ZERO) < 0)
            throw new BusinessRuleException(ErrorCode.AMOUNT_LT_ZERO);

        order.setAmount(amount);
        orderRepository.save(order);
        orderItemRepository.deleteById(itemId);

        return "order item deleting successfully";
    }

    private OrderResponseDto toResponseDto(Order order){
        return new OrderResponseDto(
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
                order.getClosedAt()
        );
    }

    private OrderItemResponseDto itemToResponseDto(OrderItem orderItem){
        return new OrderItemResponseDto(
                orderItem.getId(),
                orderItem.getOrder().getId(),
                orderItem.getMenuItem().getId(),
                orderItem.getMenuItem().getName(),
                orderItem.getQuantity(),
                orderItem.getUnitPrice(),
                orderItem.getStatus(),
                orderItem.getNote()
        );
    }

}
