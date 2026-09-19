"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";

export default function TelaLoja() {
    const router = useRouter();

    const moedas = 100;

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

    const pacotes = [
        "Normal",
        "Incomum",
        "Raro",
        "Épico",
        "Lendário"
    ];

    const fundos : string[] = []

    const ofertas: string[] = []

    const secoes: [string, string[]][] = [
            ["Ofertas", ofertas], 
            ["Pacotes", pacotes], 
            ["Cartas Avulsas", nomes], 
            ["Fundos de campo", fundos]
    ];

    const [indexSelecoes, setIndexSelecoes] = useState(2);

    function exibirCartas(indice: number) {
        const exibicoes = secoes[indice][1];
        if (exibicoes.length > 0) {
            return (exibicoes.map
                        ((nome, index) => (
                            <div 
                                key={index} 
                                className="w-full max-w-[209px] aspect-[209/301.4] bg-[#21366B] border-[5px] border-[#686868] rounded-[33px] shadow-sm flex items-center justify-center text-white text-[38px] text-center"
                            >
                                {nome}
                            </div>
                        ))
                    )
        }
        return ( <h1 className="absolute mt-[200px] text-[clamp(20px,3.125vw,45px)]">Função ainda em desenvolvimento</h1> )
    }

    return (
        <main className="relative h-screen bg-[#1B1B2F] flex justify-center xl:p-4">

            <div className="header-loja absolute top-[4.23vh] left-[2.083vw] right-[2.083vw] flex justify-between items-center">

                <Botao
                    texto="Voltar"
                    nomeIcone="voltar"
                    tamanhoIcone={40}
                    corDeFundo="transparent"
                    corDaBorda="transparent"
                    corDoTexto="#FFFFFF"
                    onClick={() => router.push("/")}
                    className="botao-sair-loja"
                />

                <h1 className="text-[53px] text-white">
                    Loja
                </h1>

                <h2 className="text_dinheiro text-[clamp(35px,2.760vw,53px)]">
                    Moedas: {moedas}G
                </h2>

            </div>
            
            <div className="loja-container w-[100vw] xl:w-[95vw] mt-[clamp(calc(65px+8vh),16vh,151.2px)] grid grid-cols-[15vw_1fr_15vw]">
                
                <aside className="min-h-0 h-full flex flex-col">
                    
                    {secoes.map((nome_e_itens, index) => (
                            <h2 
                                key={index} 
                                className="text-white text-[clamp(20px,1.98vw,38px)] mt-[clamp(21px,3.17vh,30px)] mb-[clamp(10px,7.41vh,70px)] ml-[clamp(10px,1.615vw,31px)]"
                                onClick={ () => setIndexSelecoes(index) }
                            >
                                • {nome_e_itens[0]}
                            </h2>
                        ))}

                </aside>

                <section className="min-h-0 overflow-y-auto inventory-scrollbar ml-[2vw] mr-[2vw]">

                    <div className="grid grid-cols-4 gap-[3vw] justify-items-center">

                        {exibirCartas(indexSelecoes)}

                    </div>

                </section>

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