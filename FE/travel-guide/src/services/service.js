// services.js
import { getService } from "./API/service.service.js";
import { getLocations } from "./API/location.service.js";
import { getTravelTour } from "./API/travel_tour.service.js";
import { getTours } from "./API/tour.service.js";
import { getTypeTours } from "./API/type_tour.service";

export const fetchLocations = async () => {
  try {
    const data = await getLocations();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ API", error);
    return [];
  }
};

export const fetchServices = async () => {
  try {
    const response = await getService();
    return Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ API", error);
    return [];
  }
};

export const fetchTravelTours = async () => {
  try {
    const response = await getTravelTour();
    return Array.isArray(response?.travelTours) ? response.travelTours : [];
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ API", error);
    return [];
  }
};

export const fetchTours = async () => {
  try {
    const response = await getTours();
    return Array.isArray(response?.data) ? response.data : [];
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ API", error);
    return [];
  }
};

export const fetchTypeTours = async () => {
  try {
    const response = await getTypeTours();
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ API", error);
    return [];
  }
}
