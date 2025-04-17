import restClient from "../restClient";

export const TravelGuideService = {
    getAllTravelGuide: () => {
        return restClient({
            url: "travel-guide",
            method: "GET",
        });
    }
};