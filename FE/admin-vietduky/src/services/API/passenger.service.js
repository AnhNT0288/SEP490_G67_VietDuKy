// passenger.service.js
import restClient from "../restClient";

// Lấy danh sách hành khách theo tour ID (grouped theo booking)
export function getPassengersByTravelTourId(tourId) {
    return restClient({
        url: `passenger/travel-tour/${tourId}`,
        method: "GET",
    })
        .then((response) => response.data.data)
        .catch((error) => {
            console.error("Lỗi khi lấy danh sách hành khách:", error);
            throw error;
        });
}
export function assignPassengersToGuide(guideId, passengerIds) {
    return restClient({
        url: `passenger/assign/${guideId}`,
        method: "POST",
        data: {
            passenger_ids: passengerIds,
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Lỗi khi gán khách hàng:", err);
            throw err;
        });
}