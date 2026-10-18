"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import Modal from "@/components/layout/Modal";
import { useEffect, useState, Suspense } from "react";
import { corTipo } from "@/app/loja/page";

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
        <main className="relative flex flex-col bg-custom-blue items-center w-full h-screen">
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
                <h1 className="text-[clamp(1rem,3.5vw,4.2rem)]">
                    Detalhes: {carregando ? "Carregando..." : nomeCarta}
                </h1>
            </div>

            {!carregando && idCartaParaComponentes && (
                <div className="flex flex-col md:flex-row items-start gap-[clamp(1.5rem,6vw,7.2rem)] w-[70vw] h-[63vh] ml-[7.4vw] mx-auto text-[clamp(1rem,3.5vw,4.2rem)] mt-8">

                    <div className="flex flex-col pb-1 mt-2 justify-end items-center bg-[#21366B] rounded-[30px] border-[5px] border-[#686868] w-[clamp(15rem,22vw,27rem)] aspect-[190/274] shrink-0 shadow-xl">
                        
                        <p className="text-[clamp(1rem,2.8vw,4.2rem)] text-center px-3 leading-[1.3]">{nomeCarta}</p>

                        {carta?.vida !== null && carta?.vida !== undefined && (
                            <p className="text-[clamp(1rem,2.3vw,4.2rem)]">HP: {carta?.vida}</p>
                        )}

                    </div>

                    <div className="flex flex-col h-full self-start w-full pr-5 overflow-y-auto inventory-scrollbar text-[clamp(1rem,2.3vw,4.2rem)]">

                        <p className="leading-[1.3]">Tipo: {carta?.tipo}</p>

                        <p className="leading-[1.3]">
                            <span>Raridade: </span>
                            <span style={{ color: corTipo(carta?.raridade as string) }}>{carta?.raridade}</span>
                        </p>

                        <p className="text_dinheiro mb-10 leading-[1.3]">Preço: {carta?.precoPadrao}G</p>
                    
                        <p className="text_dinheiro leading-[1.3]">
                            {carta?.tipo == "Personagem" ? "[Ação 1]" : "[Efeito]"}
                        </p>

                        <p className="leading-[1.3]">{carta?.acao1}</p>

                        {carta?.acao2 && <> <p className="text_dinheiro leading-[1.3]">[Ação 2]</p> <p className="leading-[1.3]">{carta.acao2}</p> </>}
                    </div>

                </div>
            )}

            {origem === "inventario" && !carregando && (
                <button
                    style={{
                        backgroundColor: "#21366B",
                        borderColor: "#C8911A",
                        borderRadius: "23px"
                    }}
                    onClick={handleVender}
                    disabled={vendendo}
                    className="absolute bottom-10 right-[56px] flex flex-col items-center justify-end text-center text-[clamp(15px,2.35vw,45px)] border-[6px] loja-hover w-[clamp(200px,17.3vw,400px)] h-[clamp(60px,14.5vh,170px)] disabled:opacity-50"
                >
                    <p className="leading-[1.2] text-[clamp(15px,2.95vw,57px)]">
                        {vendendo ? "Vendendo..." : "Vender"}
                    </p>
                    <p className="leading-[1.1] mb-[5px]" style={{ color: "#56BF72" }}>+50%G</p>
                </button>
            )}

            <Modal
                aberto={modal.aberto}
                titulo={modal.titulo}
                mensagem={modal.mensagem}
                tipo={modal.tipo}
                onFechar={fecharModal}
            />
        </main>
    );
}

export default function DescricaoPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-custom-blue text-white flex items-center justify-center">Carregando...</div>}>
            <DescricaoConteudo />
        </Suspense>
    );
}