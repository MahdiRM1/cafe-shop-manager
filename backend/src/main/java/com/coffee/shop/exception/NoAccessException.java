package com.coffee.shop.exception;

public class NoAccessException extends BaseException {
    public NoAccessException(ErrorCode errorCode) {
        super(errorCode);
    }

    public NoAccessException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }
}