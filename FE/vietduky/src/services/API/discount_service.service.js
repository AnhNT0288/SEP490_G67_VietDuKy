import restClient from "../restClient";


export const DiscountService = {
    getDiscounts: async () => {
        return restClient({
            url: "discount-service",
            method: "GET",
        })
    },
};