import restClient from "../restClient";
// import { StorageService } from "./storage";

export function getService() {
    return restClient({
        url: "service",
        method: "GET"
    })
        .then(response => {
            //   console.log("Dữ liệu API trả về:", response.data); 
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