"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Back from "@/components/ui/Back/Back";

interface Carta {
  idInventario: number;
  idUsuario: number;
  idCarta: number;
  nome: string;
  tipo: string;
  raridade: string;
  precoPadrao: number;
  vida: number | null;
  acao1: string | null;
  acao2: string | null;
}

interface ItemInventarioAPI {
  IdInventario?: number;
  idInventario?: number;
  IdCarta?: number;
  idCarta?: number;
  Carta?: {
    IdCarta?: number;
    idCarta?: number;
    Nome?: string;
    nome?: string;
    Tipo?: string;
    tipo?: string;
    Raridade?: string;
    raridade?: string;
    PrecoPadrao?: number;
    precoPadrao?: number;
    Vida?: number | null;
    vida?: number | null;
    Acao1?: string | null;
    acao1?: string | null;
    Acao2?: string | null;
    acao2?: string | null;
  };
}

interface BaralhoAPI {
  idBaralho: number;
  nome: string;
  idUsuario: number;
  Inventarios: ItemInventarioAPI[];
}

function MontarBaralhoConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idBaralhoParam = searchParams.get("id");

  const [inventario, setInventario] = useState<Carta[]>([]);
  const [baralhoAtual, setBaralhoAtual] = useState<Carta[]>([]);
  const [nomeBaralho, setNomeBaralho] = useState<string>("Meu Baralho");
  const [carregando, setCarregando] = useState<boolean>(true);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [erroServidor, setErroServidor] = useState<boolean>(false);
  const [mensagemErro, setMensagemErro] = useState<string>("");

  useEffect(() => {
    async function carregarDados() {
      try {
        const usuarioSalvo = localStorage.getItem("usuario");

        if (!usuarioSalvo) {
          router.push("/login");
          return;
        }

        const usuario = JSON.parse(usuarioSalvo);

        const respInv = await fetch(
          `http://localhost:8081/Inventario/${usuario.idUsuario}`
        );

        if (!respInv.ok) {
          throw new Error("Erro de conexão");
        }

        const dadosInv: Carta[] = await respInv.json();
        setInventario(dadosInv);

        if (idBaralhoParam) {
          const respBaralhos = await fetch(
            `http://localhost:8081/Baralhos/${usuario.idUsuario}`
          );

          if (!respBaralhos.ok) {
            throw new Error("Erro de conexão");
          }

          const dadosBaralhos: BaralhoAPI[] = await respBaralhos.json();
          const baralhoEncontrado = dadosBaralhos.find(
            (b) => b.idBaralho === Number(idBaralhoParam)
          );

          if (baralhoEncontrado) {
            setNomeBaralho(baralhoEncontrado.nome);

            const cartasDoBaralho: Carta[] = [];

            if (
              baralhoEncontrado.Inventarios &&
              baralhoEncontrado.Inventarios.length > 0
            ) {
              baralhoEncontrado.Inventarios.forEach((item) => {
                const idInvItem = item.idInventario ?? item.IdInventario;
                const idCartaItem =
                  item.idCarta ??
                  item.IdCarta ??
                  item.Carta?.idCarta ??
                  item.Carta?.IdCarta;

                const encontradoNoInv = dadosInv.find(
                  (c) =>
                    (idInvItem && c.idInventario === idInvItem) ||
                    (c.idCarta === idCartaItem &&
                      !cartasDoBaralho.some(
                        (cb) => cb.idInventario === c.idInventario
                      ))
                );

                if (encontradoNoInv) {
                  cartasDoBaralho.push(encontradoNoInv);
                } else if (item.Carta) {
                  cartasDoBaralho.push({
                    idInventario: idInvItem || 0,
                    idUsuario: usuario.idUsuario,
                    idCarta: idCartaItem || 0,
                    nome: item.Carta.nome ?? item.Carta.Nome ?? "Carta",
                    tipo: item.Carta.tipo ?? item.Carta.Tipo ?? "",
                    raridade: item.Carta.raridade ?? item.Carta.Raridade ?? "",
                    precoPadrao:
                      item.Carta.precoPadrao ?? item.Carta.PrecoPadrao ?? 0,
                    vida: item.Carta.vida ?? item.Carta.Vida ?? null,
                    acao1: item.Carta.acao1 ?? item.Carta.Acao1 ?? null,
                    acao2: item.Carta.acao2 ?? item.Carta.Acao2 ?? null,
                  });
                }
              });
            }

            setBaralhoAtual(cartasDoBaralho);
          }
        }
      } catch (err) {
        console.error(err);
        setErroServidor(true);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [router, idBaralhoParam]);

  function adicionarCarta(carta: Carta) {
    if (baralhoAtual.length >= 20) {
      setMensagemErro("O baralho não pode conter mais de 20 cartas.");
      return;
    }

    setMensagemErro("");
    setBaralhoAtual((prev) => [...prev, carta]);
  }

  function removerCarta(indexParaRemover: number) {
    setMensagemErro("");
    setBaralhoAtual((prev) =>
      prev.filter((_, index) => index !== indexParaRemover)
    );
  }

  async function handleSalvar() {
    if (!nomeBaralho.trim()) {
      setMensagemErro("Por favor, digite um nome para o baralho.");
      return;
    }

    const usuarioSalvo = localStorage.getItem("usuario");
    if (!usuarioSalvo) {
      router.push("/login");
      return;
    }

    const usuario = JSON.parse(usuarioSalvo);
    setSalvando(true);
    setMensagemErro("");

    try {
      let targetIdBaralho = idBaralhoParam ? Number(idBaralhoParam) : null;

      if (!targetIdBaralho) {
        const respNovo = await fetch("http://localhost:8081/Baralhos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: nomeBaralho,
            idUsuario: usuario.idUsuario,
          }),
        });

        if (!respNovo.ok) {
          throw new Error("Erro ao criar baralho");
        }

        const novoBaralho = await respNovo.json();
        targetIdBaralho = novoBaralho.idBaralho;
      }

      const payload = {
        nome: nomeBaralho,
        inventarios: baralhoAtual.map((c) => ({
          idInventario: c.idInventario,
        })),
      };

      const respUpdate = await fetch(
        `http://localhost:8081/Baralhos/${targetIdBaralho}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!respUpdate.ok) {
        throw new Error("Erro ao salvar cartas do baralho");
      }

      router.push("/meus-baralhos");
    } catch (err) {
      console.error(err);
      setMensagemErro("Não foi possível salvar o baralho.");
    } finally {
      setSalvando(false);
    }
  }

  function getEstiloCarta(raridade: string, tipo: string) {
    const cardBase =
      "w-20 h-32 md:w-24 md:h-36 rounded-2xl flex flex-col items-center justify-center transition-all p-1 text-center select-none";

    if (raridade === "Raro" || tipo === "Mágica") {
      return `${cardBase} bg-[#4f1e73] border-2 border-[#7731a8] text-white hover:scale-105 cursor-pointer`;
    }

    if (raridade === "Incomum" || tipo === "Equipamento") {
      return `${cardBase} bg-[#1c5d36] border-2 border-[#2a8750] text-white hover:scale-105 cursor-pointer`;
    }

    return `${cardBase} bg-[#1d386b] border-2 border-[#315699] text-white hover:scale-105 cursor-pointer`;
  }

  if (erroServidor) {
    return (
      <div className="flex flex-col bg-custom-blue items-center w-full min-h-screen relative justify-center p-6 text-white">
        <button
          onClick={() => router.push("/meus-baralhos")}
          className="flex items-center gap-2.5 text-2xl sm:text-3xl cursor-pointer hover:scale-105 transition-all absolute left-6 top-6 sm:left-10 sm:top-10 text-white z-10"
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <Back />
          </div>
          <span>Voltar</span>
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

  const idsUsadosNoBaralho = baralhoAtual.map((c) => c.idInventario);
  const slotsVazios = Math.max(0, 20 - baralhoAtual.length);

  return (
    <div className="flex flex-col bg-custom-blue items-center w-full min-h-screen relative text-white p-6 justify-between">
      <button
        onClick={() => router.push("/meus-baralhos")}
        className="flex items-center gap-2.5 text-2xl sm:text-3xl cursor-pointer hover:scale-105 transition-all absolute left-6 top-6 sm:left-10 sm:top-10 text-white z-10"
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <Back />
        </div>
        <span>Voltar</span>
      </button>

      <div className="flex flex-col items-center mt-12 sm:mt-6 mb-2">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-wide">
          {idBaralhoParam ? "Editar Baralho" : "Montar Baralho"}
        </h1>
      </div>

      {mensagemErro && (
        <p className="text-red-400 text-xl my-2 text-center">{mensagemErro}</p>
      )}

      <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-16 my-6">
        <div className="flex flex-col items-center">
          <p className="text-3xl mb-6">
            Baralho Atual ({baralhoAtual.length}/20)
          </p>

          <div className="grid grid-cols-5 gap-3 p-3 max-h-[50vh] overflow-y-auto inventory-scrollbar">
            {baralhoAtual.map((carta, index) => (
              <div
                key={`${carta.idInventario}-${index}`}
                className={getEstiloCarta(carta.raridade, carta.tipo)}
                onClick={() => removerCarta(index)}
              >
                <p className="text-sm font-semibold">{carta.nome}</p>
              </div>
            ))}

            {Array.from({ length: slotsVazios }).map((_, i) => (
              <div
                key={`vazio-${i}`}
                className="w-20 h-32 md:w-24 md:h-36 rounded-2xl flex items-center justify-center bg-[#141525] border-2 border-[#2c3047]"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-3xl mb-6">Seu Inventário</p>

          <div className="grid grid-cols-5 gap-3 p-3 max-h-[50vh] overflow-y-auto inventory-scrollbar">
            {inventario.map((carta) => {
              const jaEstaNoBaralho = idsUsadosNoBaralho.includes(
                carta.idInventario
              );

              if (jaEstaNoBaralho) {
                return (
                  <div
                    key={carta.idInventario}
                    className="w-20 h-32 md:w-24 md:h-36 rounded-2xl flex items-center justify-center bg-[#181921] border-2 border-[#292a36] text-gray-600 opacity-60 p-1 text-center select-none"
                  >
                    <p className="text-sm">{carta.nome}</p>
                  </div>
                );
              }

              return (
                <div
                  key={carta.idInventario}
                  className={getEstiloCarta(carta.raridade, carta.tipo)}
                  onClick={() => adicionarCarta(carta)}
                >
                  <p className="text-sm font-semibold">{carta.nome}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-5xl px-8 pb-6 gap-6">
        <fieldset className="border border-gray-400 rounded-md px-4 py-1.5 w-full sm:w-96">
          <legend className="text-xs text-gray-300 px-1.5 ml-2">
            Nome do Baralho
          </legend>
          <input
            type="text"
            value={nomeBaralho}
            onChange={(e) => setNomeBaralho(e.target.value)}
            className="w-full bg-transparent text-white text-lg outline-none pb-1"
          />
        </fieldset>

        <button
          onClick={handleSalvar}
          disabled={salvando}
          className="flex justify-center items-center px-10 py-3 cursor-pointer hover:scale-105 transition-all bg-[#1e2f57] rounded-xl border-2 border-amber-400 text-2xl font-semibold text-white shadow-md disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}

export default function MontarBaralhoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col bg-custom-blue items-center justify-center w-full min-h-screen text-white">
          <p className="text-2xl">Carregando...</p>
        </div>
      }
    >
      <MontarBaralhoConteudo />
    </Suspense>
  );
}