import restClient from "../restClient";
// import { StorageService } from "./storage";

export function getService() {
    return restClient({
        url: "service",
        method: "GET"
    })
        .then(response => {
              console.log("Dữ liệu API trả về:", response.data);
            return response.data;
        })
        .catch(error => {
            console.error("Lỗi API:", error);
            throw error;
        });
}
export function createService(data) {
    return restClient({
        url: "service/create",
        method: "POST",
        data,
    })
        .then(response => {
            // console.log("Dữ liệu API trả về:", response.data);
            return response.data;
        })
        .catch(error => {
            console.error("Lỗi API:", error);
            throw error;
        });
}

// Lấy chi tiết 1 dịch vụ theo ID
export function getServiceById(id) {
    return restClient({
        url: `service/${id}`,  // ✅ đúng API rồi nè
        method: "GET",
    })
        .then(response => response.data.data)  // bạn lấy response.data.data vì cấu trúc API trả về vậy
        .catch(error => {
            console.error("Lỗi API lấy chi tiết dịch vụ:", error);
            throw error;
        });
}


// Cập nhật dịch vụ
export function updateService(id, data) {
    return restClient({
        url: `service/update/${id}`,  // cập nhật theo ID
        method: "PUT",
        data,
    })
        .then(response => {
            console.log("Dữ liệu sau cập nhật:", response.data);
            return response.data;
        })
        .catch(error => {
            console.error("Lỗi API cập nhật dịch vụ:", error);
            throw error;
        });
}
export function deleteService(id) {
    return restClient({
        url: `service/delete/${id}`,  // ✅ Đúng API bạn đã cho
        method: "DELETE",
    })
        .then(response => {
            console.log("Xóa dịch vụ thành công:", response.data);
            return response.data;
        })
        .catch(error => {
            console.error("Lỗi khi xóa dịch vụ:", error);
            throw error;
        });
}
