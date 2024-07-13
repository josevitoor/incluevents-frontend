import React, { useEffect, useState } from "react";
import { List, Button, Card } from "antd";
import { useApp } from "../contexts/app";

import "./Validacoes.css";
import Header from "./Header";
import usuarioService from "../services/usuarioService";

const Especialistas = () => {
  const [validacoesEspecialistas, setValidacoesEspecialistas] = useState([]);
  const [loading, setLoading] = useState(false);

  const app = useApp();

  useEffect(() => {
    checkUserPermission();
    loadValidacoesEspecialistas();
  }, []);

  const checkUserPermission = () => {
    if (app.user?.tipo !== "ORGAO_VALIDACAO") {
      window.location.href = "/eventos";
    }
    if (!app.user) {
      window.location.href = "/login";
    }
  };

  const loadValidacoesEspecialistas = async () => {
    setLoading(true);
    try {
      const data = await usuarioService.getUsuarios();
      setValidacoesEspecialistas(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleAprovar = async (id, isValida) => {
    setLoading(true);
    try {
      await usuarioService.validateDocumentacaoUsuario({
        idUsuario: id,
        documentacaoValida: isValida,
      }).then(()=>window.location.reload());
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const validacaoEspecialistas = () => {
    return (
      <div className="validacoes-container">
        <Card className="validacoes-card">
          <List
            loading={loading}
            dataSource={validacoesEspecialistas}
            renderItem={(item) => (item.tipo === 'ESPECIALISTA' && item.documentacaoValida === null) && (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={
                    <div className="evento-estabelecimento-detalhe">
                        Nome: {item.nome} 
                    <div className="documento">
                      Documento comprobatório: {' '}
                      <a
                        href={item.urlDocumentacao}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={item.nomeDocumentacao}
                        >
                      {item.nomeDocumentacao}
                      </a>
                  </div>
                  </div>
                  }
                  description={
                    <>
                        <div className="botoes">
                          <Button
                            className="botao-aprovar botao"
                            onClick={()=>{handleAprovar(item.id, true)}}
                          >
                            Aprovar
                          </Button>
                          <Button
                            className="botao-reprovar botao"
                            onClick={()=>{handleAprovar(item.id, false)}}
                          >
                            Reprovar
                          </Button>
                        </div>
                        </>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    );
  };

  return (
    <Header>
          {validacaoEspecialistas()}
    </Header>
  );
};

export default Especialistas;
