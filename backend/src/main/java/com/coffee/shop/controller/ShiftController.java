package com.coffee.shop.controller;

import com.coffee.shop.dto.report.ShiftReportDto;
import com.coffee.shop.dto.request.ShiftCloseRequestDto;
import com.coffee.shop.dto.request.ShiftOpenRequestDto;
import com.coffee.shop.dto.response.ShiftResponseDto;
import com.coffee.shop.entity.User;
import com.coffee.shop.services.ReportServices;
import com.coffee.shop.services.ShiftServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/shifts")
public class ShiftController {

    private final ShiftServices shiftService;
    private final ReportServices reportServices;

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<List<ShiftResponseDto>> getAll(){
        return ResponseEntity.ok(shiftService.getAll());
    }

    @PostMapping("/open")
    @PreAuthorize("hasAuthority('CASHIER')")
    public ResponseEntity<ShiftResponseDto> open(
            @AuthenticationPrincipal User user, @RequestBody @Valid ShiftOpenRequestDto dto){
        return ResponseEntity.ok(shiftService.open(user.getId(), dto));
    }

    @PostMapping("/close")
    @PreAuthorize("hasAuthority('CASHIER')")
    public ResponseEntity<ShiftResponseDto> close
            (@AuthenticationPrincipal User user, @RequestBody @Valid ShiftCloseRequestDto dto) {
        return ResponseEntity.ok(shiftService.close(user.getId(), dto));
    }

    @GetMapping("/current")
    @PreAuthorize("hasAuthority('CASHIER')")
    public ResponseEntity<ShiftResponseDto> delete(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(shiftService.current(user.getId()));
    }

    @GetMapping("/{id}/report")
    @PreAuthorize("hasAnyAuthority('MANAGER', 'CASHIER')")
    public ResponseEntity<ShiftReportDto> report(@PathVariable Long id) {
        return ResponseEntity.ok(reportServices.shiftReport(id));
    }

}
