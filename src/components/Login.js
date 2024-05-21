import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import usuarioService from "../services/usuarioService";
import "./login.css";
import logo from "../storage/IncluEvents.svg";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await usuarioService.login(values);
      const token = response.token;
      localStorage.setItem("token", token);
      console.log(token);
      message.success("Login realizado com sucesso!");
      navigate("/eventos");
    } catch (error) {
      localStorage.removeItem("token");
    }
  };

  const redirectToRegister = () => {
    navigate("/create-user");
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <img src={logo} alt="IncluEvents Logo" className="logo" />
        <h1 className="login-title">
          <span className="inclu">Inclu</span>
          <span className="events">Events</span>
        </h1>
        <h3 className="login-subtitle">Entrar</h3>
        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="username"
            label="Usuário"
            rules={[
              {
                required: true,
                message: "Por favor insira seu nome de usuário!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="senha"
            label="Senha"
            rules={[{ required: true, message: "Por favor insira sua senha!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Entrar
            </Button>
            <span style={{ marginLeft: "30px" }}>Não possui cadastro?</span>
            <Button type="link" onClick={redirectToRegister}>
              Cadastrar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
