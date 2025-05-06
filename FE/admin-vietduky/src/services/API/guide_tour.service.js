import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

// Hàm để lấy header Authorization với token
function getAuthHeaders() {
    const token = StorageService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getTravelGuideByLocation(locationId) {
    return restClient({
        url: `travel-guide/location/${locationId}`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy danh sách hướng dẫn viên theo địa điểm:", err.response?.data || err);
            throw err;
        });
}
export function assignGuideToTour(data) {
    console.log("Dữ liệu gửi đến API phân công:", data);

    return restClient({
        url: `guide-tour/create`,
        method: "POST",
        headers: {
            ...getAuthHeaders(),
        },
        data,
    })
        .then((res) => {
            console.log("Phản hồi từ API phân công:", res);
            return res.data;
        })
        .catch((err) => {
            console.error("❌ Lỗi khi phân công hướng dẫn viên cho tour:", err.response?.data || err);
            throw err;
        });
}

export function assignGroupGuideToTour(data) {
    console.log("Dữ liệu gửi đến API phân công nhóm hướng dẫn viên:", data);

    return restClient({
        url: `guide-tour/assign-guides-to-tour`,
        method: "POST",
        headers: {
            ...getAuthHeaders(),
        },
        data,
    })
        .then((res) => {
            console.log("Phản hồi từ API phân công nhóm hướng dẫn viên:", res);
            return res.data;
        })
        .catch((err) => {
            console.error("❌ Lỗi khi phân công nhóm hướng dẫn viên cho tour:", err.response?.data || err);
            throw err;
        });
}

export function getGuidesByTravelTourId(travel_tour_id) {
    return restClient({
        url: `guide-tour/travel-tour/${travel_tour_id}`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then(res => res.data?.data || [])
        .catch(err => {
            console.error("❌ Lỗi khi lấy danh sách hướng dẫn viên đã gán:", err.response?.data || err);
            throw err;
        });
}

export function getAvailableGuidesByTravelTourId(travel_tour_id, staff_id) {
    return restClient({
        url: `guide-tour/available-guides/location/${travel_tour_id}?staff_id=${staff_id}`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data?.data || [])
        .catch((err) => {
            console.error("Lỗi khi gọi getAvailableGuidesByTravelTourId:", err);
            return [];
        });
}


// Lấy tất cả hướng dẫn viên
export function getAllTravelGuides() {
    return restClient({
        url: `travel-guide/`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data.data || [])
        .catch((err) => {
            console.error("❌ Lỗi khi lấy danh sách tất cả hướng dẫn viên:", err.response?.data || err);
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
        .then(res => res.data.data || [])
        .catch((err) => {
            console.error("❌ Lỗi khi lấy danh sách hướng dẫn viên của nhân viên:", err.response?.data || err);
            throw err;
        });
}
// Xóa hướng dẫn viên ra khỏi lịch trình tour
export function deleteAssignedGuide(travel_guide_id, travel_tour_id) {
    return restClient({
        url: `guide-tour/delete/${travel_guide_id}?travel_tour_id=${travel_tour_id}`,
        method: "DELETE",
        headers: {
            ...getAuthHeaders(),
        },
    }).then(res => res.data);
}
// Lấy danh sách yêu cầu phân công hướng dẫn viên chờ xử lý
export function getPendingAssignRequests() {
    return restClient({
        url: `guide-tour/pending`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy danh sách yêu cầu phân công chờ xử lý:", err.response?.data || err);
            throw err;
        });
}
export function approveGuideAssignRequest(id) {
    return restClient({
        url: `guide-tour/approve/${id}`,
        method: "PUT",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then(res => res.data)
        .catch(err => {
            console.error("❌ Lỗi khi chấp nhận yêu cầu phân công:", err.response?.data || err);
            throw err;
        });
}
export function rejectGuideAssignRequest(id) {
    return restClient({
        url: `guide-tour/reject/${id}`,
        method: "PUT",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then(res => res.data)
        .catch(err => {
            console.error("❌ Lỗi khi từ chối yêu cầu phân công:", err.response?.data || err);
            throw err;
        });
}