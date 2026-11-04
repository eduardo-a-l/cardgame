"use client";

import { useEffect, useState } from "react";
import type { ConquistaDesbloqueada } from "@/lib/conquistas";

export default function PopupConquista() {
    const [conquista, setConquista] =
        useState<ConquistaDesbloqueada | null>(null);

    const [nomeUsuario, setNomeUsuario] = useState("Jogador");

    useEffect(() => {
        function receberConquista(evento: Event) {
            const eventoPersonalizado =
                evento as CustomEvent<ConquistaDesbloqueada>;

            if (eventoPersonalizado.detail) {
                setConquista(eventoPersonalizado.detail);

                setNomeUsuario(
                    eventoPersonalizado.detail.nomeUsuario ??
                    `Usuário #${eventoPersonalizado.detail.idUsuario ?? "?"}`
                );
            }
        }

        window.addEventListener(
            "conquistaDesbloqueada",
            receberConquista
        );

        return () => {
            window.removeEventListener(
                "conquistaDesbloqueada",
                receberConquista
            );
        };
    }, []);

    useEffect(() => {
        if (!conquista?.idUsuario) return;

        const controller = new AbortController();

        async function buscarNomeUsuario() {
            try {
                const resposta = await fetch(
                    `http://localhost:8081/Usuarios/${conquista!.idUsuario}`,
                    { signal: controller.signal }
                );

                if (!resposta.ok) return;

                const usuario = await resposta.json();

                if (usuario.nomeUsuario) {
                    setNomeUsuario(usuario.nomeUsuario);
                }
            } catch (erro) {
                if (
                    erro instanceof Error &&
                    erro.name !== "AbortError"
                ) {
                    console.error("Erro ao buscar usuário da conquista:", erro);
                }
            }
        }

        buscarNomeUsuario();

        return () => controller.abort();
    }, [conquista?.idUsuario]);

    useEffect(() => {
        if (!conquista) return;

        const timeout = window.setTimeout(() => {
            setConquista(null);
        }, 4500);

        return () => window.clearTimeout(timeout);
    }, [conquista]);

    if (!conquista) return null;

    return (
        <div className="fixed top-6 right-6 z-[9999] animate-[conquistaEntrada_0.4s_ease-out]">
            <div className="flex items-center gap-4 w-[min(90vw,380px)] rounded-2xl border-2 border-[#C8911A] bg-[#21366B] p-4 shadow-2xl">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[#C8911A] bg-[#1B1B2F]">
                    <span className="text-3xl text-[#E5B94F]">
                        ★
                    </span>
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#E5B94F]">
                        Conquista desbloqueada!
                    </p>

                    <h2 className="mt-1 truncate text-lg font-bold text-white">
                        {conquista.nome}
                    </h2>

                    <p className="mt-1 text-sm text-gray-200">
                        {conquista.descricao}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-[#E5B94F]">
                        {conquista.dificuldade}
                    </p>

                    <p className="mt-1 text-xs text-gray-300">
                        Desbloqueada por: {nomeUsuario}
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes conquistaEntrada {
                    from {
                        opacity: 0;
                        transform: translateX(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
}