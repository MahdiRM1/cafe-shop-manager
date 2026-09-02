package com.coffee.shop.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Getter
@RequiredArgsConstructor
public class ApiErrorResponse {
    private final boolean success;
    private final int errorCode;
    private final String message;
    private final int status;
    private final LocalDateTime time;
    private final String path;
}
