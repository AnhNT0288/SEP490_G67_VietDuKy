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
        url: `restaurant-booking/booking/${bookingId}`,
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

// Lấy danh sách nhà hàng khả dụng theo tour
export function getAvailableRestaurantsByTravelTourId(tourId) {
    return restClient({
        url: `restaurant/travel-tour/${tourId}`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy nhà hàng khả dụng theo tour:", err.response?.data || err);
            throw err;
        });
}

// Gán nhà hàng vào booking
export function assignRestaurantToBooking(bookingId, restaurantId, meal, date) {
    return restClient({
        url: "restaurant-booking/create",
        method: "POST",
        data: {
            booking_id: bookingId,
            restaurant_id: restaurantId,
            meal,
            date,
        },
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi gán nhà hàng vào booking:", err.response?.data || err);
            throw err;
        });
}

// Hủy gán nhà hàng khỏi booking
export function cancelAssignRestaurant(restaurantBookingId) {
    return restClient({
        url: `restaurant-booking/cancel/${restaurantBookingId}`,
        method: "DELETE",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi hủy gán nhà hàng:", err.response?.data || err);
            throw err;
        });
}
