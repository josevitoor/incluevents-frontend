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
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import validacoesService from "../services/validacoesService";
import { useParams } from "react-router-dom";
import { getSeloIcon } from "../utils/selosIcons";
import { UploadOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/auth";
import documentacoesService from "../services/documentacaoService";

const ValidarSeloModal = ({ open, onClose, evento, tipo = "validacao" }) => {
  const auth = useAuth();

  const [tiposSelo, setTiposSelo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [tipoSelo, setTipoSelo] = useState({});
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [file, setFile] = useState(null);

  const [form] = Form.useForm();

  const params = useParams();

  const loadTiposSelo = async () => {
    setLoading(true);
    const data =
      tipo === "validacao"
        ? await validacoesService.getDisponiveisByEvento(params.id)
        : await documentacoesService.getDisponiveisByEvento(params.id);
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
      possuiSelo: true,
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
          {tipo === "validacao" && (
            <>
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
            </>
          )}
          <Upload
            beforeUpload={(file) => setFile(file)}
            onRemove={() => setFile(null)}
            fileList={file && [file]}
          >
            {tipo === "documentacao" && (
              <Form.Item label="Envie uma documentação que comprove que esse evento possui esse selo:">
                <Button icon={<UploadOutlined />}>Documentação</Button>
              </Form.Item>
            )}
          </Upload>
          <Form.Item
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button htmlType="submit" type="primary" loading={loadingCreate}>
              Enviar {tipo === "validacao" ? "validação" : "documentação"}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default ValidarSeloModal;
