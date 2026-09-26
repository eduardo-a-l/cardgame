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
                
            <div className="flex flex-col justify-start w-150 h-96 overflow-auto"> {/* Container de Cards */}
            
                    <div className="flex flex-wrap gap-4 mt-4 justify-between w-150 p-2"> {/* Fileira de Cards */}

                    <button className="text-white text-3xl mt-0.5 cursor-pointer transition-all hover:scale-105 ml-10 ">
                        <div className="flex justify-center bg-blue-950 rounded-lg border-3 mr-20  border-gray-500 w-50 h-12"> {/*Card exemplo*/}
                            <p className="text-white text-3xl pt-0.5">Baralho 1</p>
                        </div> 
                    </button>

                </div>
            </div>

            <div className="flex w-full justify-around mt-25">
                <button 
                    onClick={() => router.push("/Baralho/montar-baralho")}
                    className="flex flex-col items-center w-40 pt-1 h-12 cursor-pointer hover:scale-105 transition-all bg-blue-950 rounded-md border-2 border-amber-500 text-3xl"
                >
                    <p>Editar</p> 
                </button>
                <button className="flex flex-col items-center w-40 h-12 cursor-pointer hover:scale-105 transition-all bg-blue-950 rounded-md border-2 border-amber-500 text-3xl pt-1">
                    <p>Excluir</p>
                </button>
            </div>

            <button 
                onClick={() => router.push("/Baralho/montar-baralho")}
                className="flex flex-col items-center w-55 h-12 cursor-pointer hover:scale-105 transition-all bg-blue-950 rounded-md border-2 border-amber-500 text-3xl pt-1 mt-16"
            >
                <p> + Criar Novo</p>
            </button>

            </div>
    );}