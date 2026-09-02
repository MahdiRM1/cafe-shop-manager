package com.coffee.shop.services;

import com.coffee.shop.dto.request.CategoryRequestDto;
import com.coffee.shop.dto.response.CategoryResponseDto;
import com.coffee.shop.entity.Category;
import com.coffee.shop.exception.ErrorCode;
import com.coffee.shop.exception.ResourceNotFoundException;
import com.coffee.shop.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repository;

    public CategoryResponseDto create(CategoryRequestDto dto) {
        Category category = new Category();
        category.setName(dto.getName());
        category.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);

        Category saved = repository.save(category);
        return toResponseDto(saved);
    }

    public List<CategoryResponseDto> getAll(){
        return repository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::toResponseDto).toList();
    }

    public CategoryResponseDto getById(Long id){
        Category category = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CATEGORY_NOT_FOUND));
        return toResponseDto(category);
    }

    public CategoryResponseDto update(Long id, CategoryRequestDto dto){
        Category category = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.CATEGORY_NOT_FOUND));
        category.setName(dto.getName());
        category.setDisplayOrder(dto.getDisplayOrder() != null ? dto.getDisplayOrder() : 0);

        Category updated = repository.save(category);
        return toResponseDto(updated);
    }

    public String delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException(ErrorCode.CATEGORY_NOT_FOUND);
        repository.deleteById(id);
        return "category deleting successfully";
    }

    private CategoryResponseDto toResponseDto(Category category){
        return new CategoryResponseDto(
                category.getId(),
                category.getName(),
                category.getDisplayOrder()
        );
    }
}
