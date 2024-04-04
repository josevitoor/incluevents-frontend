import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventosList from "../components/EventosList";
import EventosForm from "../components/EventosForm";

const RouteEventos = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/eventos" index element={<EventosList />} />
        <Route path="/eventos/new" element={<EventosForm />} />
        <Route path="/eventos/edit/:id" element={<EventosForm />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteEventos;
