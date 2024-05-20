import { format } from "date-fns";
import { message } from "antd";

export const formatDate = (date) => {
  if (date) {
    const inputDate = new Date(date);
    const formattedDate = format(inputDate, "dd/MM/yyyy");
    return formattedDate;
  }
  return "-";
};

export const showNotification = (type, title, description) => {
  const msg = `${title ? title + "! " : ""}${description ? description : ""}`;
  switch (type) {
    case "error":
      message.error(msg);
      break;
    case "success":
      message.success(msg);
      break;
  }
};

export const formatarEndereco = (rua, numero, bairro, cidade, estado, cep, complemento) => {
    let endereco = `${rua}, ${numero}`;

    if (complemento) {
        endereco += `, ${complemento}`;
    }

    endereco += `, ${bairro}, ${cidade} - ${estado}`;

    if (cep) {
        endereco += `, CEP: ${cep}`;
    }

    return endereco;
}
