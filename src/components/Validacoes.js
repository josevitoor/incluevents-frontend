import React, { useEffect, useState } from "react";
import { List, Button, Card, Tabs } from "antd";
import validacoesService from "../services/validacoesService";
import { getSeloIcon } from "../utils/selosIcons";

import "./Validacoes.css";

const Validacoes = () => {
    const [validacoes, setValidacoes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadValidacoes();
    }, []);

    const tratarJson = (data) => {
        return data.map(data => {
            const isEvento = !!data.evento;
            const source = isEvento ? data.evento : data.estabelecimento;
            const eventoOrEstabelecimento = isEvento ? "evento" : "estabelecimento";
            
            const { id, nome, local, urlOriginal, estabelecimento } = source;
            
            const selos = data.gruposVotacaoSelo.map(grupo => {
                console.log("Grupo ");
                console.log(grupo);
                const {
                    selo: { tipoSelo },
                    totalScore,
                    totalEnvios,
                    scorePositivo,
                    scoreNegativo,
                    enviosPositivos,
                    enviosNegativos
                } = grupo;

                return {
                    tipoSelo,
                    totalScore,
                    totalEnvios,
                    scorePositivo,
                    scoreNegativo,
                    enviosPositivos,
                    enviosNegativos
                };
            });

            return {
                id,
                nome,
                local,
                urlOriginal,
                estabelecimento,
                eventoOrEstabelecimento,
                selos
            };
        }).filter(item => item.selos.length > 0);
    };

    const loadValidacoes = async () => {
        setLoading(true);
        try {
            const data = await validacoesService.getValidacoesPendentes();
            const treated = tratarJson(data);
            setValidacoes(treated);
            console.log("Dados tratados");
            console.log(treated);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const validar = async (idSelo, possuiSelo) => {
        try {
            await validacoesService.validarSelo(idSelo, possuiSelo);
            loadValidacoes();
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
                        dataSource={validacoes}
                        renderItem={(item) => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    title={
                                        <div className="evento-estabelecimento-detalhe">
                                            <div>{item.nome} ({item.eventoOrEstabelecimento})</div>
                                            <div>{item.local}</div>
                                            {
                                                item.eventoOrEstabelecimento === "evento" ? 
                                                (<div><a href={`/eventos/${item.id}`} target="_blank" rel="noopener noreferrer">Ver evento</a></div>) : 
                                                (<div><a href={`/estabelecimento/${item.id}`} target="_blank" rel="noopener noreferrer">Ver estabelecimento</a></div>)
                                            }
                                        </div>
                                    }
                                    description={
                                        item.selos.map((selo, index) => (
                                            <div key={index} className="validacao">
                                                <div className="nome-selo">
                                                    <div className="icon">{getSeloIcon(selo.tipoSelo)}</div>
                                                    <div>{selo.tipoSelo}</div>
                                                </div>
                                                <div className="votacao">
                                                    <div className="votos-label">Aprovaram</div>
                                                    <div className="votos-positivos">{selo.scorePositivo}</div>
                                                    <div>|</div>
                                                    <div className="votos-negativos">{selo.scoreNegativo}</div>
                                                    <div className="votos-label">Reprovaram</div>
                                                </div>
                                                <div className="botoes">
                                                    <Button className="botao-aprovar botao" onClick={() => validar(item.id, true)}>
                                                        Aprovar
                                                    </Button>
                                                    <Button className="botao-reprovar botao" onClick={() => validar(item.id, false)}>
                                                        Reprovar
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    }
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
                    <div>Documentação</div>
                </Card>
            </div>
        );
    };

    return (
        <div>
            <Tabs defaultActiveKey="1" className="centered-tabs">
                <Tabs.TabPane tab="Votos" key="1">
                    {validacaoVotacao()}
                </Tabs.TabPane>
                <Tabs.TabPane tab="Documentação" key="2">
                    {validacaoDocumentacao()}
                </Tabs.TabPane>
            </Tabs>
        </div>
    );
};

export default Validacoes;
