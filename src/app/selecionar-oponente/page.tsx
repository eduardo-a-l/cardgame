"use client";
import React, { use, useState } from "react";
import { Botao } from "@/components/ui/Botao";
import { Icone } from "@/components/ui/Icone";
import { BotaoIcone } from "@/components/ui/BotaoIcone";
import Back from "@/components/ui/icons/Back";
import { useRouter } from "next/navigation";
export default function Selecionar_oponente() {
  const [ListaOponentes, setListaOponentes] = useState(
    Array.from({ length: 10 }, (_, index) => `Oponente ${index + 1}`),
  );
  const [Aberto, setAberto] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [pin, setPin] = useState("");
  const router = useRouter();

  return (
    <div className=" bg-gray-900 min-h-screen min-w-screen flex justify-center">
      <div className="bg-blue flex flex-col min-h-screen max-w-full w-full relative shadow-black shadow-2xl">
        <button
          className="w-44 h-12 hover:scale-105 transition-all flex justify-center cursor-pointer text-white text-4xl ml-8 mt-10 gap-2.5"
          onClick={() => router.push("/")}
        >
          {" "}
          <Back className="h-11 w-11" /> Voltar
        </button>

        <div className="flex  justify-center">
          <p className="text-5xl text-white mt-13">Selecionar oponente</p>
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between pr-15 pl-15 w-full text-3xl mt-40">
            <p className="text-white">Usuário</p>
            <p className="text-white">PIN de Batalha {}</p>
          </div>
          <div className="flex justify-between pr-15 pl-15">
            <div className="relative">
              <input
                type="text"
                readOnly
                value={usuario || "Escolher Oponente"}
                className={`  border border-gray-500 w-100 pl-2  h-10 ${!(usuario != "") ? "text-gray-400" : ""}`}
              />
              <button
                className="absolute right-0 pr-2.5 pt-2 cursor-pointer text-white hover:scale-105 transition-all"
                onClick={() => setAberto(!Aberto)}
              >
                {Aberto ? "▼" : "▲"}
              </button>
              {Aberto && (
                <ul className="absolute right-0    w-100  transition-all shadow-black shadow-2xl border-b border-r border-l border-gray-500">
                  {ListaOponentes?.map((User, index) => (
                    <li
                      key={index}
                      className="pl-3.5 pb-1 cursor-pointer    hover:border-2 hover:border-white text-white pl-38 transition-all border-b border-b-gray-500"
                      onClick={() => {
                        setAberto(false);
                        setUsuario(User);
                      }}
                    >
                      {User}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input
              placeholder="Digite o PIN"
              type="text"
              className="bg-blue-800 border border-white text-white rounded-md pl-2 h-10 w-100"
            ></input>
          </div>

          <div className="flex justify-center">
            <Botao
              texto="Continuar"
              className="w-50 cursor-pointer  h-14 text-3xl place-content-center bg-blue-900 rounded-md border-3 border-amber-400 mt-60 hover:scale-105 transition-all"
            ></Botao>
          </div>
        </div>
      </div>
    </div>
  );
}
