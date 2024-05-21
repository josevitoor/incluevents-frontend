import React, { useState } from "react";
import "./header.css";
import Logo from "../assets/img/logo_white.png";
import EventosForm from "./EventosForm";
import { Button } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";

const Header = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <>
      <div className="header-container">
        <header className="header">
          <nav>
            <ul>
              <li>
                <a href="/eventos">
                  <img src={Logo} width={20} />
                  <h1>IncluEvents</h1>
                </a>
              </li>
              <li>
                <a href="/eventos">Eventos</a>
              </li>
              <li>
                <a href="/validacoes">Validações</a>
              </li>
              <li className="li-event">
                <Button
                  icon={<PlusOutlined />}
                  onClick={showDrawer}
                  loading={loading}
                  className="li-event-button"
                >
                  Criar Evento
                </Button>
                <EventosForm
                  isVisible={isDrawerVisible}
                  onClose={closeDrawer}
                />
              </li>
              <Button
                type="primary"
                danger
                onClick={handleLogout}
                icon={<UserOutlined />}
              >
                Sair
              </Button>
            </ul>
          </nav>
        </header>
      </div>
      <div style={{ marginTop: "100px" }}>{children}</div>
    </>
  );
};

export default Header;
