import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

function getAuthHeaders() {
    const token = StorageService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Lấy feedback theo hướng dẫn viên
export function getFeedbacksByGuideId(guideId) {
    return restClient({
        url: `feedback/travel-guide/${guideId}`,
        method: "GET",
        headers: getAuthHeaders(),
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy danh sách feedback:", err.response?.data || err);
            return { data: [] };
        });
}