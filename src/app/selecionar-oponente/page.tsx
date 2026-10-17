"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import Modal from "@/components/layout/Modal";

interface Usuario {
  idUsuario: number;
  nomeUsuario: string;
  pinBatalha?: number;
  PinBatalha?: number;
}

export default function Selecionar_oponente() {
  const router = useRouter();
  const [oponentes, setOponentes] = useState<Usuario[]>([]);
  const [oponenteSelecionado, setOponenteSelecionado] = useState<Usuario | null>(null);
  const [usuarioLogadoId, setUsuarioLogadoId] = useState<number | null>(null);
  const [aberto, setAberto] = useState(false);
  const [pin, setPin] = useState("");
  const [erro, setErro] = useState("");
  const [erroServidor, setErroServidor] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      const usuarioSalvo = localStorage.getItem("usuario");
      if (!usuarioSalvo) {
        router.push("/login");
        return;
      }

      const usuarioLocal = JSON.parse(usuarioSalvo);

      try {
        const response = await fetch("http://localhost:8081/Usuarios");
        if (!response.ok) {
          throw new Error("Erro ao carregar oponentes");
        }
        const dados: Usuario[] = await response.json();
        const filtrados = dados
          .filter((u) => u.idUsuario !== usuarioLocal.idUsuario)
          .map((u) => ({
            ...u,
            pinBatalha: u.pinBatalha ?? u.PinBatalha ?? 0,
          }));

        setUsuarioLogadoId(usuarioLocal.idUsuario);
        setOponentes(filtrados);
      } catch (err) {
        console.error(err);
        setErroServidor(true);
      }
    }

    carregarDados();
  }, [router]);

  if (erroServidor) {
    return (
      <div className="bg-gray-900 min-h-screen min-w-screen flex items-center justify-center relative">
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
      </div>
    );
  }

  function handleContinuar() {
    setErro("");

    if (!oponenteSelecionado) {
      setErro("Selecione um oponente.");
      setModalAberto(true)
      return;
    }

    if (!pin) {
      setErro("Digite o PIN do oponente.");
      setModalAberto(true)
      return;
    }

    const pinEsperado = oponenteSelecionado.pinBatalha ?? 0;
    const pinDigitado = Number(pin);

    if (isNaN(pinDigitado) || pinDigitado !== pinEsperado) {
      setErro("PIN incorreto para o oponente selecionado.");
      setModalAberto(true)
      return;
    }

    router.push(
      `/selecionar-baralho?p1=${usuarioLogadoId}&p2=${oponenteSelecionado.idUsuario}`
    );
  }

  return (
    <main className="bg-gray-900 min-h-screen min-w-screen flex justify-center">
      <div className="bg-blue flex flex-col min-h-screen max-w-full w-full relative shadow-black shadow-2xl">
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

        <div className="flex justify-center">
          <p className="text-[clamp(36px,3.125vw,60px)] mt-5 tall:mt-13">Selecionar Oponente</p>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between pr-15 pl-15 pb-5 w-full text-[clamp(24px,2.083vw,40px)] mt-35 tall:mt-40">
            <p className="text-white">Usuário</p>
            <p className="text-white">PIN de Batalha</p>
          </div>

          <div className="flex justify-between pr-15 pl-15">
            <div className="relative flex items-center">
              <input
                type="text"
                readOnly
                value={oponenteSelecionado?.nomeUsuario || "Procurar Usuário"}
                className={`border-[5px] border-[#686868] w-[clamp(300px,36.458vw,700px)] pl-3 h-[clamp(40px,6.878vh,65px)] rounded-[5px] text-[clamp(16px,1.302vw,25px)] ${
                  !oponenteSelecionado ? "text-gray-400" : "text-white"
                }`}
              />
              <button
                className="absolute right-0 pr-4.5 cursor-pointer text-white hover:scale-105 transition-all text-center text-[20px]"
                onClick={() => setAberto(!aberto)}
              >
                {aberto ? "▼" : "▲"}
              </button>
              {aberto && (
                <ul className="absolute right-0 top-16 w-60 bg-gray-900 transition-all shadow-black shadow-2xl border-b border-r border-l border-gray-500 z-20 max-h-60 overflow-y-auto">
                  {oponentes.map((user) => (
                    <li
                      key={user.idUsuario}
                      className="pl-3.5 py-1 cursor-pointer hover:border-2 hover:border-white text-white transition-all border-b border-b-gray-500"
                      onClick={() => {
                        setAberto(false);
                        setOponenteSelecionado(user);
                      }}
                    >
                      {user.nomeUsuario}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <input
              placeholder="Digite o PIN"
              type="number"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="bg-[#21366B] border border-white text-white text-[clamp(16px,1.302vw,25px)] rounded-md pl-4 h-[clamp(40px,6.878vh,65px)] w-[clamp(300px,36.458vw,700px)]"
            />
          </div>

          <div className="flex justify-center">
            <Botao
              texto="Continuar"
              className="cursor-pointer w-[clamp(300px,20.833vw,400px)] h-[100px] text-[clamp(32px,2.708vw,52px)] rounded-md border-5 mt-[20vh] tall:mt-[30vh] hover:scale-105 transition-all flex items-center justify-center"
              onClick={handleContinuar}
            />
          </div>
        </div>
      </div>
      <Modal
                aberto={modalAberto}
                titulo={"Erro na seleção"}
                mensagem={erro}
                tipo={"erro"}
                onFechar={() => setModalAberto(false)}
      />
    </main>
  );
}