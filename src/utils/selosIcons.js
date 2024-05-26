import React from "react";

import Icon from "@ant-design/icons";
import { ReactComponent as ElevadorIcon } from "../storage/ELEVADOR.svg";
import { ReactComponent as BanheiroIcon } from "../storage/BANHEIRO.svg";
import { ReactComponent as BrailleIcon } from "../storage/BRAILLE.svg";
import { ReactComponent as EstacionamentoIcon } from "../storage/ESTACIONAMENTO.svg";
import { ReactComponent as InterpreteIcon } from "../storage/INTERPRETE.svg";
import { ReactComponent as GuiaIcon } from "../storage/GUIA.svg";
import { ReactComponent as RampaIcon } from "../storage/RAMPA.svg";

export const getSeloIcon = (tipo) => {
  let component;
  switch (tipo) {
    case "ELEVADOR":
      component = ElevadorIcon;
      break;
    case "BANHEIRO":
      component = BanheiroIcon;
      break;
    case "BRAILLE":
      component = BrailleIcon;
      break;
    case "ESTACIONAMENTO":
      component = EstacionamentoIcon;
      break;
    case "GUIA":
      component = InterpreteIcon;
      break;
    case "INTERPRETE":
      component = GuiaIcon;
      break;
    case "RAMPA":
      component = RampaIcon;
      break;
    default:
      component = "";
  }
  return <Icon component={component} />;
};
