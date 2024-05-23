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

const documentacoesService = {
  async getDisponiveisByEvento(idEvento) {
    try {
      const response = await api.get(
        `/documentacoes-selo/disponiveis?idEvento=${idEvento}`
      );
      return response.data;
    } catch (error) {
      showNotification(
        "error",
        "Erro ao buscar solicitações de documentação disponíveis"
      );
    }
  },

  async criaDocumentacao(data) {
    try {
      const response = await api.post("/documentacoes-selo", data);
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao enviar documentação");
    }
  },

  async getDocumentacoesPendentes() {
    try {
      const response = await api.get(`/documentacoes-selo/pendentes`);
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao buscar documentações pendentes");
    }
  },

  async validarDocumentacao(idSelo, valida) {
    try {
      const response = await api.post("/documentacoes-selo/validar", {
        idSelo,
        valida,
      });
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao validar documentação");
    }
  },
};

export default documentacoesService;
