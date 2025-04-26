import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

function getAuthHeaders() {
    const token = StorageService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Lấy tất cả danh mục
export function getAllDirectories() {
    return restClient({
        url: "directory",
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    }).then((res) => res.data.data);
}

// Tạo mới danh mục
export function createDirectory(data) {
    return restClient({
        url: "directory/create",
        method: "POST",
        data,
        headers: {
            ...getAuthHeaders(),
        },
    }).then((res) => res.data);
}

export function deleteDirectory(id) {
    return restClient({
        url: `directory/delete/${id}`,
        method: "DELETE",
        headers: {
            ...getAuthHeaders(),
        },
    }).then((res) => res.data);
}
