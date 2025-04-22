import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

export const PassengerService = {

    createPassenger: (data) => {
        return restClient({
            url: "passenger/create",
            method: "POST",
            data,
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