import { Children, ComponentProps } from "react";
import { Icone, NomeIcone } from "./Icone";

interface BotaoIconeProps extends ComponentProps<"button"> {
  nomeIcone: NomeIcone;
  tamanhoIcone?: number;
}

export function BotaoIcone({
  nomeIcone,
  tamanhoIcone = 24,
  className = "",
  children,
  ...props
}: BotaoIconeProps) {
  return (
    <button className={`cursor-pointer inline-flex items-center ${className}`} {...props}>
      <Icone nome={nomeIcone} tamanho={tamanhoIcone} />
      {children} 
    </button>
  );
}
