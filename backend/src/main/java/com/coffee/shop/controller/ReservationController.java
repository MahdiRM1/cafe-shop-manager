package com.coffee.shop.controller;

import com.coffee.shop.dto.request.ReservationRequestDto;
import com.coffee.shop.dto.response.ReservationResponseDto;
import com.coffee.shop.services.ReservationServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationServices reservationServices;

    @GetMapping("")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<List<ReservationResponseDto>> getAll() {
        return ResponseEntity.ok(reservationServices.getAll());
    }

    @PostMapping("/{tableId}")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<ReservationResponseDto> create
            (@PathVariable Long tableId, @RequestBody @Valid ReservationRequestDto dto){
        return ResponseEntity.ok(reservationServices.create(tableId, dto));
    }

    @PutMapping("/{tableId}")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<ReservationResponseDto> update
            (@PathVariable Long tableId, @RequestBody @Valid ReservationRequestDto dto) {
        return ResponseEntity.ok(reservationServices.update(tableId, dto));
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<ReservationResponseDto> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(reservationServices.cancel(id));
    }

}