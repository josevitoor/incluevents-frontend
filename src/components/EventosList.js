import React, { useEffect, useState } from "react";
import { Table, Space, Button, message, Card, Tag, Tooltip } from "antd";
import { Link } from "react-router-dom";
import eventosService from "../services/eventosService";
import { formatDate } from "../utils/utils";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";

const EventosList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await eventosService.loadEvents();
      setEvents(data);
    } catch (error) {
      message.error("Erro ao buscar eventos");
    } finally {
      setLoading(false);
    }
  };

  const getColorFromOrigem = (origem) => {
    return <Tag color={origem === "OUTGO" ? "#f50" : "#2db7f5"}>{origem}</Tag>;
  };

  const columns = [
    {
      title: "Origem",
      dataIndex: "origem",
      key: "origem",
      render: (origem) => getColorFromOrigem(origem),
    },
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
    },
    {
      title: "Local",
      dataIndex: "local",
      key: "local",
    },
    {
      title: "Data Início",
      dataIndex: "inicio",
      key: "inicio",
      render: (date) => formatDate(date),
    },
    {
      title: " ",
      with: "50px",
      render: (text, record) => (
        <Space size="small">
          <Link to="eventos/edit/:id">
            <Tooltip title="Visualizar/Editar">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => handleEdit(record)}
              ></Button>
            </Tooltip>
          </Link>
          <Tooltip title="Excluir">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            ></Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    console.log("Editar evento:", record);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await eventosService.deleteEvent(id);
      message.success("Evento deletado com sucesso");
      loadEvents();
    } catch (error) {
      message.error("Erro ao deletar evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Eventos">
      <Link to="eventos/new">
        <Button type="primary" style={{ marginBottom: 16 }}>
          Novo Evento
        </Button>
      </Link>
      <Table
        columns={columns}
        dataSource={events}
        loading={loading}
        rowKey="id"
      />
    </Card>
  );
};

export default EventosList;
