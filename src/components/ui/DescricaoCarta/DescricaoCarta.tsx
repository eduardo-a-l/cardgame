import { Carta } from "@/types/Carta";
import { useEffect, useState } from "react";

type LinhaDescricao = 
{
    cor?: string;
    rotulo?: string;
    valor?: string;
    text?: string;
    className: string;
    
}

interface DescricaoCartaProps {
    className: string;
    id?: string;
}

export default function DescricaoCarta({className = "", id}: DescricaoCartaProps)
{
 const [Conteudo, setConteudo] = useState<LinhaDescricao[]>(DefaultCarta());
 
 useEffect(() => {
    async function fetchCarta() {
        if (id) {
            try {
                const response = await fetch(`http://localhost:8081/cartas/${id}`);
                if (response.ok) {
                    const carta: Carta = await response.json();
                    setConteudo(ExtrairDescricao(carta));
                } else {
                    console.error("Erro ao buscar carta:", response.status);
                }
            } catch (error) {
                console.error("Erro ao buscar carta:", error);
            }
        }
    }

    fetchCarta();
}, [id]);

    return (
        <div className={className}> 
            {Conteudo.map((item, i) => {
                if (item.rotulo) {
                    return (
                        <p key={i} className={item.className}>
                            <span className="text-gray-300">{item.rotulo} </span>
                            <span className={item.cor || "text-white"}>{item.valor}</span>
                        </p>
                    );  
                } else {
                    return (
                        <p key={i} className={`${item.className} ${item.cor || ""}`}>
                            {item.text}
                        </p>
                    );
                }
            })}
        </div>
    );
}

function DefaultCarta() : LinhaDescricao[] 
{
    return [
        { text: "Tipo: Personagem", className: "py-0.5" },
        { className: "py-0.5", rotulo: "Raridade:", valor: "Comum", cor: "text-green-400" },
        { className: "py-0.5", rotulo: "Preço:", valor: "10G", cor: "text-yellow-400" },
        { text: "", className: "h-[clamp(0.5rem,1.2vh,0.85rem)]" },
        { text: "[Ação 1]", className: "py-0.5 font-bold", cor: "text-yellow-500" },
        { text: "Bola De Fogo", className: "py-0.5 font-medium" },
        { text: "Lança uma bola de fogo legal", className: "py-0.5 text-gray-300" },
        { text: "Cuidado para não se queimar", className: "py-0.5 text-gray-400 italic text-[clamp(0.85rem,1.4vmin,1.1rem)]" },
        { text: "", className: "h-[clamp(0.5rem,1.2vh,0.85rem)]" },
        { text: "[Ação 2]", className: "py-0.5 font-bold", cor: "text-yellow-500" },
        { text: "Xingamento pesado", className: "py-0.5 font-medium" },
        { text: "Causa dano emocional", className: "py-0.5 text-gray-300" }
    ];
}

function ExtrairDescricao(carta: Carta) : LinhaDescricao[]
{
    const VetLinhas: LinhaDescricao[] = [];

    if (carta.Tipo) {
        VetLinhas.push({ text: `Tipo: ${carta.Tipo}`, className: "py-0.5" });
    }
        
    if (carta.Raridade) {                                                                                                                                                                                               
        let cor = "text-green-400";                                                                                                                                                                                     
        if (carta.Raridade === "Incomum") cor = "text-emerald-400";                                                                                                                                                     
        if (carta.Raridade === "Raro") cor = "text-blue-400";                                                                                                                                                           
        if (carta.Raridade === "Ultra Raro" || carta.Raridade === "Epico") cor = "text-purple-400";                                                                                                                     
        if (carta.Raridade === "Lendário") cor = "text-yellow-400";                                                                                                                                                     
                                                                                                                                                                                                                        
        VetLinhas.push({                                                                                                                                                                                                
            className: "py-0.5",                                                                                                                                                                                         
            rotulo: "Raridade:",                                                                                                                                                                                         
            valor: carta.Raridade,                                                                                                                                                                                      
            cor                                                                                                                                                                                                         
        });                                                                                                                                                                                                             
    }  
        
    if (carta.PrecoPadrao) {
        VetLinhas.push({ className: "py-0.5", rotulo: "Preço:", valor: `${carta.PrecoPadrao}G`, cor: "text-yellow-400" });
    }
        
    if (carta.Acao1) {
        VetLinhas.push({ className: "h-[clamp(0.5rem,1.2vh,0.85rem)]", text: "" });
        VetLinhas.push({ text: carta.Tipo !== "Personagem" ? "[Efeito]" : "[Ação 1]", className: "py-0.5 font-bold", cor: "text-yellow-500" });
        VetLinhas.push({ text: carta.Acao1, className: "py-0.5 text-gray-200" });
    }

    if (carta.Acao2) {
        VetLinhas.push({ className: "h-[clamp(0.5rem,1.2vh,0.85rem)]", text: "" });
        VetLinhas.push({ text: "[Ação 2]", className: "py-0.5 font-bold", cor: "text-yellow-500" });
        VetLinhas.push({ text: carta.Acao2, className: "py-0.5 text-gray-200" });
    }

    return VetLinhas;     
}
