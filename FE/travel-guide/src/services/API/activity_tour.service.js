// src/services/API/activity_tour.service.js
import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

function getAuthHeaders() {
    const token = StorageService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Gửi 1 hoạt động tour
export function createTourActivity(formData) {
    return restClient({
        url: "tour-activities/create",
        method: "POST",
        data: formData,
        headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi tạo hoạt động tour:", err.response?.data || err);
            throw err;
        });
}
