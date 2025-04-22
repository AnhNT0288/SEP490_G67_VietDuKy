import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

export const CustomerService = {
    getProfile: () => {
        return restClient({
            url: "customer/profile",
            method: "GET",
            headers: {
                Authorization: `Bearer ${StorageService.getToken()}`,
            },
        });
    },
    updateProfile: (data) => {
        return restClient({
            url: "customer/update-profile",
            method: "PUT",
            data,
            headers: {
                Authorization: `Bearer ${StorageService.getToken()}`,
            },
        });
    },
};