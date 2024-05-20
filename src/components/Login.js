import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import usuarioService from "../services/usuarioService";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await usuarioService.login(values);
      const token = response.data.token;
      localStorage.setItem("token", token);
      message.success("Usuário entrou com sucesso!");
      navigate("/eventos");
    } catch (error) {
      message.error("Falha ao entrar. Por favor, verifique suas credenciais.");
    }
  };

  const redirectToRegister = () => {
    navigate("/create-user");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <h2>Entrar</h2>
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
  );
};

export default Login;
