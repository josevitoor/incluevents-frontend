import axios from "axios";
import { showNotification } from "../utils/utils";

const baseURL = "http://localhost:8080";

const api = axios.create({
  baseURL,
  timeout: 5000,
});

const seloService = {
  async loadSelos() {
    try {
      const response = await api.get("/selos");
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao buscar selos");
    }
  },

  async createSelo(selo) {
    try {
      const response = await api.post("/selos", selo);
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao criar selo");
    }
  },

  async findSeloById(id) {
    try {
      const response = await api.get(`/selos/${id}`);
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao buscar selo por ID");
    }
  },

  async updateSelo(selo) {
    try {
      const response = await api.put(`/selos/${selo.id}`, selo);
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao atualizar selo");
    }
  },

  async deleteSelo(id) {
    try {
      await api.delete(`/selos/${id}`);
    } catch (error) {
      showNotification("error", "Erro ao deletar selo");
    }
  },
};

export default seloService;
