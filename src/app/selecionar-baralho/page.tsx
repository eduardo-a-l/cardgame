"use client";

import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import { Baralho } from "@/components/ui/Baralho";
import { useState } from "react";

export default function TelaSelecionarOponente() {
  const router = useRouter();

  const usuario = "NomeUsuário";

  const baralhos = [
    { id: 1, nome: "MeuBaralho" },
    { id: 2, nome: "Baralho 2" },
    { id: 3, nome: "Baralho 3" },
    { id: 4, nome: "Baralho 4" },
    { id: 5, nome: "Baralho Bom" },
    { id: 6, nome: "Baralho 6" },
    { id: 7, nome: "Baralho 7" },
    { id: 8, nome: "Baralho 8" },
    { id: 9, nome: "Baralho 9" },
    { id: 10, nome: "Baralho 10" },
    { id: 11, nome: "Baralho 11" },
    { id: 12, nome: "Baralho 12" },
    { id: 13, nome: "Baralho 13" },
    { id: 14, nome: "Baralho 14" },
    { id: 15, nome: "Baralho 15" },
    { id: 16, nome: "Baralho 16" },
    { id: 17, nome: "Baralho Interessante" },
    { id: 18, nome: "Baralho 18" },
    { id: 19, nome: "Baralho 19" },
    { id: 20, nome: "Baralho 20" },
    { id: 21, nome: "Baralho 21" },
    { id: 22, nome: "Baralho 22" },
    { id: 23, nome: "Baralho 23" },
    { id: 24, nome: "Baralho 24" },
    { id: 25, nome: "Baralho 25" },
    { id: 26, nome: "Baralho 26" },
    { id: 27, nome: "Baralho 27" },
    { id: 28, nome: "Baralho 28" },
    { id: 29, nome: "Baralho 29" },
    { id: 30, nome: "Baralho 30" },
  ];

  const [selecionado, setSelecionado] = useState<number | null>(null);

  return (
    <main className="relative h-screen bg-[#1B1B2F] overflow-hidden">
      <div className="absolute m-10">
        <Botao
          texto="Voltar"
          nomeIcone="voltar"
          tamanhoIcone={40}
          corDoTexto="#FFFFFF"
          corDeFundo="transparent"
          corDaBorda="transparent"
          className="px-0 py-0 text-3xl"
          onClick={() => router.push("/")}
        />
      </div>

       <h1 className="pt-20 text-center text-4xl text-white">Selecione seu Baralho, {usuario}</h1>

      <div className="w-[50%] max-h-[65vh] overflow-y-auto inventory-scrollbar grid grid-cols-3 gap-6 justify-items-center mx-auto mt-10">
        {baralhos.map((baralho) => {
        const selecionadoAtual = selecionado == baralho.id;

        return (
            <Baralho
            key={baralho.id}
            texto={baralho.nome}
            onClick={() => setSelecionado(baralho.id)}
            corDeFundo={selecionadoAtual ? "#C8911A" : "#21366B"}
            corDaBorda={selecionadoAtual ? "#C8911A" : "#686868"}
            corDoTexto={selecionadoAtual ? "#000000" : "#FFFFFF"}
            className="w-full text-center"
            />
        );
        })}
      </div>

       <div className="flex justify-center">
            <Botao
                texto="Continuar"
                className="absolute bottom-15 w-50 cursor-pointer  h-14 text-3xl place-content-center bg-blue-900 rounded-md border-3 border-amber-400 hover:scale-105 transition-all"
                onClick={() => router.push("")}
            ></Botao>
        </div>

      
    </main>
  );
}
