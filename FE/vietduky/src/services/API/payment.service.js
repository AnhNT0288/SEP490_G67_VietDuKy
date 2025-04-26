import restClient from "../restClient";

export const PaymentService = {
    checkPayment: (data) => {
        return restClient({
            url: "payment/check",
            method: "POST",
            data,
        });
    },
    getAllPayment: () => {
        return restClient({
            url: "payment",
            method: "GET",
        });
    },
    getPayment: (id) => {
        return restClient({
            url: `payment/${id}`,
            method: "GET",
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