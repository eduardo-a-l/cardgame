'use client'
import { useEffect, useState } from "react";
import { Carta } from "@/types/Carta";



export default function CardCarta({ id }: { id?: string }) 
{
    const [Carta, setCarta] = useState<Carta | null>(null);

    useEffect(() => {
        async function fetchCarta() {
            if (!id) return;
            try {
                const response = await fetch(`http://localhost:8081/cartas/${id}`);
                if (response.ok) {
                    const cartaData: Carta = await response.json();
                    setCarta(cartaData);
                } else {
                    console.error("Erro ao buscar carta:", response.status);
                }
            } catch (error) {
                console.error("Erro ao buscar carta:", error);
            }
        }
        fetchCarta();
    }, [id]);

    const nome = Carta?.Nome || "Carta";
    const vida = Carta?.Vida ?? 100;

    return (
        <div className="flex flex-col pb-6 justify-end bg-blue-950 rounded-xl border-[5px] border-gray-500 w-[clamp(15rem,22vw,20rem)] h-[clamp(320px,46vh,440px)] shrink-0 shadow-xl">
            <div className="flex justify-center items-center">
                <div className="flex flex-col justify-center items-center gap-1">
                    <p className="text-[clamp(1.20rem,1.8vmax,2.2rem)] font-bold text-center px-3">{nome}</p>
                    {vida !== null && vida !== undefined && (
                        <p className="text-[clamp(1.1rem,1.7vmax,1.8rem)] text-gray-300">HP: {vida}</p>
                    )}
                </div>
            </div>
        </div>
    );
}