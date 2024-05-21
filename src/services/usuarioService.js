import axios from "axios";
import { showNotification } from "../utils/utils";

const baseURL = "http://localhost:8080";

const api = axios.create({
  baseURL,
  timeout: 5000,
});

const usuarioService = {
  async login(credentials) {
    try {
      const response = await api.post("/auth/login", credentials);
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
      const response = await api.post("/usuarios", userData);
      return response.data;
    } catch (error) {
      showNotification(
        "error",
        "Erro ao criar usuário. Verifique os dados fornecidos."
      );
      throw error;
    }
  },
};

export default usuarioService;
