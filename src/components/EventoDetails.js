import React, { useEffect, useMemo, useState } from "react";
import { List, Button, Card, Tag } from "antd";
import eventosService from "../services/eventosService";
import { formatDate, showNotification } from "../utils/utils";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import "./EventoDetails.css";
import { useParams } from "react-router-dom";
import ValidarSeloModal from "./SelosModal";
import Header from "./Header";
import { useApp } from "../contexts/app";
import { getSeloIcon } from "../utils/selosIcons";

const EventoDetails = () => {
  const app = useApp();

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

  if (evento.criador?.id !== app.user?.id) {
    buttons.push("validacao");

    if (!evento.criador && app.user?.reputacao >= 70) {
      buttons.push("documentacao");
    }
  } else {
    buttons.push("documentacao");
  }

  const parseLinks = (linkString) => {
    if (!linkString) return [];
    let cleanString = linkString.replace(/[\[\]\s]/g, '');
    let linkArray = cleanString.split(',');
    return linkArray;
  }

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
              <>
                <img
                  className="event-image"
                  alt="imagem"
                  src={parseLinks(evento?.imagemUrl)[0]}
                />
                <img
                  className="event-image"
                  alt="imagem"
                  src={parseLinks(evento?.imagemUrl)[1]}
                />
              </>
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
                <div>
                  {app.selosByEventos?.[params.id]?.map((item) => (
                    <Tag>{getSeloIcon(item.tipoSelo)}</Tag>
                  ))}
                </div>
              </>
            }
          />
        </Card>
      </div>
    </Header>
  );
};

export default EventoDetails;
