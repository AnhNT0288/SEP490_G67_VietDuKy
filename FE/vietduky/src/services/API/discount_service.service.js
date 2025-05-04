import restClient from "../restClient";


export const DiscountService = {
    getDiscounts: async () => {
        return restClient({
            url: "discount-service",
            method: "GET",
        })
    },
    getApproveDiscounts: async () => {
        return restClient({
            url: `discount-service/get-approve-discount-service`,
            method: "GET",
        })
    },
};