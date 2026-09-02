package com.coffee.shop.exception;

public class ForbiddenException extends BaseException {
    public ForbiddenException(ErrorCode code) {
        super(code);
    }

    public ForbiddenException(ErrorCode code, String message) {
        super(code, message);
    }
}
