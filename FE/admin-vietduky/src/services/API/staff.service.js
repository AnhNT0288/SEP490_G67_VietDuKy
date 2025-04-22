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

export function getAssignedTravelGuidesByStaffId(staffId) {
    return restClient({
        url: `travel-guide/assigned-travel-guides/staff/${staffId}`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy danh sách hướng dẫn viên đã gán:", err.response?.data || err);
            throw err;
        });
}


// Gán danh sách location cho nhân viên
export function assignLocationsToStaff(staffId, locationIds) {
    return restClient({
        url: `user/assign-locations/${staffId}`,
        method: "POST",
        headers: {
            ...getAuthHeaders(),
        },
        data: {
            location_ids: locationIds,
        },
    })
        .then(res => res.data)
        .catch(err => {
            console.error("❌ Lỗi khi gán địa điểm cho nhân viên:", err.response?.data || err);
            throw err;
        });
}
export function getAssignedLocationsByStaffId(staffId) {
    return restClient({
        url: `user/staff/locations/${staffId}`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy địa điểm đã gán:", err.response?.data || err);
            throw err;
        });
}
export function removeLocationFromStaff(user_id, location_id) {
    return restClient({
        url: "user/delete-location-from-staff",
        method: "DELETE",
        headers: {
            ...getAuthHeaders(),
        },
        data: {
            user_id,
            location_id,
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi xoá địa điểm khỏi staff:", err.response?.data || err);
            throw err;
        });
}
export function unassignGuideFromStaff(user_id, travel_guide_ids) {
    return restClient({
        url: "travel-guide/unassign",
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
        data: {
            user_id,
            travel_guide_ids,
        },
    }).then(res => res.data);
}




