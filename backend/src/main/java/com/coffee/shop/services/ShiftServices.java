package com.coffee.shop.services;

import com.coffee.shop.dto.request.ShiftCloseRequestDto;
import com.coffee.shop.dto.request.ShiftOpenRequestDto;
import com.coffee.shop.dto.response.ShiftResponseDto;
import com.coffee.shop.entity.Payment;
import com.coffee.shop.entity.Shift;
import com.coffee.shop.entity.User;
import com.coffee.shop.enums.ShiftStatus;
import com.coffee.shop.exception.DuplicateResourceException;
import com.coffee.shop.exception.ErrorCode;
import com.coffee.shop.exception.NoAccessException;
import com.coffee.shop.exception.ResourceNotFoundException;
import com.coffee.shop.repository.PaymentRepository;
import com.coffee.shop.repository.ShiftRepository;
import com.coffee.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ShiftServices {
    
    private final ShiftRepository repository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    public ShiftResponseDto open(Long userId, ShiftOpenRequestDto dto) {
        if (repository.findByUserIdAndStatus(userId, ShiftStatus.OPEN).isPresent())
            throw new DuplicateResourceException(ErrorCode.SHIFT_ALREADY_OPEN);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND));

        Shift shift = new Shift();
        shift.setUser(user);
        shift.setOpeningCash(dto.getOpeningCash());

        Shift saved = repository.save(shift);
        return toResponseDto(saved);
    }

    public ShiftResponseDto close(Long userId, ShiftCloseRequestDto dto) {
        Shift shift = repository.findByUserIdAndStatus(userId, ShiftStatus.OPEN)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.SHIFT_NOT_FOUND));


        shift.setClosingCash(dto.getClosingCash());
        shift.setClosedAt(LocalDateTime.now());
        shift.setStatus(ShiftStatus.CLOSED);
        shift.setExpectedCash(calculateExpectedCash(shift));

        Shift saved = repository.save(shift);
        return toResponseDto(saved);
    }

    public ShiftResponseDto current(Long userId) {
        Shift shift = repository.findByUserIdAndStatus(userId, ShiftStatus.OPEN)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.SHIFT_NOT_FOUND));
        return toResponseDto(shift);
    }

    public BigDecimal calculateExpectedCash(Shift shift) {
        List<Payment> payments = paymentRepository.findByShiftId(shift.getId());
        BigDecimal totalCashPayments = payments.stream().map(Payment::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        return shift.getOpeningCash().add(totalCashPayments);
    }

    public List<ShiftResponseDto> getAll(){
        return repository.findAll().stream()
                .map(this::toResponseDto).toList();
    }

    public ShiftResponseDto getById(Long id){
        Shift shift = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.SHIFT_NOT_FOUND));
        return toResponseDto(shift);
    }

    public List<ShiftResponseDto> getByUserId(Long userId){
        return repository.findByUserId(userId).stream()
                .map(this::toResponseDto).toList();
    }

    public String delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException(ErrorCode.SHIFT_NOT_FOUND);
        repository.deleteById(id);
        return "Shift deleting successfully";
    }

    private ShiftResponseDto toResponseDto(Shift shift){
        return new ShiftResponseDto(
                shift.getId(),
                shift.getUser().getId(),
                shift.getUser().getFullName(),
                shift.getOpeningCash(),
                shift.getClosingCash(),
                shift.getExpectedCash(),
                shift.getOpenedAt(),
                shift.getClosedAt(),
                shift.getStatus()
        );
    }
    
}
