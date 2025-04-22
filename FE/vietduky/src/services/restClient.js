import axios from "axios";
import { StorageService } from "./storage/StorageService";

const BASE_URL = "http://localhost:3000/api";

export default function restClient(options) {
  const { url, method = "GET", params, data, headers = {} } = options;

  const token = StorageService.getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`; // Thêm token vào header
  }

  return axios({
    url: `${BASE_URL}/${url}`,
    method,
    params,
    data,
    headers,
  })
    .catch((err) => {
      if (StorageService.isExpired()) {
        StorageService.signout();
      }
      return Promise.reject(err);
    });
}
