import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

function getAuthHeaders() {
    const token = StorageService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Lấy danh sách tất cả phương tiện
export function getAllVehicles() {
    return restClient({
        url: "vehicle",
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy danh sách phương tiện:", err.response?.data || err);
            throw err;
        });
}

// Tạo mới phương tiện
export function createVehicle(data) {
    return restClient({
        url: "vehicle/",
        method: "POST",
        data,
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi tạo mới phương tiện:", err.response?.data || err);
            throw err;
        });
}

// Cập nhật phương tiện
export function updateVehicle(vehicleId, data) {
    return restClient({
        url: `vehicle/${vehicleId}`,
        method: "PUT",
        data,
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi cập nhật phương tiện:", err.response?.data || err);
            throw err;
        });
}

// Xóa phương tiện
export function deleteVehicle(vehicleId) {
    return restClient({
        url: `vehicle/${vehicleId}`,
        method: "DELETE",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi xóa phương tiện:", err.response?.data || err);
            throw err;
        });
}

// Lấy chi tiết phương tiện theo ID
export function getVehicleById(vehicleId) {
    return restClient({
        url: `vehicle/${vehicleId}`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy chi tiết phương tiện:", err.response?.data || err);
            throw err;
        });
}

// Gán xe vào booking
export function assignVehicleToBooking(data) {
    return restClient({
        url: "vehicle-booking/create",
        method: "POST",
        data,
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi gán xe cho booking:", err.response?.data || err);
            throw err;
        });
}

// Lấy xe theo bookingId
export function getVehiclesByBookingId(bookingId) {
    return restClient({
        url: `vehicle-booking/${bookingId}`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy xe theo booking:", err.response?.data || err);
            throw err;
        });
}

// (Tuỳ chọn) Lấy xe theo tourId nếu API có
export function getVehiclesByTravelTourId(tourId) {
    return restClient({
        url: `vehicle/travel-tour/${tourId}`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy xe theo tour:", err.response?.data || err);
            throw err;
        });
}

// Lấy xe đã gán cho toàn bộ tour
export function getVehiclesByTravelTourIdFromBooking(tourId) {
    return restClient({
        url: `vehicle-booking/travel-tour/${tourId}`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy xe theo tour (gán booking):", err.response?.data || err);
            throw err;
        });
}

export function cancelAssignVehicle(vehicleBookingId) {
    return restClient({
        url: `vehicle-booking/cancel/${vehicleBookingId}`,
        method: "DELETE",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi hủy gán xe:", err.response?.data || err);
            throw err;
        });
}
