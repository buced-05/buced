import axios from "axios";
import useUserStore from "../store/useUserStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api/v1/"
});

api.interceptors.request.use((config) => {
  const { token } = useUserStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

