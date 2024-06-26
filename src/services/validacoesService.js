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

const validacoesService = {
  async getDisponiveisByEvento(idEvento) {
    try {
      const response = await api.get(
        `/votacoes-selo/disponiveis?idEvento=${idEvento}`
      );
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao buscar validações disponíveis");
    }
  },

  async criaValidacao(validacao) {
    try {
      const response = await api.post("/votacoes-selo", validacao);
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao criar validação");
    }
  },

  async getValidacoesPendentes() {
    try {
      const response = await api.get(`/votacoes-selo/pendentes`);
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao buscar validações pendentes");
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

  async validarSelo(idSelo, possuiSelo) {
    try {
      const response = await api.post("/votacoes-selo/validar", {
        idSelo,
        possuiSelo,
      });
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao criar validação");
    }
  },

  async validarDocumentacao(idSelo, idDocumentacao, valida) {
    try {
      const response = await api.post("/documentacoes-selo/valida", {
        idSelo,
        idDocumentacao,
        valida,
      });
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao validar documentação");
    }
  },
};

export default validacoesService;
