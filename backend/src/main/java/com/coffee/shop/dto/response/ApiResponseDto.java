package com.coffee.shop.dto.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ApiResponseDto<T> {

    private final boolean success;
    private final String message;
    private final T data;

    public static <T> ApiResponseDto<T> success(T data, String message) {
        return new ApiResponseDto<>(true, message, data);
    }

    public static <T> ApiResponseDto<T> success(T data) {
        return success(data, null);
    }
}