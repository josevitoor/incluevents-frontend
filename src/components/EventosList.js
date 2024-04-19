import React, { useEffect, useState } from "react";
import { List, Button, Card } from "antd";
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
import "./EventosList.css";

const EventosList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadEvents();
  }, [currentPage]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await eventosService.loadEventsPage(currentPage, 3);
      setEvents((prevEvents) => {
        const newEvents = data.filter((newEvent) => {
          return !prevEvents.some((prevEvent) => prevEvent.id === newEvent.id);
        });
        return [...prevEvents, ...newEvents];
      });
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

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="eventos-list-container">
      <Card title="Eventos" className="eventos-card">
        <List
          loading={loading}
          dataSource={events}
          loadMore={
            <div className="load-more-button">
              <Button onClick={handleLoadMore} loading={loading}>
                Carregar Mais
              </Button>
            </div>
          }
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[<a key="list-loadmore-more">Mais</a>]}
            >
              <List.Item.Meta
                title={item.nome}
                description={
                  <>
                    <div className="event-description">
                      <EnvironmentOutlined /> {item.local}
                    </div>
                    <div className="event-description">
                      <CalendarOutlined /> {formatDate(item.inicio)}
                    </div>
                    <div className="event-description">{getSelo()}</div>
                  </>
                }
                avatar={<img width={200} alt="imagem" src={item.imagemUrl} />}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default EventosList;
