"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";

export default function TelaConfiguracoes() {
  const router = useRouter();

  const [erro, setErro] = useState("");
  const [deletando, setDeletando] = useState(false);

  function sairDaConta() {
    localStorage.removeItem("usuario");
    router.push("/");
  }

  async function deletarConta() {
    const usuarioSalvo = localStorage.getItem("usuario");

    if (!usuarioSalvo) {
      router.push("/");
      return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    const confirmar = window.confirm(
      "Tem certeza que deseja deletar sua conta? Essa ação não pode ser desfeita."
    );

    if (!confirmar) {
      return;
    }

    setErro("");
    setDeletando(true);

    try {
      const response = await fetch(
        `http://localhost:8081/Usuarios/${usuario.idUsuario}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 404) {
        localStorage.removeItem("usuario");
        router.push("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao deletar conta");
      }

      localStorage.removeItem("usuario");

      router.push("/");
    } catch (erro) {
      console.error(erro);
      setErro("Não foi possível deletar a conta.");
    } finally {
      setDeletando(false);
    }
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
        Configurações
      </h1>

      {erro && (
        <p className="absolute bottom-40 left-15 text-red-400 text-xl">
          {erro}
        </p>
      )}

      <div className="absolute left-15 bottom-15 flex flex-col gap-6">
        <Botao
          texto={deletando ? "Deletando..." : "Deletar Conta"}
          corDoTexto="#FFFFFF"
          className="px-20 py-6 text-3xl"
          onClick={deletarConta}
        />

        <Botao
          texto="Sair da Conta"
          corDoTexto="#FFFFFF"
          className="px-20 py-6 text-3xl"
          onClick={sairDaConta}
        />
      </div>
    </main>
  );
}