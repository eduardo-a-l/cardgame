"use client";

import { ComponentProps } from "react";
import { Icone, NomeIcone } from "./Icone";

interface BotaoProps extends ComponentProps<"button"> {
  texto?: string;
  raio?: number;
  nomeIcone?: NomeIcone;
  tamanhoIcone?: number;
  corDeFundo?: string;
  corDaBorda?: string;
  corDoTexto?: string;
}

export function Baralho({
  texto,
  raio = 12,
  nomeIcone,
  tamanhoIcone = 20,
  corDeFundo = "#21366B",
  corDaBorda = "#686868",
  corDoTexto = "#FFFFFF",
  className = "",
  style,
  ...props
}: BotaoProps) {
  return (
    <button
      style={{
        backgroundColor: corDeFundo,
        color: corDoTexto,
        borderColor: corDaBorda,
        borderRadius: `${raio}px`,
        ...style,
      }}
      className={`flex items-center justify-center px-6 py-3 border-2 text-lg ${className} `}
      {...props}
    >
      {texto && <span>{texto}</span>}
    </button>
  );
}
