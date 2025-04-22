import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

export const ServiceService = {
    getServices: () => {
        return restClient({
        url: "service",
        method: "GET",
        });
    },
    getService: (id) => {
        return restClient({
        url: `service/${id}`,
        method: "GET",
        });
    },
    createService: (data) => {
        return restClient({
        url: "service/create",
        method: "POST",
        data,
        headers: {
            // Authorization: `Bearer ${StorageService.getToken()}`,
            "Content-Type": "application/json",
        },
        });
    },
    updateService: (data) => {
        return restClient({
        url: "service",
        method: "PUT",
        data,
        headers: {
            // Authorization: `Bearer ${StorageService.getToken()}`,
        },
        });
    },
    deleteService: (id) => {
        return restClient({
        url: `service/${id}`,
        method: "DELETE",
        headers: {
            // Authorization: `Bearer ${StorageService.getToken()}`,
        },
        });
    },
    };