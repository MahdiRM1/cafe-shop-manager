package com.coffee.shop.services;

import com.coffee.shop.dto.request.MenuItemRequestDto;
import com.coffee.shop.dto.response.MenuItemResponseDto;
import com.coffee.shop.entity.Category;
import com.coffee.shop.entity.MenuItem;
import com.coffee.shop.entity.RecipeItem;
import com.coffee.shop.exception.ErrorCode;
import com.coffee.shop.exception.ResourceNotFoundException;
import com.coffee.shop.repository.CategoryRepository;
import com.coffee.shop.repository.MenuItemRepository;
import com.coffee.shop.repository.RecipeItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuItemServices {

    private final MenuItemRepository repository;
    private final RecipeItemRepository recipeItemRepository;
    private final CategoryRepository categoryRepository;

    public MenuItemResponseDto create(MenuItemRequestDto dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CATEGORY_NOT_FOUND));

        MenuItem menuItem = new MenuItem();
        toObj(dto, menuItem, category);
        MenuItem saved = repository.save(menuItem);
        return toResponseDto(saved);
    }

    public List<MenuItemResponseDto> getByCategoryId(){
        return repository.findAll().stream()
                .map(this::toResponseDto).toList();
    }

    public List<MenuItemResponseDto> getByCategoryId(Long id){
        return repository.findByCategoryId(id).stream()
                .map(this::toResponseDto).toList();
    }

    public List<MenuItemResponseDto> getAvailable(){
        return repository.findAll().stream()
                .map(this::toResponseDto).filter(MenuItemResponseDto::isAvailable)
                .toList();
    }

    public List<MenuItemResponseDto> getAvailable(Long categoryId){
        return repository.findByCategoryId(categoryId).stream()
                .map(this::toResponseDto).filter(MenuItemResponseDto::isAvailable)
                .toList();
    }

    public MenuItemResponseDto getById(Long id){
        MenuItem category = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.MENU_ITEM_NOT_FOUND));
        return toResponseDto(category);
    }

    public MenuItemResponseDto update(Long id, MenuItemRequestDto dto){
        MenuItem menuItem = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.MENU_ITEM_NOT_FOUND));
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CATEGORY_NOT_FOUND));

        toObj(dto, menuItem, category);
        MenuItem updated = repository.save(menuItem);
        return toResponseDto(updated);
    }

    public String delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException(ErrorCode.MENU_ITEM_NOT_FOUND);
        repository.deleteById(id);
        return "menu item deleting successfully";
    }

    private String calculateAvailability(MenuItem menuItem) {
        List<RecipeItem> recipeItems =
                recipeItemRepository.findByMenuItemId(menuItem.getId());

        if(recipeItems.isEmpty()) return "رسپی ای وجود ندارد.";

        for(RecipeItem recipeItem: recipeItems) {
            if (recipeItem.getRawMaterial().getCurrentStock()
                    .compareTo(recipeItem.getQuantityNeeded()) < 0)
                return ("آیتم "+recipeItem.getRawMaterial().getName()+" موجودی کافی ندارد.");
        }
        return null;
    }

    private void toObj(MenuItemRequestDto dto, MenuItem menuItem, Category category) {
        menuItem.setName(dto.getName());
        menuItem.setPrice(dto.getPrice());
        menuItem.setImagePath(dto.getImagePath());
        menuItem.setDescription(dto.getDescription());
        menuItem.setCategory(category);
    }

    private MenuItemResponseDto toResponseDto(MenuItem menuItem) {
        String unavailableReason = calculateAvailability(menuItem);
        return new MenuItemResponseDto(
                menuItem.getId(),
                menuItem.getName(),
                menuItem.getPrice(),
                unavailableReason == null,
                menuItem.getImagePath(),
                menuItem.getDescription(),
                menuItem.getCategory().getId(),
                menuItem.getCategory().getName(),
                unavailableReason
        );
    }

}
