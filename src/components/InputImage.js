import React from 'react';
import { Form, Select, Button, message, Upload, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const TextImageInput = ({ index, onRemove }) => {
    const { Option } = Select;
    const optionsSelos = [ "ELEVADOR","BANHEIRO","BRAILLE", "ESTACIONAMENTO", "GUIA", "INTERPRETE", "RAMPA"];

    const handleRemove = () => {
        onRemove(index);
    };

    const props = {
        name: 'file',
        action: '/src/assets/uploads',
        headers: {
          authorization: 'authorization-text',
        },
        accept: '.jpg, .jpeg, .png, .gif, .bmp, .mp4, .avi, .mov, .pdf, .txt',
        onChange(info) {
          if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
          }
          if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
          } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
          }
        },
    };

    return (
        <Row gutter={16} align="middle">
            <Col span={13}>
                <Form.Item
                    name="tipo_selo"
                    label="Tipo de Selo"
                    rules={[{ required: true, message: 'Por favor insira o tipo de selo!' }]}
                >
                    <Select placeholder="Selecione as categorias"
                            mode="tags"
                            allowClear
                            style={{
                                width: '100%',
                                textTransform: 'uppercase'
                            }}
                    >
                        {optionsSelos.map((option, i) => (
                            <Option key={i} value={option}>
                            {option}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Upload {...props}  maxCount={1}>
                    <Button icon={<UploadOutlined />}>Adicionar Arquivo</Button>
                </Upload>
            </Col>
            <Button type="primary" danger onClick={handleRemove}>Remover</Button>
        </Row>
    );
};

export default TextImageInput;
