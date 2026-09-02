package com.coffee.shop.entity;

import com.coffee.shop.enums.ShiftStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "shifts")
@Data
public class Shift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "opening_cash", nullable = false, precision = 14, scale = 0, updatable = false)
    private BigDecimal openingCash;

    @Column(name = "closing_cash", precision = 14, scale = 0)
    private BigDecimal closingCash;

    @Column(name = "expected_cash", precision = 14, scale = 0)
    private BigDecimal expectedCash;

    @Column(name = "opened_at", nullable = false, updatable = false)
    private LocalDateTime openedAt = LocalDateTime.now();

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "shift_status", nullable = false)
    private ShiftStatus status = ShiftStatus.OPEN;
}
