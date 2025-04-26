import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

export const BookingService = {
    getBooking: () => {
        return restClient({
            url: "booking",
            method: "GET",
            headers: {
                Authorization: `Bearer ${StorageService.getToken()}`,
            },
        });
    },
    getBookingById: (id) => {
        return restClient({
            url: `booking/${id}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${StorageService.getToken()}`,
            },
        });
    },
    createBooking: (data) => {
        return restClient({
          url: "booking/create",
          method: "POST",
          data,
          headers: {
            Authorization: `Bearer ${StorageService.getToken()}`,
            "Content-Type": "application/json",
          },
        });
      },
      
    updateBooking: (id, data) => {
        return restClient({
            url: `booking/update/${id}`,
            method: "PUT",
            data,
            headers: {
                Authorization: `Bearer ${StorageService.getToken()}`,
            },
        });
    },
    deleteBooking: (id) => {
        return restClient({
            url: `booking/${id}`,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${StorageService.getToken()}`,
            },
        });
    },
    getBookingByUserId: (id) => {
        return restClient({
            url: `booking/user/${id}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${StorageService.getToken()}`,
            },
        });
    }

};