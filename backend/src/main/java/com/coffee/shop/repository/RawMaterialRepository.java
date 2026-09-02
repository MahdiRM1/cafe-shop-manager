package com.coffee.shop.repository;

import com.coffee.shop.entity.RawMaterial;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RawMaterialRepository extends JpaRepository<RawMaterial, Long> {
    @Query("SELECT r FROM RawMaterial r WHERE r.currentStock <= r.minStockAlert")
    List<RawMaterial> findLowStockMaterials();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM RawMaterial r WHERE r.id = :id")
    Optional<RawMaterial> findByIdForUpdate(@Param("id") Long id);
}
