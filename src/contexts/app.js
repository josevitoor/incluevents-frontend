import { createContext, useContext, useEffect, useMemo, useState } from "react";
import usuarioService from "../services/usuarioService";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import seloService from "../services/seloService";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selos, setSelos] = useState([]);
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

  useEffect(() => {
    const load = async () => {
      const data = await seloService.loadSelos();

      setSelos(data.filter((item) => item.validado));
    };

    if (user) {
      load();
    }
  }, [user]);

  const selosByEventos = useMemo(() => {
    return selos.reduce((acc, item) => {
      return {
        ...acc,
        [item.evento.id]: [...(acc[item.evento.id] || []), item],
      };
    }, {});
  }, [selos]);

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
    <AppContext.Provider value={{ user, login, logout, selos, selosByEventos }}>
      {!loading && children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
