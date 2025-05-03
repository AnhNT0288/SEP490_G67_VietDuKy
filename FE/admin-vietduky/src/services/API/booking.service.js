// src/services/API/booking.service.js
import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

function getAuthHeaders() {
    const token = StorageService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getBookingsByTravelTourId(travelTourId) {
    const res = await restClient({
        url: `/booking/travel-tour/${travelTourId}`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    });
    return res.data?.data || [];
}
export const getBookingById = async (id) => {
    try {
        const response = await restClient({
            url: `booking/${id}`,
            method: "GET",
        });
        return response;
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết đặt tour:", error);
        throw error;
    }
};

export const updateBooking = async (id, data) => {
    try {
        const response = await restClient({
            url: `booking/update/${id}`,
            method: "PUT",
            data,
        });
        return response;
    } catch (error) {
        console.error("Lỗi khi cập nhật đặt tour:", error);
        throw error;
    }
};
