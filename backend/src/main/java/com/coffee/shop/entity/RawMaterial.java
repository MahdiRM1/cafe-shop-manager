package com.coffee.shop.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "raw_material")
@Data
public class RawMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "unit", length = 10, nullable = false)
    private String unit;

    @Column(name = "current_stock", nullable = false, precision = 12, scale = 2)
    private BigDecimal currentStock = BigDecimal.ZERO;

    @Column(name = "min_stock_alert", nullable = false, precision = 12, scale = 2)
    private BigDecimal minStockAlert;

    @Column(name = "cost_per_unit", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitCost;
}
