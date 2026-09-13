package com.coffee.shop.controller;


import com.coffee.shop.dto.request.CategoryRequestDto;
import com.coffee.shop.dto.response.CategoryResponseDto;
import com.coffee.shop.services.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("")
    public ResponseEntity<List<CategoryResponseDto>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    @PostMapping("")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<CategoryResponseDto> create(@RequestBody @Valid CategoryRequestDto dto){
        return ResponseEntity.ok(categoryService.create(dto));
    }

    @PutMapping("/{categoryId}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<CategoryResponseDto> update
            (@PathVariable Long categoryId, @RequestBody @Valid CategoryRequestDto dto) {
        return ResponseEntity.ok(categoryService.update(categoryId, dto));
    }

    @DeleteMapping("/{categoryId}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<String> delete(@PathVariable Long categoryId) {
        return ResponseEntity.ok(categoryService.delete(categoryId));
    }

}
