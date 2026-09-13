package com.coffee.shop.controller;

import com.coffee.shop.dto.request.RawMaterialRequestDto;
import com.coffee.shop.dto.response.RawMaterialResponseDto;
import com.coffee.shop.services.RawMaterialServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/raw-materials")
@RequiredArgsConstructor
public class InventoryController {

    private final RawMaterialServices rawMaterialServices;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<List<RawMaterialResponseDto>> getAll() {
        return ResponseEntity.ok(rawMaterialServices.getAll());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<RawMaterialResponseDto> create(@RequestBody @Valid RawMaterialRequestDto dto) {
        return ResponseEntity.ok(rawMaterialServices.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<RawMaterialResponseDto> update
            (@PathVariable Long id, @RequestBody @Valid RawMaterialRequestDto dto) {
        return ResponseEntity.ok(rawMaterialServices.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<String> delete (@PathVariable Long id) {
        return ResponseEntity.ok(rawMaterialServices.delete(id));
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'BARISTA')")
    public ResponseEntity<List<RawMaterialResponseDto>> lowStock() {
        return ResponseEntity.ok(rawMaterialServices.getLowStock());
    }

}
