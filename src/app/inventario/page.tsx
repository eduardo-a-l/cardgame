"use client";

import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";

export default function TelaInventario() {
    const router = useRouter();

    const nomes = [
        "Espada",
        "Escudo",
        "Arco",
        "Poção",
        "Capacete",
        "Armadura",
        "Machado",
        "Lança",
        "Arco Mágico",
        "Anel",
        "Botas",
        "Colar",
        "Cajado",
        "Adaga",
        "Elmo",
        "Poção de Mana",
        "Poção de Vida",
        "Pergaminho",
        "Martelo",
        "Amuleto",
        "Chave",
        "Cristal",
        "Mapa",
    ];

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

                <h1 className="text-5xl text-white mt-4">Inventário</h1>

                <div className="w-[154.03px] h-4"></div>

            </div>
            
            <div className="w-[85vw] h-[75vh] mt-12 overflow-y-auto inventory-scrollbar">

                <div className="grid grid-cols-5 gap-15">

                    {nomes.map((nome, index) => (
                        <div 
                            key={index} 
                            className="w-[209px] h-[301.4px] bg-[#21366B] border-[5px] border-[#686868] rounded-[33px] shadow-sm flex items-center justify-center text-white text-[38px] text-center"
                        >
                            {nome}
                        </div>
                    ))}

                </div>

            </div>

        </main>
    )
}