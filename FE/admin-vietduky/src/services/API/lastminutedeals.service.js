import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

function getAuthHeaders() {
    const token = StorageService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getUnapprovedDiscountServices() {
    return restClient({
        url: "discount-service/get-not-approve-discount-service",
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy danh sách dịch vụ giảm giá:", err.response?.data || err);
            throw err;
        });
}
export function approveDiscountService(data) {
    return restClient({
        url: "discount-service/approve-discount-service",
        method: "POST",
        data,
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi cập nhật giảm giá:", err.response?.data || err);
            throw err;
        });
}
