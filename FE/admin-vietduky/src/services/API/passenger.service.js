// passenger.service.js
import restClient from "../restClient";

// Lấy danh sách hành khách theo tour ID (grouped theo booking)
export function getPassengersByTravelTourId(tourId) {
    return restClient({
        url: `passenger/travel-tour/${tourId}?assigned=true`,
        method: "GET",
        params: {
            assigned: true,
        }
    })
        .then((response) => response.data.data)
        .catch((error) => {
            console.error("Lỗi khi lấy danh sách hành khách:", error);
            throw error;
        });
}
export async function assignPassengersToGuide(guideId, travelTourId, passengerIds) {
    try {
        const res = await restClient({
            url: `passenger/assign/${guideId}`,
            method: "POST",
            data: {
                travel_tour_id: travelTourId,
                passenger_ids: passengerIds,
            },
        });
        return res.data;
    } catch (err) {
        console.error("Lỗi khi gán khách hàng:", err);
        throw err;
    }
}


// Gán tự động hành khách cho hướng dẫn viên
export function autoAssignPassengersToGuides(travelTourId, numberPassenger) {
    return restClient({
        url: "guide-tour/assign-passenger-auto",
        method: "POST",
        data: {
            travel_tour_id: travelTourId,
            number_passenger: numberPassenger,
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Lỗi khi phân công tự động hành khách:", err);
            throw err;
        });
}

// Lấy danh sách hành khách đã gán theo hướng dẫn viên và tour
export function getPassengersByTravelGuideId(travelGuideId, travelTourId) {
    return restClient({
        url: `passenger/travel-guide/${travelGuideId}`,
        method: "GET",
        params: {
            travel_tour_id: travelTourId,
        },
    })
        .then((response) => response.data.data)
        .catch((error) => {
            console.error("Lỗi khi lấy danh sách khách hàng theo hướng dẫn viên:", error);
            throw error;
        });
}
// Xóa hành khách khỏi nhóm gán theo ID hành khách
export async function removePassengerFromGroup(passengerId) {
    try {
        const res = await restClient({
            url: `passenger/remove-passenger-group/${passengerId}`,
            method: "DELETE",
        });
        return res.data;
    } catch (err) {
        console.error("Lỗi khi xóa khách hàng khỏi nhóm:", err);
        throw err;
    }
}

