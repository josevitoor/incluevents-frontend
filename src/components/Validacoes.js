import React, { useEffect, useState } from "react";
import { List, Button, Card } from "antd";
import validacoesService from "../services/validacoesService";
import { getSeloIcon } from "../utils/selosIcons";

import "./Validacoes.css";

const Validacoes = () => {

    const [validacoes, setValidacoes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadValidacoes();
    }, []);

    const loadValidacoes = async () => {
        setLoading(true);
        try {
            const data = await validacoesService.getValidacoesPendentes();
            setValidacoes(data);
            console.log("Validações pendentes: ", data);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    const validar = async (idSelo, possuiSelo) => {
        try {
            await validacoesService.validarSelo(idSelo, possuiSelo);
            loadValidacoes();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="validacoes-container">
            <Card className="validacoes-card">
            <List
                loading={loading}
                dataSource={validacoes}
                renderItem={(item) => (
                    <List.Item
                    key={item.id}
            >
                    <List.Item.Meta
                        title={item.nome}
                        description={
                            <div className="validacao">
                                
                                <div className="nome-selo">
                                    <div className="icon">{getSeloIcon(item.tipoSelo)}</div>
                                    <div>{item.tipoSelo}</div>
                                </div>
                                <div className="votacao">
                                    <div className="votos-label">Aprovaram</div>
                                    <div className="votos-positivos">{item.scorePositivo}</div>
                                    <div>|</div>
                                    <div className="votos-negativos">{item.scoreNegativo}</div>
                                    <div className="votos-label">Reprovaram</div>
                                </div>
                                <div className="botoes">
                                    <Button className="botao-aprovar botao" onClick={() => validar(item.idselo, true)}>
                                        Aprovar
                                    </Button>
                                    <Button className="botao-reprovar botao" onClick={() => validar(item.idselo, false)}>
                                        Reprovar
                                    </Button>
                                </div>
                            </div>
                        }
                    />
                    </List.Item>
                )}
                />
            </Card>
        </div>
     
    );
  };
  
  export default Validacoes;