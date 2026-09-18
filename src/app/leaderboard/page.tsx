"use client";

import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import { Icone } from "@/components/ui/Icone";

export default function TelaLeaderboard() {
  const router = useRouter();

  const jogadores = [
    { usuario: "Usuário01", pontos: 1064, moedas: 436 },
    { usuario: "Usuário02", pontos: 1064, moedas: 1800 },
    { usuario: "Usuário03", pontos: 1016, moedas: 315 },
    { usuario: "Usuário04", pontos: 1000, moedas: 40 },
    { usuario: "Usuário05", pontos: 1000, moedas: 70 },
    { usuario: "Usuário06", pontos: 928, moedas: 21 },
    { usuario: "Usuário07", pontos: 928, moedas: 5 },
    { usuario: "Usuário08", pontos: 22, moedas: 5 },
  ];

  const jogadoresOrdenados = [...jogadores].sort(
    (a, b) => b.pontos - a.pontos
  );

  let posicaoAnterior = 0;
  let pontosAnteriores = 0;

  const ranking = jogadoresOrdenados.map((jogador, index) => {
    const posicao =
      jogador.pontos === pontosAnteriores
        ? posicaoAnterior
        : index + 1;

    posicaoAnterior = posicao;
    pontosAnteriores = jogador.pontos;

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
    <main className="relative flex h-screen flex-col bg-[#1B1B2F] overflow-hidden">
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

    <div className="divRanking inventory-scrollbar min-h-0 flex-1 overflow-y-auto pt-20">
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
          {ranking.map((jogador, index) => (
            <tr key={index}>
              <td className={corPosicao(jogador.posicao)}>
                {jogador.posicao}º
              </td>
              <td>{jogador.usuario}</td>
              <td>{jogador.pontos}</td>
              <td>{jogador.moedas}G</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </main>
  );
}