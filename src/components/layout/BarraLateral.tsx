"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BotaoIcone } from "@/components/ui/BotaoIcone";
import Image from "next/image";

interface BarraLateralProps {
  corDeFundo?: string;
  corDaBorda?: string;
}

interface Usuario {
  IDUSUARIO: number;
  NOMEUSUARIO: string;
  FOTOPERFIL: string | null;
}

export function BarraLateral({
  corDeFundo = "#C8911A",
  corDaBorda = "#000000",
}: BarraLateralProps) {
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    async function carregarUsuario() {
      try {
        const usuarioSalvo = localStorage.getItem("usuario");

        if (!usuarioSalvo) {
          setUsuario(null);
          return;
        }

        const usuarioLocal = JSON.parse(usuarioSalvo);

        const response = await fetch(
          `http://localhost:8081/Usuarios/${usuarioLocal.idUsuario}`
        );

        if (!response.ok) {
          setUsuario(null);
          return;
        }

        const dados: Usuario = await response.json();

        setUsuario(dados);
      } catch (erro) {
        console.error(erro);
        setUsuario(null);
      }
    }

    carregarUsuario();

    const atualizarUsuario = () => {
      carregarUsuario();
    };

    window.addEventListener("usuarioAtualizado", atualizarUsuario);

    return () => {
      window.removeEventListener("usuarioAtualizado", atualizarUsuario);
    };
  }, []);

  return (
    <aside
      className="w-16 h-screen flex flex-col justify-between items-center py-4 border-r text-black"
      style={{
        backgroundColor: corDeFundo,
        borderColor: corDaBorda,
      }}
    >
      <div className="flex flex-col gap-3 items-center">
        <BotaoIcone
          nomeIcone="leaderboard"
          onClick={() => router.push("/leaderboard")}
        />

        {usuario ? (
          <button
            type="button"
            onClick={() => router.push("/perfil")}
            className="flex flex-col items-center gap-1 w-14"
          >
            {usuario.FOTOPERFIL ? (
              <Image
                src={`http://localhost:8081${usuario.FOTOPERFIL}`}
                alt="Foto de perfil"
                width={40}
                height={40}
                unoptimized
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-500" />
            )}

            <span className="w-16 truncate text-[10px] font-semibold">
              {usuario.NOMEUSUARIO}
            </span>
          </button>
        ) : (
          <BotaoIcone
            nomeIcone="usuario"
            onClick={() => router.push("/login")}
          />
        )}
      </div>

      <BotaoIcone
        nomeIcone="configuracoes"
        onClick={() => router.push("/configuracoes")}
      />
    </aside>
  );
}