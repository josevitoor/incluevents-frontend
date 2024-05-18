import axios from "axios";
import { showNotification } from "../utils/utils";

const baseURL = "http://localhost:8080";

const api = axios.create({
  baseURL,
  timeout: 5000,
});

const validacoesService = {
  async getDisponiveisByEvento(idEvento) {
    try {
      const response = await api.get(
        `/votacoes-selo/disponiveis?idEvento=${idEvento}&idUsuario=1`
      );
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao buscar validações disponíveis");
    }
  },

  async criaValidacao(validacao) {
    try {
      const response = await api.post("/votacoes-selo", {
        ...validacao,
        idUsuario: 1,
      });
      return response.data;
    } catch (error) {
      showNotification("error", "Erro ao criar validação");
    }
  },
};

export default validacoesService;
