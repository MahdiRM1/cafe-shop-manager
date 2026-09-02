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

    @PutMapping("/update-information")
    public ResponseEntity<UserResponseDto> updateInformation
            (@AuthenticationPrincipal User user, @RequestBody @Valid UserUpdateInformationRequestDto dto) {
        System.out.println("test");
        return ResponseEntity.ok(userServices.updateInformation(user.getId(), dto));
    }

    @PutMapping("/update-password")
    public ResponseEntity<UserResponseDto> updatePassword
            (@AuthenticationPrincipal User user, @RequestBody @Valid UserUpdatePasswordRequestDto dto) {
        return ResponseEntity.ok(userServices.updatePassword(user.getId(), dto));
    }

    @PutMapping("/{id}/manager-update-password")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<UserResponseDto> managerUpdatePassword
            (@PathVariable Long id, @RequestBody @Valid UserManagerUpdatePasswordDto dto) {
        return ResponseEntity.ok(userServices.managerUpdatePassword(id, dto));
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<UserResponseDto> deactivate(@PathVariable Long id) {
        return ResponseEntity.ok(userServices.deactivate(id));
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<UserResponseDto> activate(@PathVariable Long id) {
        return ResponseEntity.ok(userServices.activate(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<String> delete(@PathVariable Long id){
        return ResponseEntity.ok(userServices.delete(id));
    }

}
