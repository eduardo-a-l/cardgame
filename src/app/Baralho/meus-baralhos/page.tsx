"use client";

import { useRouter } from "next/navigation";
import Back from "@/components/ui/Back/Back";

export default function MeusBaralhosPage() {
    const router = useRouter(); 

    return (
          <div className="flex flex-col bg-custom-blue items-center w-full min-h-screen relative">
        
                <button 
                    onClick={() => router.back()}
                    className="flex justify-center w-40 h-10 cursor-pointer hover:scale-105 transition-all gap-1.5 text-4xl mt-10 ml-10 absolute left-0 top-0 text-white"
                >
                    <Back/>
                    Voltar
                </button>

            <div className="flex flex-col mt-22">
                <p className="text-3xl mb-12">Meus Baralhos</p>
            </div>
                
           <div className="flex justify-center w-screen overflow-auto pl-40 "> {/* Container dos Cards */}

            <div className="flex flex-col justify-start w-90 h-96 overflow-auto "> {/* Coluna de Cards */}
            {
                // Preencher com a API posteriormente
               Array.from({ length: 5 }).map((_, i) => 
                (
                    <button key={i} className="bg-blue-950 border-2 rounded-md border-gray-500 transition-all hover:scale-105 cursor-pointer w-40 h-11 ml-3 text-2xl mt-5">
                        <p>Baralho {i + 1}</p>
                    </button>
                )
                

            )}

            </div>

            <div className="flex flex-col justify-start w-90 h-96 overflow-auto "> {/* Coluna de Cards */}
            {
                // Preencher com a API posteriormente
               Array.from({ length: 5 }).map((_, i) => 
                (
                    <button key={i} className="bg-blue-950 border-2 rounded-md border-gray-500 transition-all hover:scale-105 cursor-pointer w-40 h-11 ml-3 text-2xl mt-5">
                        <p>Baralho {i + 6}</p>
                    </button>
                )
                

            )}

            </div>



            </div>

            <div className="flex w-full  mt-8 ">
                <button 
                    onClick={() => router.push("/Baralho/montar-baralho")}
                    className="flex flex-col items-center w-50 pt-1 h-13 cursor-pointer hover:scale-105 transition-all bg-blue-950 rounded-md border-2 border-amber-500 text-4xl ml-auto"
                >
                    <p>Editar</p> 
                </button>

                <button className="flex flex-col items-center w-50 h-13 cursor-pointer hover:scale-105 transition-all bg-blue-950 rounded-md border-2 border-amber-500 text-4xl pt-1 ml-48  mr-auto">
                    <p>Excluir</p>
                </button>

            </div>

            <button 
                onClick={() => router.push("/Baralho/montar-baralho")}
                className="flex flex-col items-center w-60 h-13 cursor-pointer hover:scale-105 transition-all bg-blue-950 rounded-md border-2 border-amber-500 text-4xl pt-1 mt-10"
            >
                <p> + Criar Novo</p>

            </button>

            </div>
    );}