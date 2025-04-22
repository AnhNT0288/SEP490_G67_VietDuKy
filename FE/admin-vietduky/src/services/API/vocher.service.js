// services/API/voucher.service.js
import restClient from "../restClient";
import {StorageService} from "../storage/StorageService.js";

function getAuthHeaders() {
    const token = StorageService.getToken(); // Giả sử bạn có hàm này
    return token ? { Authorization: `Bearer ${token}` } : {};
}
export function createVoucher(data) {
    return restClient({
        url: "voucher/create",
        method: "POST",
        data,
        headers: {
            ...getAuthHeaders(),
            "Content-Type": "multipart/form-data",
        },
    })
        .then(response => response.data)
        .catch(error => {
            console.error("Lỗi API:", error);
            throw error;
        });
}