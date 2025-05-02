import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

function getAuthHeaders() {
    const token = StorageService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Fetch all user accounts
export function getAllAccounts() {
    return restClient({
        url: "user",
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Lỗi khi lấy danh sách tài khoản:", err.response?.data || err);
            throw err;
        });
}
export function getStaffById(staffId) {
    return restClient({
        url: `user/${staffId}`,
        method: "GET",
        headers: {
            ...getAuthHeaders(),
        },
    }).then(res => res.data.data);
}


// Create a new user account
export function createAccount(data) {
    return restClient({
        url: "user/create",
        method: "POST",
        data,
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    }).then((res) => res.data);
}

// Update an existing user account
export function updateAccount(accountId, data) {
    return restClient({
        url: `user/${accountId}`,
        method: "PUT",
        data,
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    }).then((res) => res.data);
}

// Delete a user account
export function deleteAccount(accountId) {
    return restClient({
        url: `user/${accountId}`,
        method: "DELETE",
        headers: {
            ...getAuthHeaders(),
        },
    }).then((res) => res.data);
}
export function updateTravelGuide(userId, data) {
    return restClient({
        url: `travel-guide/update/${userId}`,
        method: "PUT",
        data,
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    })
        .then((res) => res.data)
        .catch((err) => {
            console.error("❌ Error updating travel guide:", err.response?.data || err);
            throw err;
        });
}
