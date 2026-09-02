package com.coffee.shop.controller;

import com.coffee.shop.dto.request.RestaurantTableRequestDto;
import com.coffee.shop.dto.request.RestaurantTableStatusUpdateRequestDto;
import com.coffee.shop.dto.response.RestaurantTableResponseDto;
import com.coffee.shop.services.RestaurantTableServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class TableController {

    private final RestaurantTableServices tableServices;


    @GetMapping("")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<List<RestaurantTableResponseDto>> getAll() {
        return ResponseEntity.ok(tableServices.getAll());
    }

    @PostMapping("")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<RestaurantTableResponseDto> create(@RequestBody @Valid RestaurantTableRequestDto dto){
        return ResponseEntity.ok(tableServices.create(dto));
    }

    @PutMapping("/{tableId}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<RestaurantTableResponseDto> update
            (@PathVariable Long tableId, @RequestBody @Valid RestaurantTableRequestDto dto) {
        return ResponseEntity.ok(tableServices.update(tableId, dto));
    }

    @PatchMapping("/{tableId}/status")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<RestaurantTableResponseDto> update
            (@PathVariable Long tableId, @RequestBody @Valid RestaurantTableStatusUpdateRequestDto dto) {
        return ResponseEntity.ok(tableServices.updateStatus(tableId, dto));
    }

    @DeleteMapping("/{tableId}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<String> delete(@PathVariable Long tableId) {
        return ResponseEntity.ok(tableServices.delete(tableId));
    }

}
