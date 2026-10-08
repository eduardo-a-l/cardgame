"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import { Baralho as CardBaralho } from "@/components/ui/Baralho";

interface BaralhoData {
  idBaralho: number;
  nome: string;
}

function SelecionarBaralhoConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const p1 = searchParams.get("p1");
  const p2 = searchParams.get("p2");
  const deck1 = searchParams.get("deck1");

  const usuarioIdAtivo = !deck1 ? p1 : p2;

  const [nomeUsuario, setNomeUsuario] = useState<string>("");
  const [baralhos, setBaralhos] = useState<BaralhoData[]>([]);
  const [selecionado, setSelecionado] = useState<number | null>(null);
  const [erro, setErro] = useState<string>("");
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    if (!usuarioIdAtivo) {
      router.push("/selecionar-oponente");
      return;
    }

    async function carregarDados() {
      setCarregando(true);
      setErro("");
      try {
        const respUser = await fetch(
          `http://localhost:8081/Usuarios/${usuarioIdAtivo}`
        );
        if (respUser.ok) {
          const userObj = await respUser.json();
          setNomeUsuario(userObj.nomeUsuario);
        }

        const respBaralhos = await fetch(
          `http://localhost:8081/Baralhos/${usuarioIdAtivo}`
        );
        if (respBaralhos.ok) {
          const baralhosObj = await respBaralhos.json();
          setBaralhos(baralhosObj);
        } else {
          setBaralhos([]);
        }
      } catch (err) {
        console.error(err);
        setErro("Não foi possível carregar os baralhos.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [usuarioIdAtivo, router]);

  function handleContinuar() {
    if (!selecionado) {
      setErro("Selecione um baralho para continuar.");
      return;
    }

    if (!deck1) {
      router.push(
        `/selecionar-baralho?p1=${p1}&p2=${p2}&deck1=${selecionado}`
      );
    } else {
      router.push("/");
    }
  }

  if (carregando) {
    return (
      <main className="relative h-screen bg-[#1B1B2F] flex items-center justify-center">
        <p className="text-white text-2xl">Carregando...</p>
      </main>
    );
  }

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

      <h1 className="pt-20 text-center text-4xl text-white">
        Selecione seu Baralho, {nomeUsuario || "Jogador"}
      </h1>

      {erro && (
        <p className="text-red-400 text-center text-xl mt-4">{erro}</p>
      )}

      {baralhos.length === 0 ? (
        <p className="text-white text-center text-xl mt-10">
          Nenhum baralho encontrado para este usuário.
        </p>
      ) : (
        <div className="w-[50%] max-h-[60vh] overflow-y-auto inventory-scrollbar grid grid-cols-3 gap-6 justify-items-center mx-auto mt-10 p-2">
          {baralhos.map((baralho) => {
            const selecionadoAtual = selecionado === baralho.idBaralho;

            return (
              <CardBaralho
                key={baralho.idBaralho}
                texto={baralho.nome}
                onClick={() => {
                  setErro("");
                  setSelecionado(baralho.idBaralho);
                }}
                corDeFundo={selecionadoAtual ? "#C8911A" : "#21366B"}
                corDaBorda={selecionadoAtual ? "#C8911A" : "#686868"}
                corDoTexto={selecionadoAtual ? "#000000" : "#FFFFFF"}
                className="w-full text-center"
              />
            );
          })}
        </div>
      )}

      <div className="flex justify-center">
        <Botao
          texto="Continuar"
          className="absolute bottom-15 w-50 cursor-pointer h-14 text-3xl place-content-center bg-blue-900 rounded-md border-3 border-amber-400 hover:scale-105 transition-all"
          onClick={handleContinuar}
        />
      </div>
    </main>
  );
}

export default function TelaSelecionarBaralho() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1B1B2F] text-white flex items-center justify-center">
          Carregando...
        </div>
      }
    >
      <SelecionarBaralhoConteudo />
    </Suspense>
  );
}