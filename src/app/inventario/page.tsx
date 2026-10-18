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
    emBaralho?: boolean | number;
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

                const [resInventario, resBaralhos] = await Promise.all([
                    fetch(`http://localhost:8081/Inventario/${usuario.idUsuario}`),
                    fetch(`http://localhost:8081/Baralho/usuario/${usuario.idUsuario}`).catch(() => null)
                ]);

                if (!resInventario.ok) {
                    throw new Error("Erro de conexão");
                }

                const dadosInventario: Carta[] = await resInventario.json();

                if (resBaralhos && resBaralhos.ok) {
                    const baralhos = await resBaralhos.json();
                    const idsEmBaralhos = new Set<number>(
                        baralhos.flatMap((b: { Inventarios?: { idInventario: number }[] }) =>
                            b.Inventarios?.map((item) => item.idInventario) || []
                        )
                    );

                    const cartasMapeadas = dadosInventario.map((carta) => ({
                        ...carta,
                        emBaralho: carta.emBaralho ?? idsEmBaralhos.has(carta.idInventario)
                    }));

                    setCartas(cartasMapeadas);
                } else {
                    setCartas(dadosInventario);
                }
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
                <div className="absolute top-10 left-10 z-10">
                    <Botao
                        texto="Voltar"
                        nomeIcone="voltar"
                        tamanhoIcone={40}
                        corDeFundo="transparent"
                        corDaBorda="transparent"
                        corDoTexto="#FFFFFF"
                        className="px-0 py-0 text-3xl"
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
                    className="px-0 py-0 text-3xl"
                    onClick={() => router.push("/")}
                />

                <h1 className="text-5xl text-white mt-4">
                    Inventário
                </h1>

                <div className="w-[154.03px] h-4"></div>
            </div>

            <div className="h-[75vh] w-[95vw] xl:w-[90vw] 2xl:w-[86vw] mt-9 pt-3 pl-2 pr-2 overflow-y-auto inventory-scrollbar">
                <div className="grid grid-cols-5 gap-[3vw] justify-items-center">

                    {cartas.map((carta) => {
                        const estaEmBaralho = Boolean(carta.emBaralho);
                        return (
                            <div
                                key={carta.idInventario}
                                onClick={() => router.push(`/carta/${carta.idInventario}/descricao?origem=inventario`)}
                                className={`relative w-full max-w-[209px] aspect-[190/274] ${carta.tipo == "Personagem" ? "bg-[#21366B]" : carta.tipo == "Suporte" ? "bg-[#53216B]" : "bg-[#216B35]"} border-[5px] border-[#686868] rounded-[33px] shadow-sm flex items-center justify-center text-white text-[21px] kinda-small:text-[30px] pretty-wide:text-[38px] text-center cursor-pointer transition-transform hover:scale-105`}
                            >
                                {estaEmBaralho && (
                                    <span className="absolute top-3 right-3 bg-[#C8911A] text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-md border border-black pointer-events-none">
                                        Em Baralho
                                    </span>
                                )}
                                { carta.nome != "Researcher's Help" 
                                ?
                                    <span className="p-2 break-words">
                                        {carta.nome}
                                    </span>
                                : 
                                    <div className="flex flex-col">
                                        <span className="text-[16px] kinda-small:text-[23px] pretty-wide:text-[30px] p-2">Researcher&#39;s</span>
                                        <span className="text-[21px] kinda-small:text-[30px] pretty-wide:text-[38px] p-2">Help</span>
                                    </div>
                                }
                            </div>
                        );
                    })}

                </div>
            </div>

        </main>
    );
}