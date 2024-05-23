import { createContext, useContext, useEffect, useState } from "react";
import usuarioService from "../services/usuarioService";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await usuarioService.getLoggedUser();

        setUser(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await usuarioService.login(credentials);
      const token = response.token;
      localStorage.setItem("token", token);
      message.success("Login realizado com sucesso!");
      const user = await usuarioService.getLoggedUser();
      setUser(user);
      navigate("/eventos");
    } catch (error) {
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
