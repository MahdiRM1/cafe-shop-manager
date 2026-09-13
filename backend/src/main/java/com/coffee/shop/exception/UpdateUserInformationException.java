package com.coffee.shop.exception;

public class UpdateUserInformationException extends BaseException {
    public UpdateUserInformationException() {
        super(ErrorCode.UPDATE_USER_INFORMATION_FAILED);
    }

    public UpdateUserInformationException(String customMessage) {
        super(ErrorCode.UPDATE_USER_INFORMATION_FAILED, customMessage);
    }
}