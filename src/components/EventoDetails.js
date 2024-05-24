import React, { useEffect, useMemo, useState } from "react";
import { List, Button, Card, Tag } from "antd";
import eventosService from "../services/eventosService";
import { formatDate, showNotification } from "../utils/utils";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import "./EventoDetails.css";
import { useParams } from "react-router-dom";
import ValidarSeloModal from "./SelosModal";
import Header from "./Header";
import { useAuth } from "../contexts/auth";

const EventoDetails = () => {
  const auth = useAuth();

  const [evento, setEvento] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("validacao");

  const params = useParams();

  useEffect(() => {
    loadEvento();
  }, []);

  const loadEvento = async () => {
    setLoading(true);
    try {
      const data = await eventosService.findEventById(params.id);
      setEvento(data);
    } catch (error) {
      showNotification("error", "Erro ao buscar eventos");
    } finally {
      setLoading(false);
    }
  };

  const buttons = [];

  if (evento.criador?.id !== auth.user?.id) {
    buttons.push("validacao");

    if (!evento.criador && auth.user?.reputacao >= 70) {
      buttons.push("documentacao");
    }
  } else {
    buttons.push("documentacao");
  }
  buttons.push("documentacao");

  return (
    <Header>
      <div className="evento-details-container">
        <ValidarSeloModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          evento={evento}
          tipo={modalType}
        />
        <Card
          className="evento-card"
          actions={[
            <a href={evento?.urlOriginal}>Inscreva-se!</a>,
            ...buttons.map((key) => (
              <span
                key={key}
                role="button"
                onClick={() => [setModalOpen(true), setModalType(key)]}
              >
                {key === "validacao"
                  ? "Realizar feedback de acessibilidade"
                  : "Enviar documentação de acessibilidade"}
              </span>
            )),
          ]}
        >
          <Card.Meta
            avatar={
              <img
                width="100%"
                alt="imagem"
                src={evento?.imagemUrl}
                style={{ maxWidth: "500px" }}
              />
            }
            title={evento.nome}
            description={
              <>
                <p className="event-description">
                  <EnvironmentOutlined /> {evento.local}
                </p>
                <p className="event-description">
                  <CalendarOutlined /> {formatDate(evento.inicio)}
                </p>
                <p className="event-description">{evento.descricao}</p>
                {evento.categorias?.map((categoria) => (
                  <Tag key={categoria.id}>{categoria.nome}</Tag>
                ))}
              </>
            }
          />
        </Card>
      </div>
    </Header>
  );
};

export default EventoDetails;
