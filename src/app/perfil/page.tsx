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
        <main className="relative min-h-screen bg-[#1B1B2F] flex items-center justify-center w=full">

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
            
            <div className="mt-12 overflow-y-auto inventory-scrollbar flex flex-col w=full">

                <div className="flex w-full items-center justify-center"
                     style = {{ gap: "250px",
                                marginTop: 100
                      }}>

                    <div className="flex flex-col items-center gap-6 shrink-0"
                         style = {{ width: "600px" }}>

                        <div className="flex items-center gap-13 mb-13">

                            <Icone nome="usuario" tamanho={60}/>
                            <h1 className="text-[77px] text-white">{nome}</h1>

                        </div>

                        <h2 className="text-[40px]">PIN de Batalha Atual: {pinBatalha}</h2>

                        <div className="flex flex-col mb-13"> 

                            <label htmlFor="pinBatalha" className="text-[53px] text-white">
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
                                className="bg-[#262647] text-white rounded-[5px] text-[30px] px-[31px] py-[13px] border border-indigo-500 focus:border-[#C8911A] outline-none"
                            />

                        </div>

                        <Botao
                            texto="Salvar PIN"
                            raio={20}
                            className="w-[350px] h-[100px] flex items-center justify-center text-center text-[43px]"
                            onClick={() => {
                                if (input.length == 4) { setPIN(input) }
                            }}
                        />

                    </div>

                    <div className="flex flex-col items-center gap-6 shrink-0"
                         style = {{ width: "600px" }}>

                        <div className="flex items-center gap-13 mb-8">

                            <Icone nome="leaderboard" tamanho={60}/>
                            <h1 className="text-[77px] text-white">Posição: {posicao}°</h1>

                        </div>

                        <h1 className="text-[60px]">Pontos: {pontos}</h1>

                        <h1 className="text-[60px]">Moedas: {moedas}G</h1>

                        <h1 className="text-[60px]">Vitórias: {vitorias}</h1>

                        <h1 className="text-[60px]">Derrotas: {derrotas}</h1>

                    </div>

                </div>

                <div className="flex flex-col items-center justify-center mt-30 w=full">
                    
                    <h1 className="text-[77px]">Conquistas</h1>

                    <div className="grid grid-cols-5 mt-15 mb-25 w=full"
                         style = {{ 
                            columnGap: "170px", 
                            rowGap:    "130px"        
                          }}>

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
                                    className={"w-[200px] h-[200px] rounded-[5px] shadow-sm flex items-center justify-center"}
                                    style={{ backgroundColor: cor }}
                                >
                                    <Icone nome={img} tamanho={180}/>
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