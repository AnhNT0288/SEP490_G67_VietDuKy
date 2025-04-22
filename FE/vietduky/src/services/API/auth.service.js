import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

export const AuthService = {
    login: (data) => {
        return restClient({
            url: "auth/login",
            method: "POST",
            data
        });
    },
    register: (data) => {
        return restClient({
            url: "auth/register",
            method: "POST",
            data
        });
    },
    googleLogin: (data) => {
        return restClient({
            url: "auth/google",
            method: "GET"
        });
    },
    getProfile: () => {
        return restClient({
          url: "auth/profile",
          method: "GET",
          headers: {
            Authorization: `Bearer ${StorageService.getToken()}`,
          },
        });
      },
};