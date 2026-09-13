package com.coffee.shop.controller;

import com.coffee.shop.dto.request.UserManagerUpdatePasswordDto;
import com.coffee.shop.dto.request.UserRequestDto;
import com.coffee.shop.dto.request.UserUpdateInformationRequestDto;
import com.coffee.shop.dto.request.UserUpdatePasswordRequestDto;
import com.coffee.shop.dto.response.UserResponseDto;
import com.coffee.shop.entity.User;
import com.coffee.shop.services.UserServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserServices userServices;

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<List<UserResponseDto>> getAll(){
        return ResponseEntity.ok(userServices.getAll());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<UserResponseDto> create(@RequestBody @Valid UserRequestDto dto) {
        return ResponseEntity.ok(userServices.create(dto));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<UserResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userServices.getById(id));
    }

    @PatchMapping("{userId}/update-information")
    public ResponseEntity<UserResponseDto> updateInformation
            (@PathVariable Long userId, @RequestBody @Valid UserUpdateInformationRequestDto dto) {
        return ResponseEntity.ok(userServices.updateInformation(userId, dto));
    }

    @PatchMapping("/update-password")
    public ResponseEntity<UserResponseDto> updatePassword
            (@AuthenticationPrincipal User user, @RequestBody @Valid UserUpdatePasswordRequestDto dto) {
        return ResponseEntity.ok(userServices.updatePassword(user.getId(), dto));
    }

    @PatchMapping("/{id}/manager-update-password")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<UserResponseDto> managerUpdatePassword
            (@PathVariable Long id, @RequestBody @Valid UserManagerUpdatePasswordDto dto) {
        return ResponseEntity.ok(userServices.managerUpdatePassword(id, dto));
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<UserResponseDto> toggleActivate(@PathVariable Long id) {
        return ResponseEntity.ok(userServices.toggleActivate(id));
    }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<String> delete(@PathVariable Long id){
        return ResponseEntity.ok(userServices.delete(id));
    }

}
