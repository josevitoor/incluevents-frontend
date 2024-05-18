import {
  Button,
  Card,
  Carousel,
  Flex,
  Form,
  Input,
  List,
  Modal,
  Radio,
} from "antd";
import { useEffect, useState } from "react";
import validacoesService from "../services/validacoesService";
import { useParams } from "react-router-dom";
import { getSeloIcon } from "../utils/selosIcons";

const ValidarSeloModal = ({ open, onClose }) => {
  const [tiposSelo, setTiposSelo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [tipoSelo, setTipoSelo] = useState({});
  const [loadingCreate, setLoadingCreate] = useState(false);

  const [form] = Form.useForm();

  const params = useParams();

  const loadTiposSelo = async () => {
    setLoading(true);
    const data = await validacoesService.getDisponiveisByEvento(params.id);
    setTiposSelo(data);
    setLoading(false);
  };

  const handleSelectTipoSelo = (tipoSelo) => {
    setTipoSelo(tipoSelo.tipoSelo);
    setStep(2);
  };

  const handleAfterClose = () => {
    setTiposSelo([]);
    setLoading(false);
    setStep(1);
    setTipoSelo({});
  };

  const handleFinish = async () => {
    const data = form.getFieldsValue();
    setLoadingCreate(true);
    await validacoesService.criaValidacao({
      idEvento: params.id,
      tipoSelo: tipoSelo,
      ...data,
    });
    setLoadingCreate(false);
    onClose?.();
  };

  useEffect(() => {
    if (open) {
      loadTiposSelo();
    }
  }, [open]);



  return (
    <Modal
      open={open}
      onCancel={onClose}
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
      destroyOnClose
      afterClose={handleAfterClose}
    >
      {step === 1 && (
        <List
          header="Selecione um tipo de selo:"
          dataSource={tiposSelo}
          renderItem={(tipoSelo) => (
            <List.Item>
              <Card
                style={{ width: "100%" }}
                hoverable
                onClick={() => handleSelectTipoSelo(tipoSelo)}
              >
                <Card.Meta
                  avatar={getSeloIcon(tipoSelo.tipoSelo)}
                  title={tipoSelo.nome}
                  description={tipoSelo.descricao}
                />
              </Card>
            </List.Item>
          )}
        />
      )}
      {step === 2 && (
        <Form layout="vertical" onFinish={handleFinish} form={form}>
          <Form.Item
            label="O evento possui o tipo de selo de acessibilidade selecionado?"
            name="possuiSelo"
            required
          >
            <Radio.Group name="">
              <Radio value={true}>Sim</Radio>
              <Radio value={false}>Não</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Adicione uma observação sobre esse selo no evento (opcional):"
            name="descricao"
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button htmlType="submit" type="primary" loading={loadingCreate}>
              Enviar validação
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default ValidarSeloModal;
