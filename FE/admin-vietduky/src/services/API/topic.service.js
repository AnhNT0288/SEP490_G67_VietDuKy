import restClient from "../restClient";

export function getTopics(page = 1, limit = 100) {
    return restClient({
        url: "topic",
        method: "GET",
        params: { page, limit },
    })
        .then((response) => {
            return response.data.data;
        })
        .catch((error) => {
            console.error("Lỗi khi lấy danh sách chủ đề:", error);
            throw error;
        });
}


export function createTopic(data) {
    return restClient({
        url: "topic/create",
        method: "POST",
        data,
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error("Lỗi khi tạo chủ đề:", error);
            throw error;
        });
}

export function updateTopic(id, data) {
    return restClient({
        url: `topic/${id}`,
        method: "PUT",
        data,
    })
        .then((response) => response.data)
        .catch((error) => {
            console.error("Lỗi khi cập nhật chủ đề:", error);
            throw error;
        });
}


export function deleteTopic(id) {
    return restClient({
        url: `topic/${id}`,
        method: "DELETE",
    })
        .then((response) => response.data)
        .catch((error) => {
            console.error("Lỗi khi xóa chủ đề:", error);
            throw error;
        });
}
export function getAllTours() {
    return restClient({
        url: "tour",
        method: "GET",
    }).then((res) => res.data.data);
}
export function getAllLocations() {
    return restClient({
        url: "location",
        method: "GET",
    }).then((res) => res.data.data);
}
export function addTourToTopic(data) {
    return restClient({
        url: "topic/add-tour",
        method: "POST",
        data,
    }).then((res) => res.data);
}

