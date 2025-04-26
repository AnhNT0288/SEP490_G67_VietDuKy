import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

function getAuthHeaders() {
    const token = StorageService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getAllArticles() {
    return restClient({
        url: "article",
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Lỗi khi lấy danh sách bài viết:", err.response?.data || err);
            throw err;
        });
}
export function createArticle(data) {
    return restClient({
        url: "article/create",
        method: "POST",
        data,
        headers: {
            "Content-Type": "multipart/form-data",
            ...getAuthHeaders(),
        },
    }).then((res) => res.data);
}
export function deleteArticle(id) {
    return restClient({
        url: `article/delete/${id}`,
        method: "DELETE",
        headers: {
            ...getAuthHeaders(),
        },
    }).then((res) => res.data);
}