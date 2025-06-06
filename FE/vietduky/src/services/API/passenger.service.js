import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

export const PassengerService = {

    createPassenger: (data) => {
        return restClient({
            url: "passenger/create",
            method: "POST",
            headers: {
                Authorization: `Bearer ${StorageService.getToken()}`,
            },
            data,
        });
    },
    updatePassenger: (id, data) => {
        return restClient({
            url: `passenger/${id}`,
            method: "PUT",
            headers: {
                Authorization: `Bearer ${StorageService.getToken()}`,
            },
            data,
        });
    },
    deletePassenger: (id) => {
        return restClient({
            url: `passenger/${id}`,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${StorageService.getToken()}`,
            },
        });
    },
    getPassengerByBookingId: (id) => {
        return restClient({
            url: `passenger/${id}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${StorageService.getToken()}`,
            },
        });
    },

}