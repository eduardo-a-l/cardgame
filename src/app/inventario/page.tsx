"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function TelaInventario() {
    const router = useRouter();

    const [cartas, setCartas] = useState<Carta[]>([]);
    const [erroServidor, setErroServidor] = useState(false);

    useEffect(() => {
        async function carregarInventario() {
            try {
                const usuarioSalvo = localStorage.getItem("usuario");

                if (!usuarioSalvo) {
                    router.push("/login");
                    return;
                }

                const usuario = JSON.parse(usuarioSalvo);

                const response = await fetch(
                    `http://localhost:8081/Inventario/${usuario.idUsuario}`
                );

                if (!response.ok) {
                    throw new Error("Erro de conexão");
                }

                const dados: Carta[] = await response.json();

                setCartas(dados);
            } catch (erro) {
                console.error(erro);
                setErroServidor(true);
            }
        }

        carregarInventario();
    }, [router]);

    if (erroServidor) {
        return (
            <main className="relative min-h-screen bg-[#1B1B2F] flex items-center justify-center p-4">
                <div className="absolute top-10 left-10">
                    <Botao
                        texto="Voltar"
                        nomeIcone="voltar"
                        tamanhoIcone={40}
                        corDeFundo="transparent"
                        corDaBorda="transparent"
                        corDoTexto="#FFFFFF"
                        onClick={() => router.push("/")}
                    />
                </div>
                <p className="text-white text-2xl text-center">
                    Não foi possível conectar-se com o servidor
                </p>
            </main>
        );
    }

    return (
        <main className="relative min-h-screen bg-[#1B1B2F] flex items-center justify-center p-4">

            <div className="absolute top-10 left-10 right-10 flex justify-between items-center">

                <Botao
                    texto="Voltar"
                    nomeIcone="voltar"
                    tamanhoIcone={40}
                    corDeFundo="transparent"
                    corDaBorda="transparent"
                    corDoTexto="#FFFFFF"
                    onClick={() => router.push("/")}
                />

                <h1 className="text-5xl text-white mt-4">
                    Inventário
                </h1>

                <div className="w-[154.03px] h-4"></div>

            </div>

            <div className="h-[75vh] w-[95vw] md:w-[90vw] xl:w-[85vw] mt-12 overflow-y-auto inventory-scrollbar">

                <div className="grid grid-cols-5 gap-[3vw] justify-items-center">

                    {cartas.map((carta) => (
                        <div
                            key={carta.idInventario}
                            className="w-full max-w-[209px] aspect-[209/301.4] bg-[#21366B] border-[5px] border-[#686868] rounded-[33px] shadow-sm flex items-center justify-center text-white text-[38px] text-center"
                        >
                            {carta.nome}
                        </div>
                    ))}

                </div>

            </div>

        </main>
    );
}