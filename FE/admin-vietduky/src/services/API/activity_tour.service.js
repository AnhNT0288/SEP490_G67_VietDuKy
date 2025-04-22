import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

function getAuthHeaders() {
    const token = StorageService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export function createTourActivity(formData) {
    return restClient({
        url: "tour-activities/create",
        method: "POST",
        data: formData,
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi tạo hoạt động tour:", err.response?.data || err);
            throw err;
        });
}

export function getActivitiesByTourId(tourId) {
    return restClient({
        url: `tour/${tourId}/activities`,
        method: "GET",
    })
        .then((res) => res.data.data.activities)
        .catch((err) => {
            console.error("Lỗi khi lấy activity:", err);
            throw err;
        });
}
export function deleteTourActivity(id) {
    return restClient({
        url: `tour-activities/delete/${id}`,
        method: "DELETE",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi xoá hoạt động tour:", err.response?.data || err);
            throw err;
        });
}
