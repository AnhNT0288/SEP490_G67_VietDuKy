import axios from "axios";
import { StorageService } from "./storage/StorageService";

const BASE_URL = "http://localhost:3000/api";

export default function restClient(options) {
  const { url, method = "GET", params, data, headers = {} } = options;

  const token = StorageService.getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Nếu là FormData thì để axios tự set content-type
  const isFormData = data instanceof FormData;
  if (isFormData) {
    delete headers["Content-Type"]; // Xoá nếu có
  }

  return axios({
    url: `${BASE_URL}/${url}`,
    method,
    params,
    data,
    headers,
  }).catch((err) => {
    if (StorageService.isExpired()) {
      StorageService.signout();
    }
    if (err.response) {
      console.error("❌ RESTClient Error:", err.response);
    } else {
      console.error("❌ Axios unknown error:", err.message);
    }

    return Promise.reject(err);
  });
}
