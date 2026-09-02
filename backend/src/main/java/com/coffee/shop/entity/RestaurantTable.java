package com.coffee.shop.entity;

import com.coffee.shop.enums.TableStatus;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tables")
@Data
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "table_number", length = 10, nullable = false)
    private String tableNumber;

    @Column(name = "capacity")
    private Integer capacity = 4;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TableStatus status = TableStatus.EMPTY;
}
