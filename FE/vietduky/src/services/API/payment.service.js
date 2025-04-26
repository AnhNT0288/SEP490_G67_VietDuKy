import restClient from "../restClient";

export const PaymentService = {
    checkPayment: (data) => {
        return restClient({
            url: "payment/check",
            method: "POST",
            data,
        });
    },
    getPaymentByBookingId: (bookingId) => {
        return restClient({
            url: `payment/booking/${bookingId}`,
            method: "GET",
        });
    },
    getPaymentById: (id) => {
        return restClient({
            url: `payment/${id}`,
            method: "GET",
        });
    },
    getPaymentByCustomerId: (id) => {
        return restClient({
            url: `payment/customer/${id}`,
            method: "GET",
        });
    }
};