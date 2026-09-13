package com.coffee.shop.services;

import com.coffee.shop.dto.request.RestaurantTableRequestDto;
import com.coffee.shop.dto.request.RestaurantTableStatusUpdateRequestDto;
import com.coffee.shop.dto.response.RestaurantTableResponseDto;
import com.coffee.shop.entity.RestaurantTable;
import com.coffee.shop.exception.ErrorCode;
import com.coffee.shop.exception.ResourceNotFoundException;
import com.coffee.shop.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RestaurantTableServices {
    
    private final RestaurantTableRepository repository;

    public RestaurantTableResponseDto create(RestaurantTableRequestDto dto) {
        RestaurantTable table = new RestaurantTable();
        table.setTableNumber(dto.getTableNumber());
        table.setCapacity(dto.getCapacity());

        RestaurantTable saved = repository.save(table);
        return toResponseDto(saved);
    }

    public List<RestaurantTableResponseDto> getAll(){
        return repository.findAll().stream()
                .map(this::toResponseDto).toList();
    }

    public RestaurantTableResponseDto getById(Long id){
        RestaurantTable table = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.TABLE_NOT_FOUND));
        return toResponseDto(table);
    }

    public RestaurantTableResponseDto update(Long id, RestaurantTableRequestDto dto){
        RestaurantTable table = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.TABLE_NOT_FOUND));
        table.setTableNumber(dto.getTableNumber());
        table.setCapacity(dto.getCapacity());

        RestaurantTable updated = repository.save(table);
        return toResponseDto(updated);
    }

    public RestaurantTableResponseDto updateStatus(Long id, RestaurantTableStatusUpdateRequestDto dto){
        RestaurantTable table = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.TABLE_NOT_FOUND));
        table.setStatus(dto.getStatus());

        RestaurantTable updated = repository.save(table);
        return toResponseDto(updated);
    }

    public String delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException(ErrorCode.TABLE_NOT_FOUND);
        repository.deleteById(id);
        return "table deleting successfully";
    }

    private RestaurantTableResponseDto toResponseDto(RestaurantTable table){
        return new RestaurantTableResponseDto(
                table.getId(),
                table.getTableNumber(),
                table.getCapacity(),
                table.getStatus()
        );
    }

}
