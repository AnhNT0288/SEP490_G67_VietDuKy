import restClient from "../restClient";

export const getBookingById = async (id) => {
  try {
    const response = await restClient({
      url: `booking/${id}`,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đặt tour:", error);
    throw error;
  }
};

export const updateBooking = async (id, data) => {
  try {
    const response = await restClient({
      url: `booking/update/${id}`,
      method: "PUT",
      data,
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật đặt tour:", error);
    throw error;
  }
};
