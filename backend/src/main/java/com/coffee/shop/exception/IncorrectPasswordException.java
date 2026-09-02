package com.coffee.shop.exception;

public class IncorrectPasswordException extends BaseException {
    public IncorrectPasswordException() {
        super(ErrorCode.INCORRECT_PASSWORD);
    }

    public IncorrectPasswordException(String customMessage) {
        super(ErrorCode.INCORRECT_PASSWORD, customMessage);
    }
}
