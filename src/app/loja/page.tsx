"use client";

import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";

export default function TelaLoja() {
    const router = useRouter();

    const moedas = 100;

    const secoes = ["ofertas", "pacotes", "avulsos", "fundos"];

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
        "Colar"
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
                    style={{ width : "200px" }}
                />

                <h1 className="text-5xl text-white">Loja</h1>

                <h2 className="text_dinheiro text-[30px]" style={{ width : "200px" }}>
                    Moedas: {moedas}G
                </h2>

            </div>
            
            <div className="h-[75vh] w-[95vw] md:w-[90vw] xl:w-[85vw] mt-12 overflow-y-auto inventory-scrollbar">

                <div className="grid grid-cols-5 gap-[3vw] justify-items-center">

                    {nomes.map((nome, index) => (
                        <div 
                            key={index} 
                            className="w-full max-w-[209px] aspect-[209/301.4] bg-[#21366B] border-[5px] border-[#686868] rounded-[33px] shadow-sm flex items-center justify-center text-white text-[38px] text-center"
                        >
                            {nome}
                        </div>
                    ))}

                </div>

            </div>

        </main>
    )
}