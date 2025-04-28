import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

function getAuthHeaders() {
    const token = StorageService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Fetch all hotels
export function getAllHotels() {
    return restClient({
        url: "hotel",
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy danh sách khách sạn:", err.response?.data || err);
            throw err;
        });
}

export function createHotel(data) {
    return restClient({
        url: "hotel/create",
        method: "POST",
        data,
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi tạo mới khách sạn:", err.response?.data || err);
            throw err;
        });
}

export function deleteHotel(hotelId) {
    return restClient({
        url: `hotel/${hotelId}`,
        method: "DELETE",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi xóa khách sạn:", err.response?.data || err);
            throw err;
        });
}

// Update a hotel
export function updateHotel(hotelId, data) {
    return restClient({
        url: `hotel/${hotelId}`,
        method: "PUT",
        data,
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi cập nhật khách sạn:", err.response?.data || err);
            throw err;
        });
}
// Lấy danh sách tất cả khách sạn của 1 tour
export function getHotelsByTravelTourId(tourId) {
    return restClient({
        url: `hotel-booking/travel-tour/${tourId}`,
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

// Lấy danh sách khách sạn theo 1 booking
export function getHotelsByBookingId(bookingId) {
    return restClient({
        url: `hotel-booking/${bookingId}`,
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
// Thêm khách sạn vào booking
export function assignHotelToBooking(bookingId, hotelId) {
    return restClient({
        url: "hotel-booking/create",
        method: "POST",
        data: {
            booking_id: bookingId,
            hotel_id: hotelId,
        },
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi gán khách sạn vào booking:", err.response?.data || err);
            throw err;
        });
}