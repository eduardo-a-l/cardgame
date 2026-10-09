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
        <main className="relative h-screen bg-[#1B1B2F] flex justify-center">
            
            {/*container geral*/}
            <div className="flex flex-col w-[78vw] h-full">

                {/*Barra Superior*/}
                <div className="flex items-center justify-center gap-[3vw] h-[15vh]">

                    <h1>Oponente</h1>

                    {exibirCarta("border-[#686868]", ["w-[80px]", ""], "h-[85px]", "", "Olá", "text-[20px]", "rounded-[8px]", "bg-[#363C4B]")}
                    {exibirCarta("border-[#686868]", ["w-[80px]", ""], "h-[85px]", "", "Olá", "text-[20px]", "rounded-[8px]", "bg-[#363C4B]")}
                    {exibirCarta("border-[#686868]", ["w-[80px]", ""], "h-[85px]", "", "Olá", "text-[20px]", "rounded-[8px]", "bg-[#363C4B]")}
                    {exibirCarta("border-[#686868]", ["w-[80px]", ""], "h-[85px]", "", "Olá", "text-[20px]", "rounded-[8px]", "bg-[#363C4B]")}
                    {exibirCarta("border-[#686868]", ["w-[80px]", ""], "h-[85px]", "", "Olá", "text-[20px]", "rounded-[8px]", "bg-[#363C4B]")}

                    <h1>Derrotados: 0/3</h1>

                </div>

                {/*Campo de Batalha */}
                <div className="flex items-center h-[53vh]">
                    {/*Carta Jogador*/}
                    <div className="flex items-center justify-center w-[50%] h-[100%] bg-[#363C4B]">
                        
                        <div className="flex flex-col">
                            <h1 className="text_dinheiro">Você</h1>
                            {exibirCarta("border-[#C8911A]", ["w-[250px]", ""], "h-[340px]", "", "Carta1", "text-[40px]", "rounded-[15px]", "bg-[#21366B]")}
                        </div>

                        <div className="flex flex-col">

                            <h1>Vida: XX</h1>

                        </div>

                    </div>
                    
                    {/*Carta Oponente*/}
                    <div className="flex items-center justify-center w-[50%] h-[100%] bg-[#363C4B]">
                        
                        <div className="flex flex-col">
                            <h1 className="text-[#686868]">Jogador 2</h1>
                            {exibirCarta("border-[#C8911A]", ["w-[250px]", ""], "h-[340px]", "", "Carta1", "text-[40px]", "rounded-[15px]", "bg-[#21366B]")}
                        </div>

                        <div className="flex flex-col">

                            <h1>Vida: XX</h1>

                        </div>

                    </div>

                </div>

                {/*Barra Inferior*/}
                <div className="flex flex-col h-[32vh]">

                    <div className="flex justify-around">

                        <h1>Jogador 1</h1>

                        <h1>Derrotados 0/3</h1>

                    </div>

                    <div className="flex justify-around items-center h-[100%]">

                        {exibirCarta("border-[#686868]", ["w-[150px]", ""], "h-[220px]", "", "Carta", "text-[20px]", "rounded-[25px]", "bg-[#21366B]")}
                        {exibirCarta("border-[#686868]", ["w-[150px]", ""], "h-[220px]", "", "Carta", "text-[20px]", "rounded-[25px]", "bg-[#21366B]")}
                        {exibirCarta("border-[#686868]", ["w-[150px]", ""], "h-[220px]", "", "Carta", "text-[20px]", "rounded-[25px]", "bg-[#21366B]")}
                        {exibirCarta("border-[#686868]", ["w-[150px]", ""], "h-[220px]", "", "Carta", "text-[20px]", "rounded-[25px]", "bg-[#21366B]")}
                        {exibirCarta("border-[#686868]", ["w-[150px]", ""], "h-[220px]", "", "Carta", "text-[20px]", "rounded-[25px]", "bg-[#21366B]")}

                        <div className="flex flex-col items-center justify-center gap-[20px] justify-end">

                            <div className="flex gap-[20px]">

                                <Botao
                                    texto="Ação 1"      
                                    raio={20}
                                    className="w-[150px] h-[70px] flex items-center justify-center text-center text-[30px]"
                                />

                                <Botao
                                    texto="Ação 2"      
                                    raio={20}
                                    className="w-[150px] h-[70px] flex items-center justify-center text-center text-[30px]"
                                />

                            </div>

                            <Botao
                                    texto="Passar o turno"      
                                    raio={20}
                                    className="w-[250px] h-[70px] flex items-center justify-center text-center text-[30px]"
                                />

                        </div>

                    </div>

                </div>

            </div>

            <aside className="w-[22vw]"></aside>

        </main>
    )
}