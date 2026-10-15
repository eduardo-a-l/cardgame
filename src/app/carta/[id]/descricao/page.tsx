"use client"

import {useParams} from "next/navigation";

import { useRouter } from "next/navigation";
import Back from "@/components/ui/Back/Back";
import DescricaoCarta from "@/components/ui/DescricaoCarta/DescricaoCarta";
import CardCarta from "@/components/ui/CardCarta/CardCarta";
import { useEffect, useState } from "react";
import { Carta } from "@/types/Carta";


export default function DescricaoPage() 
{
    const params = useParams<{id: string}>();
    const router = useRouter();
    const [carta, setCarta] = useState<Carta | null>(null);

    useEffect(() => {
        if (!params.id) return;
        fetch(`http://localhost:8081/cartas/${params.id}`)
            .then(response => response.ok ? response.json() : null)
            .then(data => {
                if (data) setCarta(data);
            })
            .catch(error => console.error("Erro ao carregar detalhes:", error));
    }, [params.id]);

    return (
        <div className="flex flex-col bg-custom-blue items-center w-full min-h-screen relative overflow-x-hidden p-4 sm:p-6 md:p-8">
            <button 
                onClick={() => router.back()} 
                className="flex items-center gap-2 text-[clamp(1.25rem,2.5vmin,1.75rem)] cursor-pointer hover:scale-105 transition-all absolute left-[clamp(1rem,3vw,2.5rem)] top-[clamp(1rem,3vh,2rem)] text-white z-10"
            >
                <span className="w-[clamp(1.5rem,2.8vmin,2rem)] h-[clamp(1.5rem,2.8vmin,2rem)] flex items-center justify-center">
                    <Back />
                </span>
                Voltar
            </button>

            <div className="flex flex-col mt-[clamp(2.5rem,6vh,4rem)] mb-[clamp(1rem,3vh,2rem)] text-center">
                <h1 className="text-[clamp(1.75rem,3.8vmin,2.75rem)] font-bold text-white">
                    Detalhes: {carta?.Nome || "Carta"}
                </h1>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-[clamp(1.5rem,3vw,3rem)] w-full max-w-5xl mx-auto text-[clamp(1rem,1.8vmin,1.35rem)]">
                <CardCarta id={params.id} />
                <div className="flex flex-col w-full md:w-[clamp(20rem,35vw,30rem)] max-w-full h-[clamp(320px,46vh,440px)] overflow-y-auto p-[clamp(1rem,2vw,1.5rem)]">
                    <DescricaoCarta className="flex flex-col text-[clamp(1.25rem,1.8vmax,1.30rem)]" id={params.id} />
                </div>
            </div>

            <div className="flex justify-center md:justify-end w-full max-w-5xl mx-auto mt-[clamp(1rem,2.5vh,1.75rem)]">
                <button className="flex flex-col items-center justify-center w-[clamp(9rem,13vw,13rem)] h-[clamp(4.25rem,7.5vh,5rem)] cursor-pointer hover:scale-105 transition-all bg-blue-950 rounded-xl border-3 border-amber-500 py-1 shadow-lg">
                    <p className="text-[clamp(1.35rem,2.4vmin,1.75rem)] font-bold">Vender</p>
                    <p className="text-[clamp(0.85rem,1.5vmin,1.05rem)] text-green-400 font-semibold">+50%G</p>
                </button>
            </div>
        </div>
    );
}


 