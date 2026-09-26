"use client";

import { useRouter } from "next/navigation";
import Back from "@/components/ui/Back/Back";

export default function MontarBaralhoPage() {
  const router = useRouter();

  // Estilos base das cartas
  const cardBase = "w-20 h-32 md:w-24 md:h-36 rounded-2xl flex items-center justify-center transition-all";
  const cardAzul = `${cardBase} bg-[#1d386b] border-2 border-[#315699] text-white hover:scale-105 cursor-pointer`;
  const cardVerde = `${cardBase} bg-[#1c5d36] border-2 border-[#2a8750] text-white hover:scale-105 cursor-pointer`;
  const cardRoxo = `${cardBase} bg-[#4f1e73] border-2 border-[#7731a8] text-white hover:scale-105 cursor-pointer`;
  const cardDesativado = `${cardBase} bg-[#181921] border-2 border-[#292a36] text-gray-600 opacity-60`;
  const cardVazio = `${cardBase} bg-[#141525] border-2 border-[#2c3047]`;

  return (
    <div className="flex flex-col bg-custom-blue items-center w-full min-h-screen relative text-white p-6 justify-between">
      {/* Botão Voltar */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2.5 text-2xl sm:text-3xl cursor-pointer hover:scale-105 transition-all absolute left-6 top-6 sm:left-10 sm:top-10 text-white z-10"
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <Back />
        </div>
        <span>Voltar</span>
      </button>

      {/* Título Principal */}
      <div className="flex flex-col items-center mt-12 sm:mt-6 mb-2">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-wide">Montar Baralho</h1>
      </div>
     
      <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-16 my-6">
        {/* Seção de Baralho Atual de exemplo */}
        <div className="flex flex-col items-center">
          <p className="text-3xl mb-6">Baralho Atual (8/20)</p>

          <div className="grid grid-cols-5 gap-3 p-3">
            
            <div className={cardAzul}><p className="text-xl">Carta</p></div>
            <div className={cardAzul}><p className="text-xl">Carta</p></div>
            <div className={cardAzul}><p className="text-xl">Carta</p></div>
            <div className={cardAzul}><p className="text-xl">Carta</p></div>
            <div className={cardVerde}><p className="text-xl">Carta</p></div>

            
            <div className={cardRoxo}><p className="text-xl">Carta</p></div>
            <div className={cardRoxo}><p className="text-xl">Carta</p></div>
            <div className={cardRoxo}><p className="text-xl">Carta</p></div>
            <div className={cardVazio}></div>
            <div className={cardVazio}></div>
          </div>
        </div>

      {/* Seção de Inventário de exemplo */}
        <div className="flex flex-col items-center">
          <p className="text-3xl mb-6">Seu Inventario</p>

          <div className="grid grid-cols-5 gap-3 p-3">
           
            <div className={cardDesativado}><p className="text-xl">Carta</p></div>
            <div className={cardDesativado}><p className="text-xl">Carta</p></div>
            <div className={cardAzul}><p className="text-xl">Carta</p></div>
            <div className={cardAzul}><p className="text-xl">Carta</p></div>
            <div className={cardRoxo}><p className="text-xl">Carta</p></div>

            
            <div className={cardRoxo}><p className="text-xl">Carta</p></div>
            <div className={cardVerde}><p className="text-xl">Carta</p></div>
            <div className={cardAzul}><p className="text-xl">Carta</p></div>
            <div className={cardVerde}><p className="text-xl">Carta</p></div>
            <div className={cardDesativado}><p className="text-xl">Carta</p></div>
          </div>
        </div>
      </div>


      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-5xl px-8 pb-6 gap-6">
     
        {/* Campo de Nome do Baralho (Usei fieldset para o nome ficar dentro da linha)*/}
        <fieldset className="border border-gray-400 rounded-md px-4 py-1.5 w-full sm:w-96">
          <legend className="text-xs text-gray-300 px-1.5 ml-2">Nome do Baralho</legend>
          <input
            type="text"
            defaultValue="meuBaralho01"
            className="w-full bg-transparent text-white text-lg outline-none pb-1"
          />
        </fieldset>

        <button className="flex justify-center items-center px-10 py-3 cursor-pointer hover:scale-105 transition-all bg-[#1e2f57] rounded-xl border-2 border-amber-400 text-2xl font-semibold text-white shadow-md">
          Salvar
        </button>
      </div>
    </div>
  );
}
