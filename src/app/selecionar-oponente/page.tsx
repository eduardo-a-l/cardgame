"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Back from "@/components/ui/icons/Back";
import { Botao } from "@/components/ui/Botao";

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
        <button
          className="w-44 h-12 hover:scale-105 transition-all flex justify-center cursor-pointer text-white text-4xl absolute top-10 left-8 gap-2.5"
          onClick={() => router.push("/")}
        >
          <Back className="h-11 w-11" /> Voltar
        </button>
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
      return;
    }

    if (!pin) {
      setErro("Digite o PIN do oponente.");
      return;
    }

    const pinEsperado = oponenteSelecionado.pinBatalha ?? 0;
    const pinDigitado = Number(pin);

    if (isNaN(pinDigitado) || pinDigitado !== pinEsperado) {
      setErro("PIN incorreto para o oponente selecionado.");
      return;
    }

    router.push(
      `/selecionar-baralho?p1=${usuarioLogadoId}&p2=${oponenteSelecionado.idUsuario}`
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen min-w-screen flex justify-center">
      <div className="bg-blue flex flex-col min-h-screen max-w-full w-full relative shadow-black shadow-2xl">
        <button
          className="w-44 h-12 hover:scale-105 transition-all flex justify-center cursor-pointer text-white text-4xl ml-8 mt-10 gap-2.5"
          onClick={() => router.push("/")}
        >
          <Back className="h-11 w-11" /> Voltar
        </button>

        <div className="flex justify-center">
          <p className="text-5xl text-white mt-13">Selecionar oponente</p>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between pr-15 pl-15 w-full text-3xl mt-40">
            <p className="text-white">Usuário</p>
            <p className="text-white">PIN de Batalha</p>
          </div>

          <div className="flex justify-between pr-15 pl-15">
            <div className="relative">
              <input
                type="text"
                readOnly
                value={oponenteSelecionado?.nomeUsuario || "Escolher Oponente"}
                className={`border border-gray-500 w-100 pl-2 h-10 ${
                  !oponenteSelecionado ? "text-gray-400" : "text-white"
                }`}
              />
              <button
                className="absolute right-0 pr-2.5 pt-2 cursor-pointer text-white hover:scale-105 transition-all"
                onClick={() => setAberto(!aberto)}
              >
                {aberto ? "▼" : "▲"}
              </button>
              {aberto && (
                <ul className="absolute right-0 w-100 bg-gray-900 transition-all shadow-black shadow-2xl border-b border-r border-l border-gray-500 z-20 max-h-60 overflow-y-auto">
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
              type="text"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="bg-blue-800 border border-white text-white rounded-md pl-2 h-10 w-100"
            />
          </div>

          {erro && (
            <p className="text-red-400 text-center text-xl mt-6">{erro}</p>
          )}

          <div className="flex justify-center">
            <Botao
              texto="Continuar"
              className="w-50 cursor-pointer h-14 text-3xl place-content-center bg-blue-900 rounded-md border-3 border-amber-400 mt-50 hover:scale-105 transition-all flex items-center justify-center"
              onClick={handleContinuar}
            />
          </div>
        </div>
      </div>
    </div>
  );
}