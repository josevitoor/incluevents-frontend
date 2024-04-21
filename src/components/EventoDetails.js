import React, { useEffect, useState } from "react";
import { List, Button, Card, Tag } from "antd";
import eventosService from "../services/eventosService";
import { formatDate, showNotification } from "../utils/utils";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import Icon from "@ant-design/icons";
import { ReactComponent as ElevadorIcon } from "../storage/ELEVADOR.svg";
import { ReactComponent as BanheiroIcon } from "../storage/BANHEIRO.svg";
import { ReactComponent as BrailleIcon } from "../storage/BRAILLE.svg";
import { ReactComponent as EstacionamentoIcon } from "../storage/ESTACIONAMENTO.svg";
import { ReactComponent as InterpreteIcon } from "../storage/INTERPRETE.svg";
import { ReactComponent as GuiaIcon } from "../storage/GUIA.svg";
import { ReactComponent as RampaIcon } from "../storage/RAMPA.svg";
import "./EventoDetails.css";
import { useParams } from "react-router-dom";
import ValidarSeloModal from "./SelosModal";

const EventoDetails = () => {
  const [evento, setEvento] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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

  const getSelo = (tipo) => {
    let component;
    switch (tipo) {
      case "ELEVADOR":
        component = ElevadorIcon;
        break;
      case "BANHEIRO":
        component = BanheiroIcon;
        break;
      case "BRAILLE":
        component = BrailleIcon;
        break;
      case "ESTACIONAMENTO":
        component = EstacionamentoIcon;
        break;
      case "GUIA":
        component = InterpreteIcon;
        break;
      case "INTERPRETE":
        component = GuiaIcon;
        break;
      case "RAMPA":
        component = RampaIcon;
        break;
      default:
        component = "";
    }
    return <Icon component={component} />;
  };

  return (
    <div className="evento-details-container">
      <ValidarSeloModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <Card
        className="evento-card"
        actions={[
          <a href={evento.urlOriginal}>Inscreva-se!</a>,
          <span role="button" onClick={() => setModalOpen(true)}>
            Realizar feedback de acessibilidade
          </span>,
        ]}
      >
        <Card.Meta
          avatar={<img width="100%" alt="imagem" src={evento.imagemUrl} />}
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
  );
};

export default EventoDetails;
