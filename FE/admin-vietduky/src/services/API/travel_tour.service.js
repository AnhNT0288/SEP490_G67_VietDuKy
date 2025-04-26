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
  console.log("Dữ liệu gửi API:", data); // 👉 Thêm log tại đây

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
      console.log("Chi tiết lỗi:", error.response?.data); // 👉 Log chi tiết lỗi trả về từ backend

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
export function closeTravelTour(id) {
  return restClient({
    url: `travel-tour/close/${id}`,
    method: "POST",
  })
      .then(response => {
        console.log("✅ Đóng lịch khởi hành thành công:", response.data);
        return response.data;
      })
      .catch(error => {
        console.error("❌ Lỗi khi đóng lịch khởi hành:", error.response?.data || error);
        throw error;
      });
}

export function getTravelToursByStaffId(staffId) {
  return restClient({
    url: `user/travel-tours/${staffId}`,
    method: "GET",
  })
      .then((response) => {
        console.log("📥 API trả về:", response.data);
        return response.data;
      })
      .catch((error) => {
        console.error("Lỗi API:", error.response?.data || error);
        throw error;
      });
}

// Lấy danh sách Travel Tours theo nhân viên và điểm đến
export async function getTravelToursByStaffAndEndLocation(staffId, endLocationId) {
    try {
        const response = await restClient({
            url: `travel-tour/by-staff-end-location/${staffId}`,
            method: "GET",
            headers: {
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách Travel Tours:", error.response?.data || error);
        throw error;
    }
}

// Lấy danh sách Guide và Passenger theo travel tour ID
export function getGuidesAndPassengersByTravelTourId(travelTourId) {
    return restClient({
        url: `guide-tour/passenger-guide/${travelTourId}`,
        method: "GET",
    })
        .then((res) => res.data.data)
        .catch((err) => {
            console.error("Lỗi khi lấy guide/passenger theo tour:", err);
            throw err;
        });
}



