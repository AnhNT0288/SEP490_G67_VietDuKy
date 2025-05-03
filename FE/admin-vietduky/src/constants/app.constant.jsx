export const STATUS_PENDING_TOUR = {
    PENDING: 0,
    ACCEPTED: 1,
    REJECTED: 2,
};

//0: Not Paid, 1: Half Paid, 2: Paid, 3: Canceled, 4: Refunded, 5: Completed, 6: Expired
export const STATUS_BOOKING = {
    NOT_PAID: 0,
    HALF_PAID: 1,
    PAID: 2,
    CANCELED: 3,
    REFUNDED: 4,
    COMPLETED: 5,
    EXPIRED: 6,
};

export const STATUS_BOOKING_TEXT = {
    [STATUS_BOOKING.NOT_PAID]: "Chưa thanh toán",
    [STATUS_BOOKING.HALF_PAID]: "Đã thanh toán 1/2",
    [STATUS_BOOKING.PAID]: "Đã thanh toán",
    [STATUS_BOOKING.CANCELED]: "Đã hủy",
    [STATUS_BOOKING.REFUNDED]: "Đã hoàn tiền",
    [STATUS_BOOKING.COMPLETED]: "Đã hoàn tất",
    [STATUS_BOOKING.EXPIRED]: "Đã hết hạn",
};

export const STATUS_BOOKING_COLOR = {
    [STATUS_BOOKING.NOT_PAID]: "text-yellow-600",
    [STATUS_BOOKING.HALF_PAID]: "text-yellow-600",
    [STATUS_BOOKING.PAID]: "text-green-600",
    [STATUS_BOOKING.CANCELED]: "text-red-600",
    [STATUS_BOOKING.REFUNDED]: "text-blue-600",
    [STATUS_BOOKING.COMPLETED]: "text-green-600",
    [STATUS_BOOKING.EXPIRED]: "text-red-600",
};

