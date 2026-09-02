package com.coffee.shop.services;

import com.coffee.shop.dto.request.ReservationRequestDto;
import com.coffee.shop.dto.response.ReservationResponseDto;
import com.coffee.shop.entity.Reservation;
import com.coffee.shop.entity.RestaurantTable;
import com.coffee.shop.enums.ReservationStatus;
import com.coffee.shop.enums.TableStatus;
import com.coffee.shop.exception.ErrorCode;
import com.coffee.shop.exception.ResourceNotFoundException;
import com.coffee.shop.repository.ReservationRepository;
import com.coffee.shop.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationServices {
    
    private final ReservationRepository repository;
    private final RestaurantTableRepository tableRepository;

    public ReservationResponseDto create(Long tableId, ReservationRequestDto dto) {
        RestaurantTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.TABLE_NOT_FOUND));

        Reservation reservation = new Reservation();
        toObj(dto, table, reservation);
        Reservation saved = repository.save(reservation);
        return toResponseDto(saved);
    }

    public List<ReservationResponseDto> getAll(){
        return repository.findAll().stream()
                .map(this::toResponseDto).toList();
    }

    public ReservationResponseDto getById(Long id){
        Reservation reservation = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESERVATION_NOT_FOUND));
        return toResponseDto(reservation);
    }

    public List<ReservationResponseDto> getByStatus(ReservationStatus status){
        return repository.findByStatus(status).stream()
                .map(this::toResponseDto).toList();
    }

    public List<ReservationResponseDto> getByTableId(Long tableId){
        return repository.findByTableId(tableId).stream()
                .map(this::toResponseDto).toList();
    }

    public ReservationResponseDto cancel(Long id) {
        Reservation reservation = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESERVATION_NOT_FOUND));
        reservation.setStatus(ReservationStatus.CANCELED);

        Reservation updated = repository.save(reservation);
        return toResponseDto(updated);
    }

    public ReservationResponseDto update(Long id, ReservationRequestDto dto){
        Reservation reservation = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESERVATION_NOT_FOUND));
        RestaurantTable table = tableRepository.findById(reservation.getTable().getId())
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.TABLE_NOT_FOUND));

        toObj(dto, table, reservation);
        Reservation updated = repository.save(reservation);
        return toResponseDto(updated);
    }

    private void toObj(ReservationRequestDto dto, RestaurantTable table, Reservation reservation) {
        reservation.setTable(table);
        reservation.setCustomerName(dto.getCustomerName());
        reservation.setCustomerPhone(dto.getCustomerPhone());
        reservation.setReservationTime(dto.getReservationTime());
        reservation.setNote(dto.getNote());
    }

    private ReservationResponseDto toResponseDto(Reservation reservation){
        return new ReservationResponseDto(
                reservation.getId(),
                reservation.getTable().getId(),
                reservation.getTable().getTableNumber(),
                reservation.getCustomerName(),
                reservation.getCustomerPhone(),
                reservation.getReservationTime(),
                reservation.getStatus(),
                reservation.getNote()
        );
    }
    
}
