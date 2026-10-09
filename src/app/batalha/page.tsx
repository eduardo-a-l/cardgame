"use client";

import { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import { NomeIcone } from "@/components/ui/Icone";
import { Icone } from "@/components/ui/Icone";

interface ItemLoja {
    idCarta: number,
    desconto: number,
    ehOferta: number,
    ativo: number,
    carta_nome: string,
    carta_tipo: string,
    carta_raridade: string,
    carta_precoPadrao: number,
    carta_vida?: number,
    carta_acao1: string,
    carta_acao2?: string
}

export default function TelaBatalha() {
    const router = useRouter();

    const [itens, setItens] = useState<ItemLoja[]>([]);

    useEffect(() => {
        async function carregarDados() {
            const usuarioSalvo = localStorage.getItem("usuario");

            if (!usuarioSalvo) {
                router.push("/login");
                return;
            }

            const usuarioLocal = JSON.parse(usuarioSalvo);

            const responseItens = await fetch(
                `http://localhost:8081/Loja/itens/${usuarioLocal.idUsuario}`
            );

            if (responseItens.ok) {
                const dadosLoja: ItemLoja[] = await responseItens.json();
                setItens(dadosLoja);
            }
        }
        carregarDados
    }, [router]);

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
                         borderRadius: string, fundo: string, 
                         clickable: boolean, proporcional: boolean = false) 
                         : JSX.Element {

        let click = ""
        if (clickable)
            click = "cursor-pointer"
        if (proporcional)
            altura = "aspect-[185.74/252]"

        return (
            <div className={`${largura[0]} ${altura} border-[5px] ${borda} ${borderRadius} ${fundo} flex flex-col items-center justify-center ${click}`}>
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
        <main className="relative h-screen bg-[#1B1B2F] flex justify-center overflow-y-auto inventory-scrollbar">
            
            {/*container geral*/}
            <div className="flex flex-col w-[78vw] h-full">

                {/*Barra Superior*/}
                <div className="flex items-center justify-center gap-[3vw] h-[15vh]">

                    <h1 className="text-[52px]">Oponente</h1>

                    {exibirCarta("border-[#686868]", ["w-[clamp(50px,4.167vw,80px)]", ""], "h-[clamp(55px,7.8704vh,85px)]", "", "", "", "rounded-[18px]", "bg-[#363C4B]", false)}
                    {exibirCarta("border-[#686868]", ["w-[clamp(50px,4.167vw,80px)]", ""], "h-[clamp(55px,7.8704vh,85px)]", "", "", "", "rounded-[18px]", "bg-[#363C4B]", false)}
                    {exibirCarta("border-[#686868]", ["w-[clamp(50px,4.167vw,80px)]", ""], "h-[clamp(55px,7.8704vh,85px)]", "", "", "", "rounded-[18px]", "bg-[#363C4B]", false)}
                    {exibirCarta("border-[#686868]", ["w-[clamp(50px,4.167vw,80px)]", ""], "h-[clamp(55px,7.8704vh,85px)]", "", "", "", "rounded-[18px]", "bg-[#363C4B]", false)}
                    {exibirCarta("border-[#686868]", ["w-[clamp(50px,4.167vw,80px)]", ""], "h-[clamp(55px,7.8704vh,85px)]", "", "", "", "rounded-[18px]", "bg-[#363C4B]", false)}

                    <h1 className="text-[clamp(22px,1.875vw,36px)]" style={{ color : "red" }}>
                        Derrotados: 0/3
                    </h1>

                </div>

                {/*Campo de Batalha */}
                <div className="flex items-center h-[53vh]">
                    {/*Carta Jogador*/}
                    <div className="flex items-center justify-center w-[50%] h-[100%] bg-[#363C4B]  gap-[20px]">
                        
                        <div className="flex flex-col">
                            <h1 className="text_dinheiro text-[30px]">Você</h1>
                            {exibirCarta("border-[#C8911A]", ["w-[clamp(180px,13.0208vw,250px)]", ""], "h-[clamp(240px,31.4815vh,340px)]", "", "Carta1", "text-[40px]", "rounded-[15px]", "bg-[#21366B]", true, true)}
                        </div>

                        <div className="flex flex-col justify-start gap-[10px] h-[clamp(240px,31.4815vh,340px)] mt-[50px]">

                            <h1 className="text-[30px]">Vida: XX</h1>

                        </div>

                    </div>
                    
                    {/*Carta Oponente*/}
                    <div className="flex items-center justify-center w-[50%] h-[100%] bg-[#363C4B] gap-[20px]">
                        
                        <div className="flex flex-col">
                            <h1 className="text-[30px]" style={{ color: "#B4B4B4" }}>
                                Jogador 2
                            </h1>
                            {exibirCarta("border-[#C8911A]", ["w-[clamp(180px,13.0208vw,250px)]", ""], "h-[clamp(240px,31.4815vh,340px)]", "", "Carta1", "text-[40px]", "rounded-[15px]", "bg-[#21366B]", true, true)}
                        </div>

                        <div className="flex flex-col justify-start gap-[10px] h-[clamp(240px,31.4815vh,340px)] mt-[50px]">

                            <h1 className="text-[30px]">Vida: XX</h1>

                        </div>

                    </div>

                </div>

                {/*Barra Inferior*/}
                <div className="flex flex-col h-[32vh]">

                    <div className="flex justify-between items-center pl-[45px] pr-[45px]">

                        <h1 className="text-[45px]">Jogador 1</h1>

                        <h1 className="text-[35px]" style={{ color : "red" }}>
                            Derrotados 0/3
                        </h1>

                    </div>

                    <div className="flex justify-around items-center h-[100%]">

                        {exibirCarta("border-[#686868]", ["w-[clamp(100px,7.8125vw,150px)]", ""], "h-[clamp(150px,20.3704vh,220px)]", "", "Carta", "text-[20px]", "rounded-[25px]", "bg-[#21366B]", true)}
                        {exibirCarta("border-[#686868]", ["w-[clamp(100px,7.8125vw,150px)]", ""], "h-[clamp(150px,20.3704vh,220px)]", "", "Carta", "text-[20px]", "rounded-[25px]", "bg-[#21366B]", true)}
                        {exibirCarta("border-[#686868]", ["w-[clamp(100px,7.8125vw,150px)]", ""], "h-[clamp(150px,20.3704vh,220px)]", "", "Carta", "text-[20px]", "rounded-[25px]", "bg-[#21366B]", true)}
                        {exibirCarta("border-[#686868]", ["w-[clamp(100px,7.8125vw,150px)]", ""], "h-[clamp(150px,20.3704vh,220px)]", "", "Carta", "text-[20px]", "rounded-[25px]", "bg-[#21366B]", true)}
                        {exibirCarta("border-[#686868]", ["w-[clamp(100px,7.8125vw,150px)]", ""], "h-[clamp(150px,20.3704vh,220px)]", "", "Carta", "text-[20px]", "rounded-[25px]", "bg-[#21366B]", true)}

                        <div className="flex flex-col items-end gap-[25px] w-[32%] pr-[30px]">

                            <div className="flex justify-between w-[100%] gap-[20px]">

                                <Botao
                                    texto="Ação 1"      
                                    raio={20}
                                    borda="border-[5px]"
                                    className="w-[clamp(105px,9.4729vw,155px)] h-[clamp(45px,9.4815vh,70px)] flex items-center justify-center text-center text-[clamp(10px,1.5625vw,30px)]"
                                />

                                <Botao
                                    texto="Ação 2"      
                                    raio={20}
                                    borda="border-[5px]"
                                    className="w-[clamp(105px,9.4729vw,155px)] h-[clamp(45px,9.4815vh,70px)] flex items-center justify-center text-center text-[clamp(10px,1.5625vw,30px)]"
                                />

                            </div>

                            <Botao
                                texto="Passar o turno"      
                                raio={20}
                                borda="border-[5px]"
                                className="w-[clamp(180px,16.1313vw,255px)] h-[clamp(45px,9.4815vh,70px)] flex items-center justify-center text-center text-[clamp(10px,1.5625vw,30px)]"
                            />

                        </div>

                    </div>

                </div>

            </div>
            {/*Barra Lateral*/}
            <aside className="w-[22vw] border-l-[7px] border-[#C8911A]">

                {/*Log de Batalha*/}
                <div className="h-[85vh] flex flex-col justify-center">

                    <h1 className="text-[clamp(24px,2.5833vw,40px)] text-center">Log de Batalha</h1>

                    <div className="h-[80%] w-[95%]"></div>

                </div>

                {/*Desistir*/}
                <div className="h-[15vh] flex justify-center items-center border-t-[7px] border-[#C8911A]">

                    <Botao
                        texto="Desistir"
                        raio={20}
                        borda="border-[5px]"
                        className="w-[clamp(200px,15.625vw,300px)] h-[clamp(65px,11.2593vh,100px)] flex items-center justify-center text-center text-[clamp(30px,2.6042vw,50px)]"
                    />

                </div>

            </aside>

        </main>
    )
}