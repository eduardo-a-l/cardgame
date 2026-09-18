"use client";

import { useRouter } from "next/navigation";
import { BotaoIcone } from "@/components/ui/BotaoIcone";

interface BarraLateralProps {
  corDeFundo?: string;
  corDaBorda?: string;
}

export function BarraLateral({
  corDeFundo = "#C8911A",
  corDaBorda = "#000000",
}: BarraLateralProps) {
  const router = useRouter();

  return (
    <aside
      className="w-16 h-screen flex flex-col justify-between items-center py-4 border-r text-black"
      style={{
        backgroundColor: corDeFundo,
        borderColor: corDaBorda,
      }}
    >
      <div className="flex flex-col gap-3">
        <BotaoIcone nomeIcone="leaderboard" onClick={() => ""} />
        <BotaoIcone nomeIcone="usuario" onClick={() => router.push("/login")} />
      </div>

      <BotaoIcone
        nomeIcone="configuracoes"
        onClick={() => router.push("/configuracoes")}
      />
    </aside>
  );
}
