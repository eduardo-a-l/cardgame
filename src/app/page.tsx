"use client";

import { useRouter } from "next/navigation";
import { BarraLateral } from "@/components/layout/BarraLateral";
import { Botao } from "@/components/ui/Botao";
import Logo from "@/assets/logo.svg";

export default function PaginaPrincipal() {
  const router = useRouter();

  return (
    <main className="flex h-screen bg-[#1B1B2F] relative overflow-hidden">
      <div className="z-10">
        <BarraLateral />
      </div>

      <div className="flex flex-col justify-center gap-40">
        <Botao
          texto="Jogar"
          nomeIcone="jogar"
          tamanhoIcone={40}
          corDoTexto="#FFFFFF"
          className="-ml-1 rounded-l-none px-30 py-10 text-xl"
          onClick={() => router.push("/selecionar-oponente")}
        />
        <Botao
          texto="Inventário"
          nomeIcone="inventario"
          tamanhoIcone={40}
          corDoTexto="#FFFFFF"
          className="-ml-1 rounded-l-none px-30 py-10 text-xl"
          onClick={() => router.push("/inventario")}
        />
        <Botao
          texto="Baralhos"
          nomeIcone="baralho"
          tamanhoIcone={40}
          corDoTexto="#FFFFFF"
          className="-ml-1 rounded-l-none px-30 py-10 text-xl "
        />
      </div>

      <div className="absolute inset-0 flex items-center justify-center -mr-50 pointer-events-none">
        <Logo className="w-auto h-auto" />
      </div>

      <div className="absolute bottom-20 right-0">
        <Botao
          texto="Loja"
          nomeIcone="loja"
          tamanhoIcone={40}
          corDeFundo="#C8911A"
          corDoTexto="#000000"
          corDaBorda="#686868"
          className="rounded-r-none -mr-1 px-30 py-10 text-xl"
        />
      </div>
    </main>
  );
}
