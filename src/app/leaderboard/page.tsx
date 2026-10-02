"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import { FotoPerfil } from "@/components/ui/FotoPerfil";

interface Jogador {
  IDUSUARIO: number;
  NOMEUSUARIO: string;
  PONTOS: number;
  MOEDAS: number;
}

export default function TelaLeaderboard() {
  const router = useRouter();

  const [jogadores, setJogadores] = useState<Jogador[]>([]);

  useEffect(() => {
    async function carregarRanking() {
      try {
        const response = await fetch("http://localhost:8081/Usuarios/ranking");

        if (!response.ok) {
          throw new Error("Erro ao buscar ranking");
        }

        const dados: Jogador[] = await response.json();

        setJogadores(dados);
      } catch (erro) {
        console.error(erro);
      }
    }

    carregarRanking();
  }, []);

  const jogadoresOrdenados = [...jogadores].sort(
    (a, b) => b.PONTOS - a.PONTOS
  );

  const ranking = jogadoresOrdenados.map((jogador, index, jogadores) => {
    const posicao =
      jogadores.findIndex(
        (outroJogador) => outroJogador.PONTOS === jogador.PONTOS
      ) + 1;

    return {
      ...jogador,
      posicao,
    };
  });

  const corPosicao = (posicao: number) => {
    if (posicao === 1) return "text-[#FFD700]";
    if (posicao === 2) return "text-[#C0C0C0]";
    if (posicao === 3) return "text-[#CD7F32]";
    return "text-white";
  };

  return (
    <main className="relative min-h-screen bg-[#1B1B2F]">
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
        Leaderboard
      </h1>

      <div className="divRanking inventory-scrollbar pt-20 pb-20 overflow-x-auto">
        <table className="ranking">
          <thead>
            <tr>
              <th>Posição</th>
              <th>Nome de Usuário</th>
              <th>Pontos</th>
              <th>Moedas</th>
            </tr>
          </thead>

          <tbody>
            {ranking.map((jogador) => (
              <tr key={jogador.IDUSUARIO}>
                <td className={corPosicao(jogador.posicao)}>
                  {jogador.posicao}º
                </td>

                <td>
                  <div className="flex items-center gap-3">
                    <FotoPerfil idUsuario={jogador.IDUSUARIO} />

                    <span>{jogador.NOMEUSUARIO}</span>
                  </div>
                </td>

                <td>{jogador.PONTOS}</td>
                <td>{jogador.MOEDAS}G</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}