package com.coffee.shop.repository;

import com.coffee.shop.entity.RecipeItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeItemRepository extends JpaRepository<RecipeItem, Long> {
    List<RecipeItem> findByMenuItemId(Long menuItemId);
    void deleteByMenuItemId(Long menuItemId);
}
