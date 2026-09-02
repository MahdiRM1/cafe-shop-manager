package com.coffee.shop.repository;

import com.coffee.shop.entity.RestaurantTable;
import com.coffee.shop.enums.ReservationStatus;
import com.coffee.shop.enums.TableStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
    List<RestaurantTable> findByStatus(ReservationStatus status);
}
