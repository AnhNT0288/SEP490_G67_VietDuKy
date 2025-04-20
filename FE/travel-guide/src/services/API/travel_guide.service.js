import restClient from "../restClient";

export const TravelGuideService = {
    getAllTravelGuide: () => {
        return restClient({
            url: "travel-guide",
            method: "GET",
        });
    },
    getTravelGuideByUserId: (userId) => {
        return restClient({
            url: `travel-guide/user/${userId}`,
            method: "GET",
        });
    },
    updateInfoTravelGuide: (travelGuideId, data) => {
        return restClient({
            url: `travel-guide/update-personal-info/${travelGuideId}`,
            method: "PUT",
            data,
        });
    },
};