"use client";

import { NomeIcone } from "@/components/ui/Icone";
import { useState } from "react"
import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import { Icone } from "@/components/ui/Icone";

export default function TelaPerfil() {
    const router = useRouter();
    const nome = "NomeUsuário"; // Será substituído pelo nome real futuramente
    const [pinBatalha, setPIN] = useState("0000");
    const [input, setInput] = useState("");
    const posicao = 1, pontos = 3450, moedas = 100, vitorias = 15, derrotas = 3; 

    const conquistas: [string, boolean][] = [
        ["Espada", true],
        ["Escudo", false],
        ["Arco", false],
        ["Poção", false],
        ["Capacete", false],
        ["Armadura", false],
        ["Machado", false],
        ["Lança", true],
        ["Arco Mágico", false],
        ["Anel", false]
    ];

    return (
        <main className="relative min-h-screen bg-[#1B1B2F] flex items-center justify-center w-full">

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
            
            <div className="w-[97.5vw] xl:w-[92.5vw] 2xl:w-[87.5vw] mt-12 overflow-y-auto inventory-scrollbar flex flex-col">

                <div className="flex w-full justify-center mt-[100px] gap-[clamp(25px,13.02vw,250px)]">

                    <div className="flex flex-col items-center gap-6"
                         style = {{ width: "31.25vw" }}>

                        <div className="flex items-center gap-[clamp(35px,2.760vw,53px)] mb-13">

                            <Icone nome="usuario" tamanho="clamp(40px,3.125vw,60px)"/>
                            <h1 className="text-[clamp(40px,4vw,77px)] text-white">{nome}</h1>

                        </div>

                        <h2 className="text-[clamp(28px,2.083vw,40px)]">PIN de Batalha Atual: {pinBatalha}</h2>

                        <div className="flex flex-col mb-13"> 

                            <label htmlFor="pinBatalha" className="text-[clamp(35px,2.760vw,53px)] text-white">
                                Alterar PIN de Batalha:
                            </label>

                            <input
                                type="number"
                                onKeyDown={(e) => {
                                if (e.key === "e" || e.key === "E") {
                                    e.preventDefault();
                                }
                                }}
                                name="pinBatalha"
                                id="pinBatalha" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Digite o novo PIN"
                                className="bg-[#262647] text-white rounded-[5px] text-[clamp(21px,1.5vw,30px)] px-[clamp(22px,1.615vw,31px)] py-[clamp(10px,0.677vw,13px)] border border-indigo-500 focus:border-[#C8911A] outline-none"
                            />

                        </div>

                        <Botao
                            texto="Salvar PIN"
                            raio={20}
                            className="w-[clamp(250px,18.229vw,350px)] h-[clamp(70px,10.582vh,100px)] flex items-center justify-center text-center text-[clamp(30px,2.240vw,43px)]"
                            onClick={() => {
                                if (input.length == 4) { setPIN(input) }
                            }}
                        />

                    </div>

                    <div className="flex flex-col items-center gap-6"
                         style = {{ width: "31.25vw" }}>

                        <div className="flex items-center gap-[clamp(35px,2.760vw,53px)] mb-8">

                            <Icone nome="leaderboard" tamanho="clamp(40px,3.125vw,60px)"/>
                            <h1 className="text-[clamp(40px,4vw,77px)] text-white">Posição: {posicao}°</h1>

                        </div>

                        <h1 className="text-[clamp(40px,3.125vw,60px)]">Pontos: {pontos}</h1>

                        <h1 className="text-[clamp(40px,3.125vw,60px)]">Moedas: {moedas}G</h1>

                        <h1 className="text-[clamp(40px,3.125vw,60px)]">Vitórias: {vitorias}</h1>

                        <h1 className="text-[clamp(40px,3.125vw,60px)]">Derrotas: {derrotas}</h1>

                    </div>

                </div>

                <div className="flex flex-col items-center justify-center mt-30 w-full">
                    
                    <h1 className="text-[77px]">Conquistas</h1>

                    <div className="grid grid-cols-5 mt-15 mb-25 w-full gap-x-[0.5vw] md:gap-x-[2vw] lg:gap-x-[4vw] xl:gap-x-[5.85vw] 2xl:gap-x-[8.85vw] gap-y-[4vh] lg:gap-y-[8vh] xl:gap-y-[10vh] 2xl:gap-y-[13.76vh]">

                        {conquistas.map((conquista, index) => {
                            let cor = "";
                            let img: NomeIcone = "cadeado";
                            if (conquista[1]) { cor = "#C8911A";
                                                img = conquista[0].toLowerCase() as NomeIcone }

                            else              { cor = "#686868"; 
                                                img = "cadeado"}

                            return (
                            <div key={index} className="flex flex-col text-center items-center justify-center"> 

                                <div 
                                    className={"w-[10.4167vw] aspect-square rounded-[5px] shadow-sm flex items-center justify-center"}
                                    style={{ backgroundColor: cor }}
                                >
                                    <Icone nome={img} tamanho="9.375vw"/>
                                </div>

                                <h1 className="text-[20px]">Conquista #{index + 1}</h1>
                                <h2 className="text-[15px]">{conquista[0]}</h2>

                            </div>
                            );
                        })}

                    </div>

                </div>

            </div>

        </main>
    )
}