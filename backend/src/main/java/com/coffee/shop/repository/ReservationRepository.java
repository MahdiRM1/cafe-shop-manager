package com.coffee.shop.repository;

import com.coffee.shop.entity.Reservation;
import com.coffee.shop.enums.ReservationStatus;
import com.coffee.shop.enums.TableStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByTableId(Long tableId);
    List<Reservation> findByStatus(ReservationStatus status);
}
