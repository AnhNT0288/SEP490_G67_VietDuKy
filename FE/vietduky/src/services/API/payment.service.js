import restClient from "../restClient";

export const PaymentService = {
    checkPayment: (data) => {
        return restClient({
            url: "payment/check",
            method: "POST",
            data,
        });
    },
    getPayment: (id) => {
        return restClient({
            url: `payment/${id}`,
            method: "GET",
        });
    },
};