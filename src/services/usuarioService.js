import axios from "axios";

const API_URL = "http://localhost:8080";

const login = async (credentials) => {
  return axios.post(`${API_URL}/auth/login`, credentials);
};

const createUser = async (userData) => {
  return axios.post(`${API_URL}/usuarios`, userData);
};

export default {
  login,
  createUser,
};
