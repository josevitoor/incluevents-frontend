import React, { useEffect, useState } from "react";
import { List, Button, Card, Tabs } from "antd";
import validacoesService from "../services/validacoesService";
import { getSeloIcon } from "../utils/selosIcons";
import { useAuth } from "../contexts/auth";

import "./Validacoes.css";
import Header from "./Header";

const Validacoes = () => {
  const [validacoesVotos, setValidacoesVotos] = useState([]);
  const [validacoesDocs, setValidacoesDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  const auth = useAuth();


  useEffect(() => {
    checkUserPermission();
    loadValidacoesVotos();
    loadValidacoesDocs();
  }, []);

  const checkUserPermission = () => {
    if (auth.user?.tipo !== "PREFEITURA") {
      window.location.href = "/eventos";
    }
    if (!auth.user) {
      window.location.href = "/login";
    }
  };

  const tratarJsonVotos = (data) => {
    return data
      .map((data) => {
        const isEvento = !!data.evento;
        const source = isEvento ? data.evento : data.estabelecimento;
        const eventoOrEstabelecimento = isEvento ? "evento" : "estabelecimento";

        const { id, nome, local, urlOriginal, estabelecimento } = source;

        const selos = data.gruposVotacaoSelo.map((grupo) => {
          const {
            selo: { tipoSelo, id },
            totalScore,
            totalEnvios,
            scorePositivo,
            scoreNegativo,
            enviosPositivos,
            enviosNegativos,
          } = grupo;

          return {
            id,
            tipoSelo,
            totalScore,
            totalEnvios,
            scorePositivo,
            scoreNegativo,
            enviosPositivos,
            enviosNegativos,
          };
        });

        return {
          nome,
          local,
          urlOriginal,
          estabelecimento,
          eventoOrEstabelecimento,
          selos,
        };
      })
      .filter((item) => item.selos.length > 0);
  };

  const tratarJsonDocumentacoes = (data) => {
    return data
      .map((data) => {
        const isEvento = !!data.evento;
        const source = isEvento ? data.evento : data.estabelecimento;
        const eventoOrEstabelecimento = isEvento ? "evento" : "estabelecimento";

        const { id: sourceId, nome, local, urlOriginal, estabelecimento } = source;
        const selos = data.documentacoesSelo.map((grupo) => {
          const {
            id: documentoId, 
            selo: { tipoSelo, id: seloId },
            nomeArquivo,
            urlArquivo,
          } = grupo;

          return {
            documentoId,
            seloId,
            tipoSelo,
            nomeArquivo,
            urlArquivo
          };
        });

        return {
          sourceId,
          nome,
          local,
          urlOriginal,
          estabelecimento,
          eventoOrEstabelecimento,
          selos,
        };
      })
      .filter((item) => item.selos.length > 0);
  };

  const loadValidacoesVotos = async () => {
    setLoading(true);
    try {
      const data = await validacoesService.getValidacoesPendentes();
      const treated = tratarJsonVotos(data);
      setValidacoesVotos(treated);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const loadValidacoesDocs = async () => {
    setLoading(true);
    try {
      const data = await validacoesService.getDocumentacoesPendentes();

      const treated = tratarJsonDocumentacoes(data);
      setValidacoesDocs(treated);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const validarVotos = async (idSelo, possuiSelo) => {
    try {
      await validacoesService.validarSelo(idSelo, possuiSelo);
      loadValidacoesVotos();
      loadValidacoesDocs();
    } catch (error) {
      console.log(error);
    }
  };

  const validarDocumentacao = async (idSelo, idDocumentacao, valida) => {
    try {
      await validacoesService.validarDocumentacao(idSelo, idDocumentacao, valida);
      loadValidacoesVotos();
      loadValidacoesDocs();
    } catch (error) {
      console.log(error);
    }
  };

  const validacaoVotacao = () => {
    return (
      <div className="validacoes-container">
        <Card className="validacoes-card">
          <List
            loading={loading}
            dataSource={validacoesVotos}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={
                    <div className="evento-estabelecimento-detalhe">
                      <div>
                        {item.nome} ({item.eventoOrEstabelecimento})
                      </div>
                      <div>{item.local}</div>
                      {item.eventoOrEstabelecimento === "evento" ? (
                        <div>
                          <a
                            href={`/eventos/${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Ver evento
                          </a>
                        </div>
                      ) : (
                        <div>
                          <a
                            href={`/estabelecimento/${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Ver estabelecimento
                          </a>
                        </div>
                      )}
                    </div>
                  }
                  description={item.selos.map((selo, index) => (
                    <div key={index} className="validacao">
                      <div className="nome-selo">
                        <div className="icon">{getSeloIcon(selo.tipoSelo)}</div>
                        <div>{selo.tipoSelo}</div>
                      </div>
                      <div className="votacao">
                        <div className="votos-label">Aprovaram</div>
                        <div className="votos-positivos">
                          {selo.enviosPositivos}
                        </div>
                        <div>|</div>
                        <div className="votos-negativos">
                          {selo.enviosNegativos}
                        </div>
                        <div className="votos-label">Reprovaram</div>
                      </div>
                      <div className="botoes">
                        <Button
                          className="botao-aprovar botao"
                          onClick={() => validarVotos(selo.id, true)}
                        >
                          Aprovar
                        </Button>
                        <Button
                          className="botao-reprovar botao"
                          onClick={() => validarVotos(selo.id, false)}
                        >
                          Reprovar
                        </Button>
                      </div>
                    </div>
                  ))}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    );
  };

  const validacaoDocumentacao = () => {
    return (
      <div className="validacoes-container">
        <Card className="validacoes-card">
          <List
            loading={loading}
            dataSource={validacoesDocs}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <List.Item.Meta
                  title={
                    <div className="evento-estabelecimento-detalhe">
                      <div>
                        {item.nome} ({item.eventoOrEstabelecimento})
                      </div>
                      <div>{item.local}</div>
                      {item.eventoOrEstabelecimento === "evento" ? (
                        <div>
                          <a
                            href={`/eventos/${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Ver evento
                          </a>
                        </div>
                      ) : (
                        <div>
                          <a
                            href={`/estabelecimento/${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Ver estabelecimento
                          </a>
                        </div>
                      )}
                      
                    </div>
                  }
                  description={item.selos.map((selo, index) => (
                    <div>
                      
                      <div key={index} className="validacao-documento">
                        <div className="nome-selo">
                          <div className="icon">{getSeloIcon(selo.tipoSelo)}</div>
                          <div>{selo.tipoSelo}</div>
                        </div>
                      
                        <div className="botoes">
                          <Button
                            className="botao-aprovar botao"
                            onClick={() => validarDocumentacao(selo.seloId, selo.documentoId, true)}
                          >
                            Aprovar
                          </Button>
                          <Button
                            className="botao-reprovar botao"
                            onClick={() => validarDocumentacao(selo.seloId, selo.documentoId, false)}
                          >
                            Reprovar
                          </Button>
                        </div>
                      </div>
                      <div className="documento">
                        Documento comprobatório:  
                        <a href={selo.urlArquivo} target="_blank" rel="noopener noreferrer">
                          {selo.nomeArquivo}
                        </a>
                      </div>
                    </div>
                    
                  ))}
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
      <Tabs defaultActiveKey="1" className="centered-tabs">
        <Tabs.TabPane tab="Votos" key="1">
          {validacaoVotacao()}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Documentação" key="2">
          {validacaoDocumentacao()}
        </Tabs.TabPane>
      </Tabs>
    </Header>
  );
};

export default Validacoes;
