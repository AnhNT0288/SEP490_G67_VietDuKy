import restClient from "./restClient";
// import { StorageService } from "./storage";

export function getLocations(page = 1, limit = 10) {
    return restClient({
      url: "location",
      method: "GET",
      params: { page, limit },
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