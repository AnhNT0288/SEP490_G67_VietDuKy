import restClient from "../restClient";

export function getTravelTour(page = 1, limit = 10) {
  return restClient({
    url: "travel-tour",
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

export function getTravelTourByTourId(tour_id) {
  return restClient({
    url: `travel-tour/tour/${tour_id}`,
    method: "GET",
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

export function createTravelTour(data) {
  return restClient({
    url: "travel-tour/create",
    method: "POST",
    data,
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

export function deleteTravelTour(id) {
  return restClient({
    url: `travel-tour/delete/${id}`,
    method: "DELETE",
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