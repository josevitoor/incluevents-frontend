import axios from "axios";
import { showNotification } from "../utils/utils";

const baseURL = "http://localhost:8080";

const openApi = axios.create({
  baseURL,
  timeout: 5000,
});

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

const usuarioService = {
  async login(credentials) {
    try {
      const response = await openApi.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      showNotification(
        "error",
        "Erro ao fazer login. Verifique suas credenciais."
      );
      throw error;
    }
  },

  async createUser(userData) {
    try {
      const response = await openApi.post("/usuarios", userData);
      return response.data;
    } catch (error) {
      showNotification(
        "error",
        "Erro ao criar usuário. Verifique os dados fornecidos."
      );
      throw error;
    }
  },

  async getLoggedUser() {
    const response = await api.get("/usuarios/me");

    return response.data;
  },
};

export default usuarioService;
