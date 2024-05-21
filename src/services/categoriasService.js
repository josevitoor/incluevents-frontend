import axios from "axios";
import { showNotification } from "../utils/utils";

const baseURL = "http://localhost:8080";

const api = axios.create({
  baseURL,
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const categoriasService = {
  async loadCategorias() {
    try {
      const response = await api.get("/categorias");
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao buscar categorias");
    }
  },
};

export default categoriasService;
