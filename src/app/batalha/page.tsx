"use client";

import { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import { NomeIcone } from "@/components/ui/Icone";
import { Icone } from "@/components/ui/Icone";

export default function TelaBatalha() {
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
        "Colar"
    ];

    function exibirCarta(borda: string, largura: string[], 
                         altura: string, nomeImagem: string, 
                         texto: string, tamanhoTexto: string,
                         borderRadius: string, fundo: string) : JSX.Element {
        return (
            <div className={`${largura[0]} ${altura} border-[5px] ${borda} ${borderRadius} ${fundo} flex flex-col items-center justify-center`}>
            {nomeImagem !== "" && (
                <Icone
                nome={nomeImagem as NomeIcone}
                tamanho={largura[1]}
                />
            )}

            {texto !== "" && (
                <h1 className={`${tamanhoTexto}`}>
                {texto}
                </h1>
            )}
            </div>
        )
    }

    return (
        <main className="relative h-screen bg-[#1B1B2F] flex justify-center xl:p-4">
            
            {/*container geral*/}
            <div className="flex flex-col w-[100vw] xl:w-[95vw]">

                <div className="flex items-center justify-center gap-[3vw] h-[20vh]">

                    <h1>Oponente</h1>

                    {exibirCarta("border-[#686868]", ["w-[80px]", ""], "h-[85px]", "", "Olá", "text-[20px]", "rounded-[8px]", "bg-[#363C4B]")}
                    {exibirCarta("border-[#686868]", ["w-[80px]", ""], "h-[85px]", "", "Olá", "text-[20px]", "rounded-[8px]", "bg-[#363C4B]")}
                    {exibirCarta("border-[#686868]", ["w-[80px]", ""], "h-[85px]", "", "Olá", "text-[20px]", "rounded-[8px]", "bg-[#363C4B]")}
                    {exibirCarta("border-[#686868]", ["w-[80px]", ""], "h-[85px]", "", "Olá", "text-[20px]", "rounded-[8px]", "bg-[#363C4B]")}
                    {exibirCarta("border-[#686868]", ["w-[80px]", ""], "h-[85px]", "", "Olá", "text-[20px]", "rounded-[8px]", "bg-[#363C4B]")}


                </div>

                <aside className="min-h-0 h-full flex flex-col items-center">

                    <Botao
                        texto="Comprar"
                        raio={20}
                        className="w-[clamp(50px,13.03vw,250px)] h-[clamp(30px,9vh,85px)] flex items-center justify-center text-center text-[clamp(15px,2.240vw,43px)] mb-[clamp(21px,3.175vh,30px)]"
                    />

                    <Botao
                        texto="Detalhes"
                        raio={20}
                        className="w-[clamp(50px,13.03vw,250px)] h-[clamp(30px,9vh,85px)] flex items-center justify-center text-center text-[clamp(15px,2.240vw,43px)] mb-[clamp(21px,6.35vh,60px)]"
                        onClick={() => router.push("/carta/1/descricao") }
                    />

                    <div className="text-[clamp(20px,1.98vw,38px)] text-white overflow-y-auto inventory-scrollbar">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam vitae dui eu orci laoreet egestas.
                    </div>

                </aside>

            </div>

        </main>
    )
}