import axios from "axios";
import { showNotification } from "../utils/utils";

const baseURL = "http://localhost:8080";

const api = axios.create({
  baseURL,
  timeout: 5000,
});

const eventosService = {
  async loadEvents() {
    try {
      const response = await api.get("/eventos");
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao buscar eventos");
    }
  },

  async loadEventsPage(page, sizePage) {
    try {
      const response = await api.get(`/eventos/paginated/${page}/${sizePage}`);
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao buscar eventos");
    }
  },

  async createEvent(event) {
    try {
      const response = await api.post("/eventos", event);
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao criar evento");
    }
  },

  async findEventById(id) {
    try {
      const response = await api.get(`/eventos/${id}`);
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao buscar evento por ID");
    }
  },

  async updateEvent(event) {
    try {
      const response = await api.put(`/eventos/update/${event.id}`, event);
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao atualizar evento");
    }
  },

  async deleteEvent(id) {
    try {
      await api.delete(`/eventos/delete/${id}`);
    } catch (error) {
      showNotification("error", "Erro ao deletar evento");
    }
  },
};

export default eventosService;
