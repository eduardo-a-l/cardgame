"use client";

import { ComponentProps } from "react";

interface BotaoProps extends ComponentProps<"button"> {
  texto?: string;
  raio?: number;
  corDeFundo?: string;
  corDaBorda?: string;
  corDoTexto?: string;
}

export function Baralho({
  texto,
  raio = 12,
  corDeFundo = "#21366B",
  corDaBorda = "#686868",
  corDoTexto = "#FFFFFF",
  className = "",
  style,
  ...props
}: BotaoProps) {
  let tamanho = "leading-[1]"
  if ((texto?.length ?? 10) >= 13) {
    tamanho += " text-[clamp(32px,2vw,38px)]"
  }
  return (
    <button
      style={{
        backgroundColor: corDeFundo,
        color: corDoTexto,
        borderColor: corDaBorda,
        borderRadius: `${raio}px`,
        ...style,
      }}
      className={`flex items-center justify-center px-6 py-3 border-[5px] text-[clamp(32px,2.708vw,52px)] ${className} `}
      {...props}
    >
      {texto && <span className={tamanho}>{texto}</span>}
    </button>
  );
}
