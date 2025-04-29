import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

// Hàm lấy token từ localStorage
function getAuthHeaders() {
    const token = StorageService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// ✅ Lấy thông tin user theo ID
export function getUserById(id) {
    return restClient({
        url: `user/${id}`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy thông tin người dùng:", err.response?.data || err);
            throw err;
        });
}
export function updateUserStatus(id) {
    return restClient({
        url: `user/status/${id}`,
        method: "PUT",
    });
}
