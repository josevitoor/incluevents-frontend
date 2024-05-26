import React, { useEffect, useState } from "react";
import {
  Drawer,
  Form,
  Input,
  DatePicker,
  Col,
  Row,
  Select,
  Steps,
  Button,
  message,
} from "antd";
import axios from "axios";
import "./EventosForm.css";
import TextArea from "antd/es/input/TextArea";
import categoriasService from "../services/categoriasService";
import { showNotification, formatarEndereco } from "../utils/utils";
import eventosService from "../services/eventosService";

const EventosForm = ({ isVisible, onClose }) => {
  const optionsUf = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  const [form] = Form.useForm();

  const { Option } = Select;
  const { Search } = Input;
  const { Step } = Steps;
  const { RangePicker } = DatePicker;

  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [optionsCategoria, setOptionsCategoria] = useState([]);
  const [optionsCidade, setOptionsCidade] = useState([]);
  const [selectedState, setSelectedState] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategorias();
  }, []);

  const nextStep = async () => {
    try {
      console.log(formData);
      await form.validateFields().then((values) => {
        setFormData((prevData) => ({
          ...prevData,
          ...values,
        }));
      });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Erro de validação:", error);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmitForm = async () => {
    // nome: nome,
    // local: formatarEndereco(rua, numero, bairro, cidade, estado, cep, complemento),
    // descricao: descricao,
    // urlOriginal: link_ingresso,
    // imagemUrl: capa_evento,
    // inicio: data_inicio;
    // fim: data_fim

    // categorias: ,

    try {
      await form.validateFields();

      const data = {
        nome: form.getFieldValue("nome"),
        local: formatarEndereco(
          form.getFieldValue("rua"),
          form.getFieldValue("numero"),
          form.getFieldValue("bairro"),
          form.getFieldValue("cidade"),
          form.getFieldValue("uf"),
          form.getFieldValue("cep"),
          form.getFieldValue("complemento")
        ),
        descricao: form.getFieldValue("descricao"),
        urlOriginal: form.getFieldValue("link_ingresso"),
        imagemUrl: form.getFieldValue("capa_evento"),
        inicio: form.getFieldValue("data_evento")[0],
        fim: form.getFieldValue("data_evento")[1],
        categorias: form.getFieldValue("categorias"),
      };

      await eventosService.createEvent(data);

      console.log("Evento criado!", data);

      onClose();
    } catch (error) {
      console.error("Erro ao processar o formulário:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  // categorias
  const loadCategorias = async () => {
    setLoading(true);
    try {
      const data = await categoriasService.loadCategorias();
      const categoriasUnicas = [];
      const nomesEncontrados = {}; // Objeto para rastrear nomes únicos
      data.forEach((item) => {
        if (!nomesEncontrados[item.nome]) {
          nomesEncontrados[item.nome] = true;
          categoriasUnicas.push(item);
        }
      });
      setOptionsCategoria(categoriasUnicas);
    } catch (error) {
      showNotification("error", "Erro ao buscar categorias");
    } finally {
      setLoading(false);
    }
  };

  //cep
  const fetchAddress = async (cep) => {
    try {
      setLoading(true);
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { uf, localidade, bairro, logradouro } = response.data;
      await getCityListByState(uf);

      form.setFieldsValue({
        uf,
        cidade: localidade,
        bairro: bairro,
        rua: logradouro,
      });
    } catch (error) {
      message.error(
        "Erro ao buscar endereço. Verifique o CEP e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) {
      await fetchAddress(cep);
    }
  };

  const handleUFChange = async (value) => {
    setSelectedState(value);
    setLoading(true);
    form.setFieldsValue({ cep: "", bairro: "", cidade: "" });
    try {
      await getCityListByState(value);
    } catch (error) {
      console.error("Erro ao obter lista de cidades:", error);
    } finally {
      setLoading(false);
    }
  };

  // municipios
  const getCityListByState = async (stateCode) => {
    try {
      const response = await axios.get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateCode}/municipios`,
        {}
      );
      setOptionsCidade(response.data);
    } catch (error) {
      console.error("Erro ao obter lista de cidades", error);
      return [];
    }
  };

  return (
    <Drawer
      title="Novo Evento"
      placement="right"
      onClose={handleCancel}
      open={isVisible}
      width={800}
      className="drawer-event"
      footer={
        <Row gutter={16} justify="end" className="footer-drawer">
          {currentStep > 0 && (
            <Button onClick={prevStep} className="footer-drawer-button">
              Voltar
            </Button>
          )}
          {currentStep < 1 && (
            <Button
              type="primary"
              onClick={nextStep}
              className="footer-drawer-button"
            >
              Próximo
            </Button>
          )}
          {currentStep === 1 && (
            <Button
              type="primary"
              onClick={handleSubmitForm}
              className="footer-drawer-button"
            >
              Enviar
            </Button>
          )}
        </Row>
      }
    >
      <Steps current={currentStep}>
        <Step title="Dados Do Evento" />
        <Step title="Endereço" />
        {/* <Step title="Acessibilidade" /> */}
      </Steps>
      <Form
        form={form}
        onFinish={handleSubmitForm}
        layout="vertical"
        name="userForm"
      >
        {currentStep === 0 && (
          <Col>
            <p className="section-tile">Insira os dados do seu evento</p>
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  name="nome"
                  label="Nome"
                  rules={[
                    {
                      required: true,
                      message: "Por favor insira o nome do evento!",
                    },
                  ]}
                >
                  <Input placeholder="Insira o nome do Evento" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="data_evento"
                  label="Data"
                  rules={[
                    {
                      required: true,
                      message: "Por favor insira o período do evento!",
                    },
                  ]}
                >
                  <RangePicker
                    format="DD/MM/YYYY"
                    showTime={false}
                    placeholder={["Início", "Fim"]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="descricao"
              label="Descrição"
              rules={[
                {
                  required: true,
                  message: "Por favor insira a descrição do evento!",
                },
              ]}
            >
              <TextArea
                showCount
                maxLength={3000}
                placeholder="Descreva seu Evento"
              />
            </Form.Item>
            <Form.Item
              name="categorias"
              label="Categorias"
              rules={[
                {
                  required: true,
                  message: "Por favor insira as categorias do evento!",
                },
              ]}
            >
              <Select
                placeholder="Selecione as categorias"
                mode="tags"
                allowClear
                style={{
                  width: "100%",
                }}
              >
                {optionsCategoria.map((option) => (
                  <Option key={option.id} value={option.nome}>
                    {option.nome}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="link_ingresso" label="Link do Ingresso">
              <Search
                addonBefore="https://"
                placeholder="Link do Ingresso"
                allowClear
              />
            </Form.Item>
            <Form.Item
              name="capa_evento"
              label="Capa do Evento"
              rules={[
                {
                  required: true,
                  message: "Por favor insira o link da capa do evento!",
                },
              ]}
            >
              <Search
                addonBefore="https://"
                placeholder="Link da Imagem"
                allowClear
              />
            </Form.Item>
          </Col>
        )}

        {currentStep === 1 && (
          <Col>
            <p className="section-tile">Insira o endereço do seu evento</p>

            <Row gutter={16}>
              <Col span={16}>
                <Form.Item name="cep" label="CEP">
                  <Input onChange={handleCepChange} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="uf"
                  label="UF"
                  rules={[
                    {
                      required: true,
                      message: "Por favor insira a UF do evento!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Selecione a UF"
                    onChange={handleUFChange}
                    value={selectedState}
                  >
                    {optionsUf.map((option, index) => (
                      <Option key={index} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="cidade"
                  label="Cidade"
                  rules={[
                    {
                      required: true,
                      message: "Por favor insira a cidade do evento!",
                    },
                  ]}
                >
                  <Select placeholder="Selecione a cidade">
                    {optionsCidade.map((option) => (
                      <Option key={option.id} value={option.nome}>
                        {option.nome}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="bairro"
                  label="Bairro"
                  rules={[
                    {
                      required: true,
                      message: "Por favor insira o bairro do evento!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  name="rua"
                  label="Rua"
                  rules={[
                    {
                      required: true,
                      message: "Por favor insira a rua do evento!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="numero"
                  label="Número"
                  rules={[
                    {
                      required: true,
                      message: "Por favor insira o número do evento!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="complemento" label="Complemento">
              <Input />
            </Form.Item>
          </Col>
        )}

        {/* {currentStep === 2 && (
                    <Col>
                        <p className="section-tile">Adicione acessibilidade ao seu evento</p>
                        {fields.map((field, index) => (
                            <TextImageInput
                                key={index}
                                index={index}
                                onRemove={handleRemoveField}
                            />
                        ))}
                        <Button type="dashed" onClick={handleAddField} style={{ width: '100%' }}>Adicionar Campo</Button>
                    </Col>
                )} */}
      </Form>
    </Drawer>
  );
};

export default EventosForm;
