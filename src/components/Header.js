import React, { useState, useEffect } from "react";
import "./header.css";
import EventosForm from "./EventosForm";
import { Button } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import Logo from "../storage/IncluEvents.svg";
import { useApp } from "../contexts/app";

const Header = ({ children }) => {
  const app = useApp();

  const [loading, setLoading] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const showDrawer = () => {
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  return (
    <>
      <div className="header-container">
        <header className="header">
          <nav>
            <ul>
              <li>
                <a href="/eventos">
                  <img src={Logo} width={40} />
                  <h1>IncluEvents</h1>
                </a>
              </li>
              <li>
                <a href="/eventos">Eventos</a>
              </li>
              {app.user?.tipo === "PREFEITURA" && (
                <li>
                  <a href="/validacoes">Validações</a>
                </li>
              )}
              <li className="li-event">
                {app.user?.tipo === "EMPRESA" && (
                  <>
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
                  </>
                )}
              </li>
              <Button
                type="primary"
                danger
                onClick={app.logout}
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
