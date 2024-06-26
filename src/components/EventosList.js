import React, { useEffect, useState } from "react";
import { List, Button, Card, Tag } from "antd";
import eventosService from "../services/eventosService";
import { formatDate, showNotification } from "../utils/utils";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import "./EventosList.css";
import { Link } from "react-router-dom";
import Search from "antd/es/transfer/search";
import { getSeloIcon } from "../utils/selosIcons";
import Header from "./Header";
import { useApp } from "../contexts/app";

const EventosList = () => {
  const app = useApp();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    loadEvents();
  }, [currentPage]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      if (searchValue != "") {
        const data = await eventosService.findEventByName(searchValue);
        if (Array.isArray(data)) {
          setEvents(data);
        }
      } else if (currentPage >= 1) {
        const data = await eventosService.loadEventsPage(currentPage, 4);
        if (Array.isArray(data)) {
          setEvents((prevEvents) => {
            const newEvents = data.filter((newEvent) => {
              return !prevEvents.some(
                (prevEvent) => prevEvent.id === newEvent.id
              );
            });
            return [...prevEvents, ...newEvents];
          });
        }
      }
    } catch (error) {
      showNotification("error", "Erro ao buscar eventos");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = () => {
    if (searchValue != "") {
      if (currentPage >= 1) {
        setCurrentPage(0);
      } else {
        loadEvents();
      }
    } else if (currentPage == 0) {
      setEvents([]);
      setCurrentPage(1);
    }
  };

  const handleLoadMore = () => {
    if (searchValue == "") {
      setCurrentPage((prevPage) => prevPage + 1);
    } else {
      setSearchValue("");
      if (currentPage != 1) {
        setCurrentPage(1);
      } else {
        loadEvents();
      }
    }
  };
  return (
    <Header>
      <div className="eventos-list-container">
        <div className="search-card">
          <Search
            name="search-by-name"
            placeholder="Pesquise eventos pelo nome"
            onChange={handleSearchChange}
            value={searchValue}
          ></Search>
          <Button
            loading={loading}
            className="button-search"
            onClick={handleSearch}
          >
            Pesquisar
          </Button>
        </div>
        <Card className="eventos-card">
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
                actions={[
                  <a key="list-loadmore-more" href={`/eventos/${item.id}`}>
                    Mais
                  </a>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Link to={`/eventos/${item.id}`}>
                      <span className="titulo"> {item.nome} </span>
                    </Link>
                  }
                  description={
                    <>
                      <div className="event-description">
                        <EnvironmentOutlined /> {item.local}
                      </div>
                      <div className="event-description">
                        <CalendarOutlined /> {formatDate(item.inicio)}
                      </div>
                      <div className="event-description">
                        {app.selosByEventos?.[item.id]?.map((item) => (
                          <Tag>{getSeloIcon(item.tipoSelo)}</Tag>
                        ))}
                      </div>
                    </>
                  }
                  avatar={
                    <Link to={`/eventos/${item.id}`}>
                      <img
                        className="event-image"
                        alt="imagem"
                        src={item.imagemUrl}
                      />
                    </Link>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </Header>
  );
};

export default EventosList;
