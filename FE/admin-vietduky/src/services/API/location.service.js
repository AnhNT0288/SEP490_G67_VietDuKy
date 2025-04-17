import restClient from "../restClient";
// import { StorageService } from "./storage";

export function getLocations(page = 1, limit = 100) {
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

export function createLocation(data) {
    return restClient({
      url: "location/create",
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

export function updateLocation(id, data) {
    return restClient({
        url: `location/update/${id}`,
        method: "PUT",
        data,
        headers: {
            "Content-Type": "multipart/form-data", // để server xử lý file và form
        },
    })
        .then(response => response.data)
        .catch(error => {
            console.error("Lỗi API:", error);
            throw error;
        });
}

export function deleteLocation(id) {
  return restClient({
    url: `location/delete/${id}`,
    method: "DELETE",
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