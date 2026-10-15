"use client";

import { useEffect } from "react";
import type { Pacote } from "@/app/loja/page"
import { corTipo } from "@/app/loja/page"

export interface CartaModal {
    idCarta: number;
    nome: string;
    raridade: string;
}

interface ModalProps {
    aberto: boolean;
    titulo: string;
    mensagem?: string;
    tipo: "erro" | "sucesso" | "pacote" | "detalhesPacote";
    cartas?: CartaModal[];
    pacote?: Pacote;
    onFechar: () => void;
}

export default function Modal({
    aberto,
    titulo,
    mensagem,
    tipo,
    cartas = [],
    pacote,
    onFechar,
}: ModalProps) {

    useEffect(() => {
        if (!aberto) return;

        const fecharComEscape = (evento: KeyboardEvent) => {
            if (evento.key === "Escape") {
                onFechar();
            }
        };

        window.addEventListener("keydown", fecharComEscape);

        return () => {
            window.removeEventListener("keydown", fecharComEscape);
        };
    }, [aberto, onFechar]);

    if (!aberto) return null;

    const coresRaridade: Record<string, string> = {
        "Comum": "white",
        "Incomum": "#56BF72",
        "Raro": "#3960C2",
        "Ultra Raro": "#620D69",
        "Lendário": "#E6A71F",
    };

    const corTitulo =
        tipo === "erro" ? "#FF7373" :
        tipo === "detalhesPacote" ? pacote?.cor :
        "#C8911A";

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${ tipo === "pacote" ? "bg-black/70" : "bg-black/15" }`}
            onMouseDown={(evento) => {
                if (evento.target === evento.currentTarget) {
                    onFechar();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-titulo"
                className={`relative flex max-h-[90vh] flex-col overflow-y-auto rounded-2xl border-2 border-[#C8911A] bg-[#1B1B2F] p-6 text-white shadow-2xl sm:p-8 ${ tipo === "pacote" ? "w-full max-w-5xl p-10 sm:p-12" : "w-full max-w-md" }`}
            >
                <button
                    type="button"
                    onClick={onFechar}
                    aria-label="Fechar modal"
                    className="absolute right-4 top-3 text-3xl text-white/70 transition hover:text-white"
                >
                    &times;
                </button>

                <h2
                    id="modal-titulo"
                    className={`mb-5 mt-2 text-center text-4xl font-bold sm:text-[clamp(35px,2.760vw,53px)] ${ tipo === "detalhesPacote" ? "mt-5" : "" } `}
                    style={{ color: corTitulo }}
                >
                    {titulo}
                </h2>

                {mensagem && (
                    <p className="mb-8 whitespace-pre-line text-center text-lg text-white/85 sm:text-3xl">
                        {mensagem}
                    </p>
                )}

                {tipo === "pacote" && (
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
                        {cartas.map((carta, index) => {
                            const cor =
                                coresRaridade[carta.raridade] ?? "#686868";

                            return (
                                <div
                                    key={`${carta.idCarta}-${index}`}
                                    className="flex min-w-0 flex-col items-center overflow-hidden rounded-xl border-2 bg-[#21366B] p-4 text-center"
                                    style={{ borderColor: cor }}
                                >
                                    <div
                                        className="mb-4 flex aspect-[209/301.4] w-full items-center justify-center rounded-lg border bg-[#1B1B2F]"
                                        style={{ borderColor: cor }}
                                    >
                                        <span
                                            className="text-3xl font-bold"
                                            style={{ color: cor }}
                                        >
                                            {carta.raridade === "Lendário"
                                                ? "★"
                                                : "✦"}
                                        </span>
                                    </div>

                                    <p className="w-full break-words font-semibold">
                                        {carta.nome}
                                    </p>

                                    <span
                                        className="mt-2 text-xs font-bold sm:text-sm"
                                        style={{ color: cor }}
                                    >
                                        {carta.raridade}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {tipo === "detalhesPacote" && (

                    <div className="text-center">

                        <p className="text_dinheiro text-[clamp(18px,1.5vw,29px)] pb-4">Preço do pacote: {pacote?.preco}G</p>

                        <p className="text-[clamp(18px,1.5vw,29px)]">Chance das Cartas 1-4:</p>

                        {pacote?.probabilidades.map((probabilidade, index) => (
                            <p key={index} className="text-[clamp(16px,1.2vw,24px)]" style={{ color: corTipo(probabilidade.raridade) }}>
                                {probabilidade.raridade}: {(probabilidade.chanceCartas*100).toFixed(0)}%
                            </p>
                        ))}

                        <p className="text-[clamp(18px,1.5vw,29px)] pt-4">Chances da Última Carta:</p>

                        {pacote?.probabilidades.map((probabilidade, index) => (
                            <p key={index} className="text-[clamp(16px,1.2vw,24px)]" style={{ color: corTipo(probabilidade.raridade) }}>
                                {probabilidade.raridade}: {(probabilidade.chanceUltimaCarta*100).toFixed(0)}%
                            </p>
                        ))}
                        
                    </div>
                )}

                <button
                    type="button"
                    onClick={onFechar}
                    className="mx-auto mt-10 min-w-48 rounded-xl border-2 border-[#C8911A] bg-[#21366B] px-10 py-4 font-semibold text-white transition hover:bg-[#2D4785] active:scale-95"
                >
                    {tipo === "pacote" ? "Continuar" : "Entendi"}
                </button>
            </div>
        </div>
    );
}