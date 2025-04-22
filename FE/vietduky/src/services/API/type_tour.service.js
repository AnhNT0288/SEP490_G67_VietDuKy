import restClient from "../restClient";

export const TypeTourService = {
    getTypeTour: () => {
        return restClient({
            url: "type-tour",
            method: "GET",
        });
    },
    getTypeTourById: (id) => {
        return restClient({
            url: `type-tour/${id}`,
            method: "GET",
        });
    },
};