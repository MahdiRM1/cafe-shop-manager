package com.coffee.shop.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ApiErrorResponse> handleBaseException(
            BaseException exception, HttpServletRequest request) {
        ErrorCode code = exception.getErrorCode();

        ApiErrorResponse error = new ApiErrorResponse(
        false,
                code.getCode(),
                exception.getMessage(),
                code.getHttpStatus().value(),
                LocalDateTime.now(),
                request.getRequestURI()
        );

        return ResponseEntity.status(error.getStatus()).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleJakartaException(
            MethodArgumentNotValidException exception, HttpServletRequest request) {

        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(" | "));

        ApiErrorResponse error = new ApiErrorResponse(
                false,
                0,
                message,
                exception.getStatusCode().value(),
                LocalDateTime.now(),
                request.getRequestURI()
        );

        return ResponseEntity.status(error.getStatus()).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGenericException(
            Exception exception, HttpServletRequest request) {
        String message = exception.getMessage();
        ApiErrorResponse error = new ApiErrorResponse(
                false,
                1,
                message,
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now(),
                request.getRequestURI()
        );

        return ResponseEntity.status(error.getStatus()).body(error);
    }
}
