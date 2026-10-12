"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Back from "@/components/ui/Back/Back";

interface Carta {
  IdCarta: number;
  Nome: string;
  Tipo: string;
  Raridade: string;
}

interface ItemInventario {
  IdInventario: number;
  IdUsuario: number;
  IdCarta: number;
  Carta: Carta;
}

interface Baralho {
  idBaralho: number;
  nome: string;
  idUsuario: number;
  Inventarios: ItemInventario[];
}

export default function MeusBaralhosPage() {
  const router = useRouter();

  const [baralhos, setBaralhos] = useState<Baralho[]>([]);
  const [selecionado, setSelecionado] = useState<number | null>(null);
  const [erro, setErro] = useState<string>("");
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erroServidor, setErroServidor] = useState<boolean>(false);

  useEffect(() => {
    async function carregarBaralhos() {
      try {
        const usuarioSalvo = localStorage.getItem("usuario");

        if (!usuarioSalvo) {
          router.push("/login");
          return;
        }

        const usuario = JSON.parse(usuarioSalvo);

        const response = await fetch(
          `http://localhost:8081/Baralhos/${usuario.idUsuario}`
        );

        if (!response.ok) {
          throw new Error("Erro de conexão com a API");
        }

        const dados: Baralho[] = await response.json();
        setBaralhos(dados);
      } catch (err) {
        console.error(err);
        setErroServidor(true);
      } finally {
        setCarregando(false);
      }
    }

    carregarBaralhos();
  }, [router]);

  async function handleExcluir() {
    if (!selecionado) {
      setErro("Selecione um baralho para excluir.");
      return;
    }

    const confirmar = window.confirm("Deseja realmente excluir este baralho?");
    if (!confirmar) return;

    setErro("");

    try {
      const response = await fetch(
        `http://localhost:8081/Baralhos/${selecionado}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao excluir o baralho");
      }

      setBaralhos((prev) => prev.filter((b) => b.idBaralho !== selecionado));
      setSelecionado(null);
    } catch (err) {
      console.error(err);
      setErro("Não foi possível excluir o baralho.");
    }
  }

  function handleEditar() {
    if (!selecionado) {
      setErro("Selecione um baralho para editar.");
      return;
    }

    router.push(`/montar-baralho?id=${selecionado}`);
  }

  if (erroServidor) {
    return (
      <div className="flex flex-col bg-custom-blue items-center w-full min-h-screen relative justify-center p-4">
        <button
          onClick={() => router.push("/")}
          className="flex justify-center w-40 h-10 cursor-pointer hover:scale-105 transition-all gap-1.5 text-4xl mt-10 ml-10 absolute left-0 top-0 text-white"
        >
          <Back />
          Voltar
        </button>

        <p className="text-white text-2xl text-center">
          Não foi possível conectar-se com o servidor
        </p>
      </div>
    );
  }

  if (carregando) {
    return (
      <div className="flex flex-col bg-custom-blue items-center justify-center w-full min-h-screen relative text-white">
        <p className="text-2xl">Carregando...</p>
      </div>
    );
  }

  const metade = Math.ceil(baralhos.length / 2);
  const coluna1 = baralhos.slice(0, metade);
  const coluna2 = baralhos.slice(metade);

  return (
    <div className="flex flex-col bg-custom-blue items-center w-full min-h-screen relative">
      <button
        onClick={() => router.push("/")}
        className="flex justify-center w-40 h-10 cursor-pointer hover:scale-105 transition-all gap-1.5 text-4xl mt-10 ml-10 absolute left-0 top-0 text-white"
      >
        <Back />
        Voltar
      </button>

      <div className="flex flex-col mt-22">
        <p className="text-3xl mb-12 text-white">Meus Baralhos</p>
      </div>

      {erro && <p className="text-red-400 text-xl mb-4">{erro}</p>}

      {baralhos.length === 0 ? (
        <p className="text-white text-xl my-10">
          Você ainda não possui nenhum baralho criado.
        </p>
      ) : (
        <div className="flex justify-center w-screen overflow-auto pl-40 gap-10">
          <div className="flex flex-col justify-start w-90 h-96 overflow-auto">
            {coluna1.map((baralho) => {
              const estaSelecionado = selecionado === baralho.idBaralho;
              return (
                <button
                  key={baralho.idBaralho}
                  onClick={() => {
                    setErro("");
                    setSelecionado(baralho.idBaralho);
                  }}
                  className={`border-2 rounded-md transition-all hover:scale-105 cursor-pointer w-40 h-11 ml-3 text-2xl mt-5 text-white ${
                    estaSelecionado
                      ? "bg-[#C8911A] border-amber-300 font-bold"
                      : "bg-blue-950 border-gray-500"
                  }`}
                >
                  <p>{baralho.nome}</p>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col justify-start w-90 h-96 overflow-auto">
            {coluna2.map((baralho) => {
              const estaSelecionado = selecionado === baralho.idBaralho;
              return (
                <button
                  key={baralho.idBaralho}
                  onClick={() => {
                    setErro("");
                    setSelecionado(baralho.idBaralho);
                  }}
                  className={`border-2 rounded-md transition-all hover:scale-105 cursor-pointer w-40 h-11 ml-3 text-2xl mt-5 text-white ${
                    estaSelecionado
                      ? "bg-[#C8911A] border-amber-300 font-bold"
                      : "bg-blue-950 border-gray-500"
                  }`}
                >
                  <p>{baralho.nome}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex w-full mt-8 justify-center items-center">
        <button
          onClick={handleEditar}
          className="flex flex-col items-center w-50 pt-1 h-13 cursor-pointer hover:scale-105 transition-all bg-blue-950 rounded-md border-2 border-amber-500 text-3xl ml-auto text-white"
        >
          <p>Editar</p>
        </button>

        <button
          onClick={handleExcluir}
          className="flex flex-col items-center w-50 h-13 cursor-pointer hover:scale-105 transition-all bg-blue-950 rounded-md border-2 border-amber-500 text-3xl pt-1 ml-24 mr-auto text-white"
        >
          <p>Excluir</p>
        </button>
      </div>

      <button
        onClick={() => router.push("/montar-baralho")}
        className="flex flex-col items-center w-60 h-13 cursor-pointer hover:scale-105 transition-all bg-blue-950 rounded-md border-2 border-amber-500 text-3xl pt-1 mt-10 mb-10 text-white"
      >
        <p>+ Criar Novo</p>
      </button>
    </div>
  );
}