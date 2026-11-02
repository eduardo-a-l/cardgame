"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import { Baralho as CardBaralho } from "@/components/ui/Baralho";
import Modal from "@/components/layout/Modal";

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
  const [erroServidor, setErroServidor] = useState<boolean>(false);
	const [tituloErro, setTituloErro] = useState<string>("");
	const [mostrarErro, setMostrarErro] = useState<boolean>(false)

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
        if (!respUser.ok) {
          throw new Error("Erro de conexão");
        }
        const userObj = await respUser.json();
        setNomeUsuario(userObj.nomeUsuario);

        const respBaralhos = await fetch(
          `http://localhost:8081/Baralhos/${usuarioIdAtivo}`
        );
        if (!respBaralhos.ok) {
          throw new Error("Erro de conexão");
        }
        const baralhosObj = await respBaralhos.json();
        setBaralhos(baralhosObj);
      } catch (err) {
        console.error(err);
        setErroServidor(true);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [usuarioIdAtivo, router]);

  function handleContinuar() {
    if (!selecionado) {
      setErro("Selecione um baralho para continuar.");
      setTituloErro("Baralho não selecionado");
      setMostrarErro(true)
      return;
    }

    if (!deck1) {
      router.push(
        `/selecionar-baralho?p1=${p1}&p2=${p2}&deck1=${selecionado}`
      );
    } else {
      sessionStorage.setItem(
        "configuracaoBatalha",
        JSON.stringify({
            p1,
            p2,
            deck1,
            selecionado
        })
      );

      router.push("/batalha");
    }
  }

  if (erroServidor) {
    return (
      <main className="relative h-screen bg-[#1B1B2F] flex items-center justify-center p-4">
        <div className="absolute top-10 left-10 z-10">
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
        <p className="text-white text-2xl text-center">
          Não foi possível conectar-se com o servidor
        </p>
      </main>
    );
  }

  if (carregando) {
    return (
      <main className="relative h-screen bg-[#1B1B2F] flex items-center justify-center">
        <p className="text-white text-2xl">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="relative h-screen bg-[#1B1B2F] overflow-hidden flex flex-col items-center">
      <div className="absolute top-10 left-10 z-10">
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

      <h1 className="text-[clamp(36px,3.125vw,60px)] mt-10 tall:mt-30 text-center">
        Selecione seu Baralho, {nomeUsuario || "Jogador"}
      </h1>

      {baralhos.length === 0 ? (
        <p className="text-white text-center text-xl mt-10 mb-40">
          Nenhum baralho encontrado para este usuário.
        </p>
      ) : (
        <div className="w-[50%] h-[48vh] overflow-y-auto inventory-scrollbar grid grid-cols-2 gap-16 justify-items-center mx-auto mt-16 p-2 pl-3 pr-3">
          {baralhos.map((baralho) => {
            const selecionadoAtual = selecionado === baralho.idBaralho;

            return (
              <CardBaralho
                key={baralho.idBaralho}
                texto={baralho.nome}
                raio={23}
                onClick={() => {
                  setErro("");
                  setSelecionado(baralho.idBaralho);
                }}
                corDeFundo={selecionadoAtual ? "#C8911A" : "#21366B"}
                corDaBorda={selecionadoAtual ? "#C8911A" : "#686868"}
                corDoTexto={selecionadoAtual ? "#000000" : "#FFFFFF"}
                className={`w-full h-[92px] text-center loja-hover ${!selecionadoAtual ? "[-webkit-text-stroke:0.6px_#686868]" : ""}`}
              />
            );
          })}
        </div>
      )}

      <div className="flex justify-center mt-[5vh] tall:mt-[9vh]">
        <Botao
          texto="Continuar"
          raio={23}
          className="cursor-pointer w-[clamp(300px,20.833vw,400px)] h-[100px] text-[clamp(32px,2.708vw,52px)] rounded-md border-5 hover:scale-105 transition-all flex items-center justify-center"
          onClick={handleContinuar}
        />
      </div>
			<Modal
                aberto={mostrarErro}
                titulo={tituloErro}
                mensagem={erro}
                tipo={"erro"}
                onFechar={() => setMostrarErro(false)}
            />
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