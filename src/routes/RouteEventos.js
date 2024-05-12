import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EventosList from "../components/EventosList";
import EventosForm from "../components/EventosForm";
import EventoDetails from "../components/EventoDetails";
import Validacoes from "../components/Validacoes";

const RouteEventos = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/eventos" />} />
        <Route path="/eventos" index element={<EventosList />} />
        <Route path="/eventos/new" element={<EventosForm />} />
        <Route path="/eventos/edit/:id" element={<EventosForm />} />
        <Route path="/eventos/:id" element={<EventoDetails />} />
        <Route path="/validacoes" element={<Validacoes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteEventos;
