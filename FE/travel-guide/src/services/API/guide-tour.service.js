import restClient from "../restClient";
import { clearParams } from "../../utils";
// Lấy danh sách tour theo user id
export const getToursByUserId = async (userId) => {
  try {
    const response = await restClient({
      url: `guide-tour/user/${userId}`,
      method: "GET",
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy tour:", error);
    throw error;
  }
};

// Lấy danh sách travel tour có thể nhận
export const getTravelTourCanAccept = async (params) => {
  try {
    const response = await restClient({
      url: `travel-tour/guide`,
      method: "GET",
      params: clearParams(params),
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy tour:", error);
    throw error;
  }
};

// Lấy danh sách travel tour theo user id
export const getGuideTourByUserId = async (userId, params = {}) => {
  try {
    const response = await restClient({
      url: `guide-tour/user/${userId}`,
      method: "GET",
      params: clearParams(params),
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy tour:", error);
    throw error;
  }
};

// Lấy danh sách tour hdv có thể nhận
export const getGuideTourCanAccept = async () => {
  try {
    const response = await restClient({
      url: `tour/`,
      method: "GET",
      params: {
        status: 0,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy tour:", error);
    throw error;
  }
};

// Hủy yêu cầu tour
export const cancelGuideTour = async (tourId) => {
  try {
    const response = await restClient({
      url: `guide-tour/reject/${tourId}`,
      method: "PUT",
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi hủy yêu cầu tour:", error);
    throw error;
  }
};

// Xác nhận tour
export const approveGuideTour = async (tourId) => {
  try {
    const response = await restClient({
      url: `guide-tour/approve/${tourId}`,
      method: "PUT",
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xác nhận tour:", error);
    throw error;
  }
};

// Gửi yêu cầu tour
export const sendRequestTour = async (data) => {
  try {
    const response = await restClient({
      url: `guide-tour/create`,
      method: "POST",
      data,
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu tour:", error);
    throw error;
  }
};

export const getTravelTourDetailForGuide = async (travelTourId, guideId) => {
  try {
    const response = await restClient({
      url: `guide-tour/travel-tour/${travelTourId}`,
      method: "GET",
      params: {
        travel_guide_id: guideId,
      },
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết tour:", error);
    console.log(guideId);
    
    throw error;
  }
};

export const getServiceForGuide = async (travelTourId, guideId) => {
  try {
    const response = await restClient({
      url: `passenger/service-assigned/${travelTourId}`,
      method: "GET",
      params: {
        travel_guide_id: guideId,
      },
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết tour:", error);
    console.log(guideId);

    throw error;
  }
};

// Lấy danh sách hành khách được gán cho hướng dẫn viên
export const getPassengersByGuideId = async (guideId, travelTourId) => {
  try {
    const response = await restClient({
      url: `passenger/booking/travel-guide/${guideId}`,
      method: "GET",
      params: {
        travel_tour_id: travelTourId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách hành khách theo hướng dẫn viên:", error);
    throw error;
  }
};
// Lấy thống kê tour theo hướng dẫn viên
export const getGuideTourStatistics = async (guideId, params = {}) => {
  try {
    const response = await restClient({
      url: `guide-tour/statistics/${guideId}`,
      method: "GET",
      params: clearParams(params),
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thống kê tour:", error);
    throw error;
  }
};
