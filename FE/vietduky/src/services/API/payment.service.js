import restClient from "../restClient";

export const PaymentService = {
    checkPayment: (data) => {
        return restClient({
            url: "payment/check",
            method: "POST",
            data,
        });
    },
    getPaymentByBookingId: (id) => {
        return restClient({
            url: `payment/booking/${id}`,
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