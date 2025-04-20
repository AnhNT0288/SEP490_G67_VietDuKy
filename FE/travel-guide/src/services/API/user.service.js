import restClient from "../restClient";
import { StorageService } from "../storage/StorageService";

export function getUser(userId) {
    return restClient({
      url: `user/${userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${StorageService.getToken()}`,
      },
    });
  }