import restClient from "../restClient";

// Lấy danh sách ghi chú (notes) theo tour_id
export function getTourNotes(tourId) {
    return restClient({
        url: `tour-info/get/${tourId}`,
        method: "GET",
    })
        .then((response) => response.data.data)
        .catch((error) => {
            console.error("Lỗi khi lấy thông tin lưu ý:", error);
            throw error;
        });
}

// Tạo mới ghi chú (note) cho tour
export function createTourNote(data) {
    return restClient({
        url: "tour-info/create",
        method: "POST",
        data,
    })
        .then((response) => response.data)
        .catch((error) => {
            console.error("Lỗi khi tạo thông tin lưu ý:", error);
            throw error;
        });
}

// Cập nhật thông tin lưu ý (nếu cần sau này)
export function updateTourNote(id, data) {
    return restClient({
        url: `tour-info/${id}`,
        method: "PUT",
        data,
    })
        .then((response) => response.data)
        .catch((error) => {
            console.error("Lỗi khi cập nhật thông tin lưu ý:", error);
            throw error;
        });
}

// Xóa thông tin lưu ý
export function deleteTourNote(id) {
    return restClient({
        url: `tour-info/${id}`,
        method: "DELETE",
    })
        .then((response) => response.data)
        .catch((error) => {
            console.error("Lỗi khi xóa thông tin lưu ý:", error);
            throw error;
        });
}
