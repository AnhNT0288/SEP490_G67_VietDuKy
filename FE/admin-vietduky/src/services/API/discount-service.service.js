import restClient from "../restClient";

export const DiscountService = {
    getAllDiscountServices: () => {
        return restClient({
            url: "/discount-service",
            method: "GET",
        })
    }
};