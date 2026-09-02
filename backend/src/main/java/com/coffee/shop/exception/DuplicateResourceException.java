package com.coffee.shop.exception;

public class DuplicateResourceException extends BaseException {
    public DuplicateResourceException(ErrorCode errorCode) {
        super(errorCode);
    }

    public DuplicateResourceException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }
}