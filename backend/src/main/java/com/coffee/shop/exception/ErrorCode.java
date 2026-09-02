package com.coffee.shop.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    CATEGORY_NOT_FOUND(1001, "دسته‌بندی یافت نشد", HttpStatus.NOT_FOUND),
    MENU_ITEM_NOT_FOUND(1002, "آیتم منو یافت نشد", HttpStatus.NOT_FOUND),
    RAW_MATERIAL_NOT_FOUND(1003, "ماده اولیه یافت نشد", HttpStatus.NOT_FOUND),
    USER_NOT_FOUND(1004, "کاربر یافت نشد", HttpStatus.NOT_FOUND),
    ORDER_NOT_FOUND(1005, "سفارش یافت نشد", HttpStatus.NOT_FOUND),
    TABLE_NOT_FOUND(1006, "میز یافت نشد", HttpStatus.NOT_FOUND),
    RESERVATION_NOT_FOUND(1007, "رزرو یافت نشد", HttpStatus.NOT_FOUND),
    SHIFT_NOT_FOUND(1008, "شیفت یافت نشد", HttpStatus.NOT_FOUND),
    INVENTORY_TRANSACTION_NOT_FOUND(1009, "تراکنش انبار یافت نشد", HttpStatus.NOT_FOUND),
    ORDER_ITEM_NOT_FOUND(1010, "آیتم سفارش یافت نشد", HttpStatus.NOT_FOUND),
    PAYMENT_NOT_FOUND(1011, "پرداخت یافت نشد", HttpStatus.NOT_FOUND),
    PURCHASE_NOT_FOUND(1012, "خرید یافت نشد", HttpStatus.NOT_FOUND),
    PURCHASE_ITEM_NOT_FOUND(1013, "آیتم خرید یافت نشد", HttpStatus.NOT_FOUND),
    RECIPE_ITEM_NOT_FOUND(1014, "آیتم رسپی یافت نشد", HttpStatus.NOT_FOUND),

    USERNAME_ALREADY_EXISTS(2001, "این نام کاربری قبلاً استفاده شده است", HttpStatus.CONFLICT),
    SHIFT_ALREADY_OPEN(2002, "شیفت باز دیگری برای این کاربر وجود دارد", HttpStatus.CONFLICT),
    ACCOUNT_ALREADY_ACTIVE(2003, "اکانت در حال حاضر فعال است", HttpStatus.CONFLICT),
    ACCOUNT_ALREADY_DEACTIVE(2004, "اکانت در حال حاضر غیرفعال است", HttpStatus.CONFLICT),

    INSUFFICIENT_STOCK(3001, "موجودی ماده اولیه کافی نیست", HttpStatus.BAD_REQUEST),
    INVALID_ORDER_STATUS(3002, "وضعیت سفارش نامعتبر است", HttpStatus.BAD_REQUEST),
    ORDER_NOT_OPEN(3003, "سفارش باز نیست", HttpStatus.BAD_REQUEST),
    PURCHASE_NOT_OPEN(3004, "خرید باز نیست", HttpStatus.BAD_REQUEST),
    TABLE_REQUIRED_FOR_DINE_IN(3005, "برای سفارش حضوری انتخاب میز الزامی است", HttpStatus.BAD_REQUEST),
    TABLE_NOT_ALLOWED_FOR_TAKEAWAY(3006, "سفارش بیرون‌بر نمی‌تواند میز داشته باشد", HttpStatus.BAD_REQUEST),
    AMOUNT_LT_ZERO(3007, "مبلغ سفارش نمی‌تواند منفی شود", HttpStatus.BAD_REQUEST),
    NO_OPEN_SHIFT(3008, "شیفت باز برای این کاربر یافت نشد", HttpStatus.BAD_REQUEST),
    ORDER_AND_PURCHASE_NULL(3009, "پرداخت باید دقیقاً به یک سفارش یا یک خرید مرتبط باشد", HttpStatus.BAD_REQUEST),

    INCORRECT_PASSWORD(4001, "رمز عبور نادرست است", HttpStatus.UNAUTHORIZED),
    UPDATE_USER_INFORMATION_FAILED(4002, "نام و نام کاربری نمی‌توانند هر دو خالی باشند", HttpStatus.BAD_REQUEST),
    USER_DONT_ACCESS(4003, "کاربر به این منبع دسترسی ندارد", HttpStatus.FORBIDDEN),

    PAYMENT_EXCEEDS_REMAINING(5001, "مبلغ پرداختی بیش از مبلغ باقی‌مانده است", HttpStatus.BAD_REQUEST),
    PAYMENT_INCOMPLETE(5002, "پرداخت کامل نشده است", HttpStatus.BAD_REQUEST),
    DISCOUNT_PERCENT_OVER_100(5003, "مقدار تخفیف نمیتواند از 100 درصد بیشتر باشد.", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String defaultMessage;
    private final HttpStatus httpStatus;
    ErrorCode(int code, String defaultMessage, HttpStatus httpStatus) {
        this.code = code;
        this.defaultMessage = defaultMessage;
        this.httpStatus = httpStatus;
    }

}