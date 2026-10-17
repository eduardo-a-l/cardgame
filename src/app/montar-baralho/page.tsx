"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Back from "@/components/ui/Back/Back";
import Modal from "@/components/layout/Modal";
import { Botao } from "@/components/ui/Botao";

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
  const [modalAberto, setModalAberto] = useState(false);
  const [tituloModal, setTituloModal] = useState("");
  const [mensagemModal, setMensagemModal] = useState("");
  const [tipoModal, setTipoModal] = useState< "erro" | "sucesso" | "pacote" | "detalhesPacote" >("erro");

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
      setMensagemModal("O baralho não pode conter mais de 20 cartas.");
      setTituloModal("Baralho cheio!")
      setTipoModal("erro")
      setModalAberto(true)
      return;
    }

    setMensagemModal("");
    setBaralhoAtual((prev) => [...prev, carta]);
  }

  function removerCarta(indexParaRemover: number) {
    setMensagemModal("");
    setBaralhoAtual((prev) =>
      prev.filter((_, index) => index !== indexParaRemover)
    );
  }

  async function handleSalvar() {
    if (!nomeBaralho.trim()) {
      setMensagemModal("Escolha um nome para o seu baralho.");
      setTituloModal("Nome vazio!")
      setTipoModal("erro")
      setModalAberto(true)
      return;
    }

    const usuarioSalvo = localStorage.getItem("usuario");
    if (!usuarioSalvo) {
      router.push("/login");
      return;
    }

    const usuario = JSON.parse(usuarioSalvo);
    setSalvando(true);
    setMensagemModal("");

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
      setMensagemModal("Não foi possível salvar o baralho.");
      setTituloModal("Erro ao salvar!")
      setTipoModal("erro")
      setModalAberto(true)
    } finally {
      setSalvando(false);
    }
  }

  function getEstiloCarta(tipo: string) {
    const cardBase =
      "w-[clamp(101.25px,7.031vw,135px)] aspect-[209/301.4] rounded-[1vw] flex flex-col items-center justify-center p-1 text-center select-none border-[3px] border-[#686868] loja-hover";

    if (tipo === "Campo") {
      return `${cardBase} bg-[#216B35]`;
    }

    if (tipo === "Suporte") {
      return `${cardBase} bg-[#53216B]`;
    }

      return `${cardBase} bg-[#21366B]`;
  }

  if (erroServidor) {
    return (
      <div className="flex flex-col bg-custom-blue items-center w-full min-h-screen relative justify-center pl-6 pr-6 pt-0 pb-0 text-white">
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
    <main className="flex flex-col bg-custom-blue items-center w-full min-h-screen relative text-white pl-6 pr-6">
      <button
        onClick={() => router.push("/meus-baralhos")}
        className="flex items-center gap-2.5 text-2xl sm:text-3xl cursor-pointer hover:scale-105 transition-all absolute left-6 top-6 sm:left-10 sm:top-10 text-white z-10"
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <Back />
        </div>
        <span>Voltar</span>
      </button>

      <div className="flex flex-col items-center mt-[clamp(30px,5.889vh,96px)] tall:mt-[clamp(55px,8.889vh,96px)]">
        <h1 className="text-[clamp(32px,2.708vw,52px)] font-bold tracking-wide">
          {idBaralhoParam ? "Editar Baralho" : "Montar Baralho"}
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-25 my-6">
        <div className="flex flex-col items-center">
          <p className="text-[clamp(30px,2.6042vw,50px)] mb-6">
            Baralho Atual ({baralhoAtual.length}/20)
          </p>

          <div className="grid grid-cols-5 gap-3 p-3 max-h-[46vh] overflow-y-auto inventory-scrollbar">
            {baralhoAtual.map((carta, index) => (
              <div
                key={`${carta.idInventario}-${index}`}
                className={getEstiloCarta(carta.tipo)}
                onClick={() => removerCarta(index)}
              >
                <p className="text-sm xl:text-xl">{carta.nome}</p>
              </div>
            ))}

            {Array.from({ length: slotsVazios }).map((_, i) => (
              <div
                key={`vazio-${i}`}
                className="w-[clamp(101.25px,7.031vw,135px)] aspect-[209/301.4] rounded-[1vw] bg-[#141525] border-[3px] border-[#686868]"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-[clamp(30px,2.6042vw,50px)] mb-6">Seu Inventário</p>

          <div className="grid grid-cols-5 gap-3 p-3 max-h-[46vh] overflow-y-auto inventory-scrollbar">
            {inventario.map((carta) => {
              const jaEstaNoBaralho = idsUsadosNoBaralho.filter(id => id === carta.idInventario).length >= 2;

              if (jaEstaNoBaralho) {
                return (
                  <div
                    key={carta.idInventario}
                    className="w-[clamp(101.25px,7.031vw,135px)] aspect-[209/301.4] rounded-[1vw] flex items-center justify-center bg-[#181921] border-[3px] border-[#686868] text-gray-600 opacity-60 p-1 text-center select-none"
                  >
                    <p className="text-sm 2xl:text-xl">{carta.nome}</p>
                  </div>
                );
              }

              return (
                <div
                  key={carta.idInventario}
                  className={getEstiloCarta(carta.tipo)}
                  onClick={() => adicionarCarta(carta)}
                >
                    <p className="text-sm 2xl:text-xl">{carta.nome}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-5xl px-8 pt-10 gap-26">
        <fieldset className="border border-gray-400 rounded-md px-4 py-1.5 w-full">
          <legend className="text-sm text-gray-300 px-1.5 ml-2">
            Nome do Baralho
          </legend>
          <input
            type="text"
            value={nomeBaralho}
            onChange={(e) => setNomeBaralho(e.target.value)}
            className="w-full bg-transparent text-white text-xl 2xl:text-2xl outline-none pb-1"
          />
        </fieldset>
        <Botao
            texto={salvando ? "Salvando..." : "Salvar"}
            raio={20}
            disabled={salvando}
            borda="border-[4px]"
            className="loja-hover w-[clamp(200px,14.061vw,270px)] h-[clamp(60px,12.5vh,170px)] flex items-center justify-center text-center text-[clamp(15px,2.240vw,43px)] disabled:opacity-50"
            onClick={handleSalvar}
         />
      </div>
          <Modal
              aberto={modalAberto}
              titulo={tituloModal}
              mensagem={mensagemModal}
              tipo={tipoModal}
              onFechar={() => setModalAberto(false)}
          />
    </main>
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