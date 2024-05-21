import axios from "axios";
import { showNotification } from "../utils/utils";

const baseURL = "http://localhost:8080";

const api = axios.create({
  baseURL,
  timeout: 5000,
});

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
