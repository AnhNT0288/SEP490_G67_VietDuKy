import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

export const TourService = {
    getTours: () => {
        return restClient({
            url: "tour",
            method: "GET",
        });
    },
    getTour: (id) => {
        return restClient({
            url: `tour/${id}`,
            method: "GET",
        });
    },
    createTour: (data) => {
        return restClient({
            url: "tour/create",
            method: "POST",
            data,
            headers: {
                Authorization: `Bearer ${StorageService.getToken()}`,
                "Content-Type": "application/json",
            },
        });
    },
    updateTour: (data) => {
        return restClient({
            url: "tour",
            method: "PUT",
            data,
            headers: {
                Authorization: `Bearer ${StorageService.getToken()}`,
            },
        });
    },
    deleteTour: (id) => {
        return restClient({
            url: `tour/${id}`,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${StorageService.getToken()}`,
            },
        });
    },
    getTourByLocationId: (locationId) => {
        return restClient({
            url: `tour/get-by-location-id/${locationId}`,
            method: "GET",
        });
    },
    getTourByTopicId: (topicId) => {
        return restClient({
            url: `tour/get-by-topic-id/${topicId}`,
            method: "GET",
        });
    },
    searchTour: (params) => {
        return restClient({
          url: "tour/search",
          method: "GET",
          params: {
            start: params.departure,
            end: params.destination,
            date: params.date,
            priceRange: params.priceRange,
            typeId: params.tourType,
            topicId: params.tourTheme,
          },
        });
      }
};