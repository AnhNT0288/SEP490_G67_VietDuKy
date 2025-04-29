import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

function getAuthHeaders() {
    const token = StorageService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getDashboardData() {
    return restClient({
        url: "statistic/dashboard",
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        }
    })
        .then(response => {
            console.log("Dữ liệu dashboard:", response.data);
            return response.data.data;
        })
        .catch(error => {
            console.error("Lỗi API dashboard:", error);
            throw error;
        });
}