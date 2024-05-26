import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EventosList from "../components/EventosList";
import EventosForm from "../components/EventosForm";
import EventoDetails from "../components/EventoDetails";
import Validacoes from "../components/Validacoes";
import CreateUser from "../components/CreateUser";
import Login from "../components/Login";
import { AppProvider, useApp } from "../contexts/app";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const app = useApp();

  const isAuthenticated = !!app.user;

  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/login" />;
};

const RouterEventos = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/eventos" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route
            path="/eventos"
            element={<PrivateRoute element={EventosList} />}
          />
          <Route
            path="/eventos/new"
            element={<PrivateRoute element={EventosForm} />}
          />
          <Route
            path="/eventos/edit/:id"
            element={<PrivateRoute element={EventosForm} />}
          />
          <Route
            path="/eventos/:id"
            element={<PrivateRoute element={EventoDetails} />}
          />
          <Route
            path="/validacoes"
            element={<PrivateRoute element={Validacoes} />}
          />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
};

export default RouterEventos;
