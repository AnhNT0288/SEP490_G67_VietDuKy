import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

export const TravelTourService = {
  getTravelTours: () => {
    return restClient({
      url: "travel-tour",
      method: "GET",
    });
  },
  getTravelTour: (id) => {
    return restClient({
      url: `travel-tour/${id}`,
      method: "GET",
    });
  },
  getTravelTourByTourId: (tourId) => {
    return restClient({
      url: `travel-tour/tour/${tourId}`,
      method: "GET",
    });
  },
  createTravelTour: (data) => {
    return restClient({
      url: "travel-tour/create",
      method: "POST",
      data,
      headers: {
        // Authorization: `Bearer ${StorageService.getToken()}`,
        "Content-Type": "application/json",
      },
    });
  },
  updateTravelTour: (data) => {
    return restClient({
      url: "travel-tour",
      method: "PUT",
      data,
      headers: {
        // Authorization: `Bearer ${StorageService.getToken()}`,
      },
    });
  },
  deleteTravelTour: (id) => {
    return restClient({
      url: `travel-tour/${id}`,
      method: "DELETE",
      headers: {
        // Authorization: `Bearer ${StorageService.getToken()}`,
      },
    });
  },
};