// services.js
import { getService } from "./API/service.service";
import { getLocations, createLocation } from "./API/location.service";
import { getTravelTour } from "./API/travel_tour.service";
import { getTours, createTour } from "./API/tour.service";
import { getTypeTours } from "./API/type_tour.service";
import { use } from "react";

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
