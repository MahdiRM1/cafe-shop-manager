package com.coffee.shop.exception;

public class BusinessRuleException extends BaseException {
    public BusinessRuleException(ErrorCode errorCode) {
        super(errorCode);
    }

    public BusinessRuleException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }
}