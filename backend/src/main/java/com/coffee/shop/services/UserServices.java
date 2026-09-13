package com.coffee.shop.services;

import com.coffee.shop.dto.request.UserManagerUpdatePasswordDto;
import com.coffee.shop.dto.request.UserRequestDto;
import com.coffee.shop.dto.request.UserUpdateInformationRequestDto;
import com.coffee.shop.dto.request.UserUpdatePasswordRequestDto;
import com.coffee.shop.dto.response.UserResponseDto;
import com.coffee.shop.entity.User;
import com.coffee.shop.exception.*;
import com.coffee.shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServices {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserResponseDto create(UserRequestDto dto) {
        if (repository.existsByUsername(dto.getUsername()))
            throw new DuplicateResourceException(ErrorCode.USERNAME_ALREADY_EXISTS);

        User user = new User();
        user.setFullName(dto.getFullName());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setUsername(dto.getUsername());
        user.setRole(dto.getRole());

        User saved = repository.save(user);
        return toResponseDto(saved);
    }

    public List<UserResponseDto> getAll() {
        return repository.findAll().stream().map(this::toResponseDto).toList();
    }

    public UserResponseDto getById(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND));
        return toResponseDto(user);
    }

    public UserResponseDto updateInformation(Long id, UserUpdateInformationRequestDto dto) {
        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND));

        boolean usernameEmpty = dto.getUsername() == null || dto.getUsername().isBlank();
        boolean fullNameEmpty = dto.getFullName() == null || dto.getFullName().isBlank();
        if (usernameEmpty && fullNameEmpty)
            throw new UpdateUserInformationException();

        user.setUsername(usernameEmpty ? user.getUsername() : dto.getUsername());
        user.setFullName(fullNameEmpty ? user.getFullName() : dto.getFullName());

        User updated = repository.save(user);
        return toResponseDto(updated);
    }

    public UserResponseDto updatePassword(Long id, UserUpdatePasswordRequestDto dto) {
        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND));
        if(!passwordEncoder.matches(dto.getCurrentPassword(), user.getPasswordHash()))
            throw new IncorrectPasswordException();

        user.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
        User updated = repository.save(user);
        return toResponseDto(updated);
    }

    public UserResponseDto managerUpdatePassword(Long id, UserManagerUpdatePasswordDto dto) {
        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND));

        user.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
        User updated = repository.save(user);
        return toResponseDto(updated);
    }

    public UserResponseDto toggleActivate(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND));

        user.setActive(user.isActive() ? false : true);

        User updated = repository.save(user);
        return toResponseDto(updated);
    }

    public String delete(Long id){
        if (!repository.existsById(id)) throw new ResourceNotFoundException(ErrorCode.USER_NOT_FOUND);
        repository.deleteById(id);
        return "user deleting successfully";
    }

    public UserResponseDto toResponseDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt()
        );
    }
}
