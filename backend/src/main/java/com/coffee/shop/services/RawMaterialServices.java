package com.coffee.shop.services;

import com.coffee.shop.dto.request.RawMaterialRequestDto;
import com.coffee.shop.dto.request.RestockRequestDto;
import com.coffee.shop.dto.response.RawMaterialResponseDto;
import com.coffee.shop.entity.InventoryTransaction;
import com.coffee.shop.entity.RawMaterial;
import com.coffee.shop.enums.InventoryTransactionType;
import com.coffee.shop.exception.ErrorCode;
import com.coffee.shop.exception.ResourceNotFoundException;
import com.coffee.shop.repository.InventoryTransactionRepository;
import com.coffee.shop.repository.RawMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RawMaterialServices {

    private final RawMaterialRepository repository;
    private final InventoryTransactionRepository iTRepository;

    public RawMaterialResponseDto create(RawMaterialRequestDto dto){
        RawMaterial material = new RawMaterial();
        material.setName(dto.getName());
        material.setUnit(dto.getUnit());
        material.setMinStockAlert(dto.getMinStockAlert());

        RawMaterial saved = repository.save(material);
        return toResponseDto(saved);
    }

    public List<RawMaterialResponseDto> getAll(){
        return repository.findAll().stream().map(this::toResponseDto).toList();
    }

    public RawMaterialResponseDto getById(Long id) {
        RawMaterial material = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RAW_MATERIAL_NOT_FOUND));
        return toResponseDto(material);
    }

    public List<RawMaterialResponseDto> getLowStock(){
        return repository.findLowStockMaterials().stream().map(this::toResponseDto).toList();
    }

    public RawMaterialResponseDto update(Long id, RawMaterialRequestDto dto){
        RawMaterial material = repository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RAW_MATERIAL_NOT_FOUND));
        material.setName(dto.getName());
        material.setUnit(dto.getUnit());
        material.setMinStockAlert(dto.getMinStockAlert());

        RawMaterial updated = repository.save(material);
        return toResponseDto(updated);
    }

    public String delete(Long id){
        if (!repository.existsById(id)) throw new ResourceNotFoundException(ErrorCode.RAW_MATERIAL_NOT_FOUND);
        repository.deleteById(id);
        return "raw material deleting successfully";
    }

    private RawMaterialResponseDto toResponseDto(RawMaterial material){
        return new RawMaterialResponseDto(
                material.getId(),
                material.getName(),
                material.getUnit(),
                material.getCurrentStock(),
                material.getMinStockAlert()
        );
    }
}
