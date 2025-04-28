import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

function getAuthHeaders() {
    const token = StorageService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getAllRestaurants() {
    return restClient({
        url: "restaurant",
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy danh sách nhà hàng:", err.response?.data || err);
            throw err;
        });
}

export function getRestaurantById(restaurantId) {
    return restClient({
        url: `restaurant/${restaurantId}`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy thông tin nhà hàng:", err.response?.data || err);
            throw err;
        });
}

export function createRestaurant(data) {
    return restClient({
        url: "restaurant/create",
        method: "POST",
        data,
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi tạo mới nhà hàng:", err.response?.data || err);
            throw err;
        });
}

export function deleteRestaurant(restaurantId) {
    return restClient({
        url: `restaurant/${restaurantId}`,
        method: "DELETE",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi xóa nhà hàng:", err.response?.data || err);
            throw err;
        });
}

export function updateRestaurant(restaurantId, data) {
    return restClient({
        url: `restaurant/${restaurantId}`,
        method: "PUT",
        data,
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi cập nhật nhà hàng:", err.response?.data || err);
            throw err;
        });
}

export function getRestaurantsByTravelTourId(tourId) {
    return restClient({
        url: `restaurant-booking/travel-tour/${tourId}`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy khách sạn theo tour:", err.response?.data || err);
            throw err;
        });
}

export function getRestaurantsByBookingId(bookingId) {
    return restClient({
        url: `restaurant-booking/${bookingId}`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy khách sạn theo booking:", err.response?.data || err);
            throw err;
        });
}
