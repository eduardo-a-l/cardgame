import { ComponentProps } from "react";

import IconeLeaderboard from "@/assets/icons/leaderboard.svg";
import IconeUsuario from "@/assets/icons/user.svg";
import IconeConfiguracoes from "@/assets/icons/settings.svg";
import IconeJogar from "@/assets/icons/play.svg";
import IconeInventario from "@/assets/icons/package.svg";
import IconeBaralho from "@/assets/icons/deck.svg";
import IconeLoja from "@/assets/icons/shop.svg";
import IconeVoltar from "@/assets/icons/back.svg";
import IconeNovo from "@/assets/icons/plus.svg";
import IconeParaBaixo from "@/assets/icons/down.svg";
import IconeLanca from "@/assets/icons/lanca.svg";
import IconeEspada from "@/assets/icons/espada.svg";
import IconeCadeado from "@/assets/icons/cadeado.svg";

const icones = {
  leaderboard: IconeLeaderboard,
  usuario: IconeUsuario,
  configuracoes: IconeConfiguracoes,
  jogar: IconeJogar,
  inventario: IconeInventario,
  baralho: IconeBaralho,
  loja: IconeLoja,
  voltar: IconeVoltar,
  novo: IconeNovo,
  paraBaixo: IconeParaBaixo,
  espada: IconeEspada,
  lança: IconeLanca,
  cadeado: IconeCadeado,
} as const;

export type NomeIcone = keyof typeof icones;

interface IconeProps extends ComponentProps<"svg"> {
  nome: NomeIcone;
  tamanho?: number;
}

export function Icone({
  nome,
  tamanho = 24,
  className = "",
  ...props
}: IconeProps) {
  const IconeSelecionado = icones[nome];

  return (
    <IconeSelecionado
      className={className}
      width={tamanho}
      height={tamanho}
      {...props}
    />
  );
}
