package com.coffee.shop.exception;

public class InsufficientStockException extends BaseException {
    public InsufficientStockException(ErrorCode errorCode) {
        super(errorCode);
    }

    public InsufficientStockException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }
}
