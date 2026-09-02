package com.coffee.shop.controller;

import com.coffee.shop.dto.request.MenuItemRequestDto;
import com.coffee.shop.dto.request.RecipeItemRequestDto;
import com.coffee.shop.dto.response.MenuItemResponseDto;
import com.coffee.shop.dto.response.RecipeItemResponseDto;
import com.coffee.shop.services.MenuItemServices;
import com.coffee.shop.services.RecipeItemServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu-items")
@RequiredArgsConstructor
public class MenuItemController {

    private final MenuItemServices menuItemServices;
    private final RecipeItemServices recipeItemServices;

    @GetMapping
    public ResponseEntity<List<MenuItemResponseDto>> getAll(
            @RequestParam(required = false) Long categoryId) {
        if (categoryId == null) return ResponseEntity.ok(menuItemServices.getByCategoryId());
        return ResponseEntity.ok(menuItemServices.getByCategoryId(categoryId));
    }

    @GetMapping("/available")
    public ResponseEntity<List<MenuItemResponseDto>> getAvailable(
            @RequestParam(required = false) Long categoryId) {
        if (categoryId == null) return ResponseEntity.ok(menuItemServices.getAvailable());
        return ResponseEntity.ok(menuItemServices.getAvailable(categoryId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItemResponseDto> getById(@PathVariable Long id){
        return ResponseEntity.ok(menuItemServices.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<MenuItemResponseDto> create(@RequestBody @Valid MenuItemRequestDto dto) {
        return ResponseEntity.ok(menuItemServices.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<MenuItemResponseDto> update
            (@PathVariable Long id, @RequestBody @Valid MenuItemRequestDto dto) {
        return ResponseEntity.ok(menuItemServices.update(id, dto));
    }

    @DeleteMapping("/{id}")
        @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<String> delete(@PathVariable Long id){
        return ResponseEntity.ok(menuItemServices.delete(id));
    }

    @GetMapping("/{menuItemId}/recipe")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<List<RecipeItemResponseDto>> getRecipe
            (@PathVariable Long menuItemId) {
        return ResponseEntity.ok(recipeItemServices.getRecipe(menuItemId));
    }

    @PutMapping("/{menuItemId}/recipe")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<List<RecipeItemResponseDto>> updateRecipe
            (@PathVariable Long menuItemId, @RequestBody @Valid List<RecipeItemRequestDto> items) {
        return ResponseEntity.ok(recipeItemServices.updateRecipe(menuItemId, items));
    }

}
