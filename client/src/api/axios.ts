import axios from "axios";
import type { AxiosInstance } from 'axios'

export const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const isAlreadyOnLogin = window.location.pathname === "/login";
      
      if (!isAlreadyOnLogin) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);