import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

export const UserService = {
    sendAdviceRequest: (data) => {
        return restClient({
            url: "user/contact-advice",
            method: "POST",
            data: data,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${StorageService.getToken()}`,
            },
        })
    }
};