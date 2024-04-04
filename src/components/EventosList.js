import React, { useEffect, useState } from "react";
import { List, Button, Card, Tag } from "antd";
import eventosService from "../services/eventosService";
import { formatDate, showNotification } from "../utils/utils";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
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

  const getColorFromOrigem = (origem) => {
    let color;
    switch (origem) {
      case "OUTGO":
        color = "#f50";
        break;
      case "INGRESSE":
        color = "#87d068";
        break;
      case "CADASTRO":
        color = "blue";
        break;
      default:
        color = "#2db7f5";
    }
    return <Tag color={color}>{origem}</Tag>;
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
                    <div className="event-description">
                      {getColorFromOrigem(item.origem)}
                    </div>
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
