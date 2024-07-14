import React, { useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import usuarioService from "../services/usuarioService";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const CreateUser = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(null);

  const onFinish = async (values) => {
    try {
      await usuarioService.createUser(values);
      message.success("Usuário cadastrado com sucesso!");
      navigate("/login");
    } catch (error) {
      message.error("Erro ao cadastrar usuário!");
    }
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  const handleUserTypeChange = (value) => {
    setUserType(value);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <h2>Cadastrar</h2>
      <Form name="create-user" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="nome"
          label="Nome"
          rules={[{ required: true, message: "Por favor insira seu nome!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Por favor insira seu email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="username"
          label="Nome de usuário"
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
        <Form.Item
          name="tipo"
          label="Tipo do usuário"
          rules={[
            {
              required: true,
              message: "Por favor selecione o tipo do usuário!",
            },
          ]}
        >
          <Select onChange={handleUserTypeChange}>
            <Option value="ESTUDANTE">Estudante</Option>
            <Option value="SERVIDOR">Servidor</Option>
          </Select>
        </Form.Item>

        {userType === "SERVIDOR" && (
        <>
            <Form.Item
                name="cargo"
                label="Cargo"
                rules={[
                {
                    required: true,
                    message: "Por favor selecione o cargo!",
                },
                ]}
            >
                <Select>
                <Option value="PROFESSOR">Professor</Option>
                <Option value="REITORIA">Reitoria</Option>
                <Option value="COORDENACAO">Coordenação</Option>
                </Select>
            </Form.Item>
            <Form.Item
            name="tempoServico"
            label="Tempo de Serviço"
            rules={[
                {
                required: true,
                message: "Por favor insira seu Tempo de Serviço!",
                },
            ]}
            >
            <Input type="number" step="0.1" />
            </Form.Item>
        </>
        )}

        {userType === "ESTUDANTE" && (
          <Form.Item
            name="imc"
            label="IMC"
            rules={[
              {
                required: true,
                message: "Por favor insira seu IMC!",
              },
            ]}
          >
            <Input type="number" step="0.1" />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cadastrar
          </Button>
          <span style={{ marginLeft: "30px" }}>Já é cadastrado?</span>
          <Button type="link" onClick={redirectToLogin}>
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateUser;
