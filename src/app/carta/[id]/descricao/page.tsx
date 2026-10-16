"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import DescricaoCarta from "@/components/ui/DescricaoCarta/DescricaoCarta";
import CardCarta from "@/components/ui/CardCarta/CardCarta";
import Modal from "@/components/layout/Modal";
import { useEffect, useState, Suspense } from "react";

interface ItemInventario {
    idInventario?: number;
    IdInventario?: number;
    idCarta?: number | string;
    IdCarta?: number | string;
    nome?: string;
    Nome?: string;
    tipo?: string;
    Tipo?: string;
    raridade?: string;
    Raridade?: string;
    precoPadrao?: number;
    PrecoPadrao?: number;
    vida?: number | null;
    Vida?: number | null;
    acao1?: string | null;
    Acao1?: string | null;
    acao2?: string | null;
    Acao2?: string | null;
}

function DescricaoConteudo() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const origem = searchParams.get("origem") || "loja";

    const [carta, setCarta] = useState<ItemInventario | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [vendendo, setVendendo] = useState(false);

    const [modal, setModal] = useState<{
        aberto: boolean;
        titulo: string;
        mensagem: string;
        tipo: "erro" | "sucesso";
        acaoAoFechar?: () => void;
    }>({
        aberto: false,
        titulo: "",
        mensagem: "",
        tipo: "sucesso"
    });

    useEffect(() => {
        if (!params.id) return;

        async function carregarCarta() {
            setCarregando(true);
            try {
                if (origem === "inventario") {
                    const usuarioSalvo = localStorage.getItem("usuario");
                    if (!usuarioSalvo) {
                        router.push("/login");
                        return;
                    }

                    const usuario = JSON.parse(usuarioSalvo);

                    const response = await fetch(`http://localhost:8081/Inventario/${usuario.idUsuario}`);
                    if (!response.ok) throw new Error("Erro ao buscar inventário");

                    const inventario: ItemInventario[] = await response.json();

                    const itemInventario = inventario.find(
                        (item) => (item.idInventario ?? item.IdInventario) === Number(params.id)
                    );

                    if (itemInventario) {
                        setCarta(itemInventario);
                    }
                } else {
                    const response = await fetch(`http://localhost:8081/Cartas/${params.id}`);
                    if (!response.ok) throw new Error("Erro ao carregar detalhes da carta");

                    const data: ItemInventario = await response.json();
                    setCarta(data);
                }
            } catch (error) {
                console.error("Erro ao carregar detalhes:", error);
            } finally {
                setCarregando(false);
            }
        }

        carregarCarta();
    }, [params.id, origem, router]);

    async function handleVender() {
        if (!carta || vendendo) return;

        const usuarioSalvo = localStorage.getItem("usuario");
        if (!usuarioSalvo) {
            router.push("/login");
            return;
        }

        const usuario = JSON.parse(usuarioSalvo);
        
        const idInventario = carta.idInventario ?? carta.IdInventario ?? params.id;

        if (!idInventario) return;

        setVendendo(true);

        try {
            const response = await fetch(
                `http://localhost:8081/Loja/vender/${usuario.idUsuario}/${idInventario}`,
                { method: "POST" }
            );

            const dadosResposta = await response.json().catch(() => null);

            if (!response.ok) {
                const mensagemDeErro = 
                    dadosResposta?.erro || 
                    dadosResposta?.Mensagem || 
                    dadosResposta?.message || 
                    "Não foi possível vender a carta.";

                setModal({
                    aberto: true,
                    titulo: "Aviso",
                    mensagem: mensagemDeErro,
                    tipo: "erro"
                });
                return;
            }

            setModal({
                aberto: true,
                titulo: "Sucesso!",
                mensagem: "Carta vendida com sucesso!",
                tipo: "sucesso",
                acaoAoFechar: () => router.push("/inventario")
            });
        } catch (error) {
            console.error("Erro ao vender carta:", error);
            setModal({
                aberto: true,
                titulo: "Erro de Conexão",
                mensagem: "Não foi possível conectar ao servidor para efetuar a venda.",
                tipo: "erro"
            });
        } finally {
            setVendendo(false);
        }
    }

    function fecharModal() {
        const acao = modal.acaoAoFechar;
        setModal((prev) => ({ ...prev, aberto: false }));
        if (acao) acao();
    }

    const idCartaParaComponentes = carta?.idCarta ?? carta?.IdCarta;
    const nomeCarta = carta?.nome ?? carta?.Nome ?? "Carta";

    return (
        <div className="flex flex-col bg-custom-blue items-center w-full min-h-screen relative overflow-x-hidden p-4 sm:p-6 md:p-8">
            <div className="absolute top-10 left-10 z-10">
                <Botao
                    texto="Voltar"
                    nomeIcone="voltar"
                    tamanhoIcone={40}
                    corDoTexto="#FFFFFF"
                    corDeFundo="transparent"
                    corDaBorda="transparent"
                    className="px-0 py-0 text-3xl"
                    onClick={() => router.back()}
                />
            </div>

            <div className="flex flex-col mt-[clamp(2.5rem,6vh,4rem)] mb-[clamp(1rem,3vh,2rem)] text-center">
                <h1 className="text-[clamp(1.75rem,3.8vmin,2.75rem)] font-bold text-white">
                    Detalhes: {carregando ? "Carregando..." : nomeCarta}
                </h1>
            </div>

            {!carregando && idCartaParaComponentes && (
                <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-[clamp(1.5rem,3vw,3rem)] w-full max-w-5xl mx-auto text-[clamp(1rem,1.8vmin,1.35rem)]">
                    <CardCarta id={String(idCartaParaComponentes)} />
                    <div className="flex flex-col w-full md:w-[clamp(20rem,35vw,30rem)] max-w-full h-[clamp(320px,46vh,440px)] overflow-y-auto p-[clamp(1rem,2vw,1.5rem)]">
                        <DescricaoCarta className="flex flex-col text-[clamp(1.25rem,1.8vmax,1.30rem)]" id={String(idCartaParaComponentes)} />
                    </div>
                </div>
            )}

            {origem === "inventario" && !carregando && (
                <div className="flex justify-center md:justify-end w-full max-w-5xl mx-auto mt-[clamp(1rem,2.5vh,1.75rem)]">
                    <button 
                        onClick={handleVender}
                        disabled={vendendo}
                        className="flex flex-col items-center justify-center w-[clamp(9rem,13vw,13rem)] h-[clamp(4.25rem,7.5vh,5rem)] cursor-pointer hover:scale-105 transition-all bg-blue-950 rounded-xl border-3 border-amber-500 py-1 shadow-lg disabled:opacity-50"
                    >
                        <p className="text-[clamp(1.35rem,2.4vmin,1.75rem)] font-bold text-white">
                            {vendendo ? "Vendendo..." : "Vender"}
                        </p>
                        <p className="text-[clamp(0.85rem,1.5vmin,1.05rem)] text-green-400 font-semibold">+50%G</p>
                    </button>
                </div>
            )}

            <Modal
                aberto={modal.aberto}
                titulo={modal.titulo}
                mensagem={modal.mensagem}
                tipo={modal.tipo}
                onFechar={fecharModal}
            />
        </div>
    );
}

export default function DescricaoPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-custom-blue text-white flex items-center justify-center">Carregando...</div>}>
            <DescricaoConteudo />
        </Suspense>
    );
}