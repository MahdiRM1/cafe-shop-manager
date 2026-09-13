package com.coffee.shop.services;

import com.coffee.shop.dto.request.RecipeItemRequestDto;
import com.coffee.shop.dto.response.RecipeItemResponseDto;
import com.coffee.shop.entity.MenuItem;
import com.coffee.shop.entity.RawMaterial;
import com.coffee.shop.entity.RecipeItem;
import com.coffee.shop.exception.ErrorCode;
import com.coffee.shop.exception.ResourceNotFoundException;
import com.coffee.shop.repository.MenuItemRepository;
import com.coffee.shop.repository.RawMaterialRepository;
import com.coffee.shop.repository.RecipeItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecipeItemServices {
    
    private final RecipeItemRepository repository;
    private final MenuItemRepository menuItemRepository;
    private final RawMaterialRepository rawMaterialRepository;

    @Transactional
    public List<RecipeItemResponseDto> updateRecipe(Long menuItemId, List<RecipeItemRequestDto> items) {
        MenuItem item = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.MENU_ITEM_NOT_FOUND));
        repository.deleteByMenuItemId(menuItemId);

        List<RecipeItem> newItems = items.stream().map(dto -> create(item, dto)).toList();

        List<RecipeItem> savedItems = repository.saveAll(newItems);
        return savedItems.stream().map(this::toResponseDto).toList();
    }

    public RecipeItem create(MenuItem item, RecipeItemRequestDto dto) {
        RawMaterial material = rawMaterialRepository.findById(dto.getRawMaterialId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RAW_MATERIAL_NOT_FOUND));

        RecipeItem recipeItem = new RecipeItem();
        recipeItem.setRawMaterial(material);
        recipeItem.setQuantityNeeded(dto.getQuantityNeeded());
        recipeItem.setMenuItem(item);

        return recipeItem;
    }

    public List<RecipeItemResponseDto> getRecipe(Long menuItemId) {
        return repository.findByMenuItemId(menuItemId).stream()
                .map(this::toResponseDto).toList();
    }

    private RecipeItemResponseDto toResponseDto(RecipeItem recipeItem){
        return new RecipeItemResponseDto(
                recipeItem.getId(),
                recipeItem.getMenuItem().getId(),
                recipeItem.getMenuItem().getName(),
                recipeItem.getRawMaterial().getId(),
                recipeItem.getRawMaterial().getName(),
                recipeItem.getRawMaterial().getUnit(),
                recipeItem.getQuantityNeeded()
        );
    }
    
}
