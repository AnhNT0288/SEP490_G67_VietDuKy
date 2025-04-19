// services/API/staff.service.js

import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

// Hàm lấy token và gắn vào header Authorization
function getAuthHeaders() {
    const token = StorageService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Lấy danh sách nhân viên (staff)
export async function getStaffList() {
    try {
        const response = await restClient({
            url: "user/role/2",
            method: "GET",
            headers: {
                ...getAuthHeaders(),
            },
        });
        return response.data.data; // Trả về danh sách staff
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách staff:", error.response?.data || error);
        throw error;
    }
}
export function assignTravelGuidesToStaff({ user_id, travel_guide_ids }) {
    return restClient({
        url: `travel-guide/assign`,
        method: "POST",
        headers: {
            ...getAuthHeaders(),
        },
        data: {
            user_id,
            travel_guide_ids
        }
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi gán hướng dẫn viên:", err.response?.data || err);
            throw err;
        });
}
export function getTravelGuidesByStaffId(staffId) {
    return restClient({
        url: `travel-guide/staff/${staffId}`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then(res => res.data.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy danh sách hướng dẫn viên của nhân viên:", err.response?.data || err);
            throw err;
        });
}
