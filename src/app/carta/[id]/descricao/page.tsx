"use client"

import {useParams} from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Back from "@/components/ui/Back/Back";
import { Botao } from "@/components/ui/Botao";
import  CardCarta from "@/components/ui/CardCarta/CardCarta"

export default function DescricaoPage() 
{
const params = useParams<{id: string}>();



return (
    <div className="flex flex-col bg-custom-blue items-center w-screen h-screen relative">

        <button className=" flex justify-center w-40 h-10 cursor-pointer hover:scale-105 transition-all gap-1.5 text-4xl mt-10 ml-10 absolute left-0 top-0 text-white">
            <Back/>
            Voltar
        </button>

        <div className="flex flex-col mt-22">
        <p className="text-3xl mb-12">Detalhes: Carta</p> {/* Fazer com o Back depois */}
            </div>

        <div className="flex">
            <div className="flex flex-col pl-5 pb-2.5 justify-end bg-blue-950 rounded-md border-3 mr-20  border-gray-500 w-50 h-70">
                <p className="text-2xl ml-13">Carta</p> {/*Fazer com o back*/}
                <p className="text-1xl pl-13 ">HP: 100</p> 
            </div>

            <CardCarta className="h-90 flex overflow-y-auto flex-col"></CardCarta>
            
        </div>

            <div className="flex justify-end w-screen">
                <button className="flex pt-2 flex-col w-40 mr-20 mt-25 h-16 cursor-pointer hover:scale-105 transition-all bg-blue-950 rounded-md border-2 border-amber-500">
                    <p className="text-2xl">Vender</p>
                    <p className="text-1xl text-green-500">+50%G</p> {/* Dado API */}
                </button>
            </div>


    </div>
)




}


 