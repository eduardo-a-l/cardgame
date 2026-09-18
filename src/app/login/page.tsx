"use client";

import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import Logo from "@/assets/logo.svg";

export default function TelaLogin() {
    const router = useRouter();

    return (
        <main className="relative min-h-screen bg-[#1B1B2F] flex items-center justify-center p-4">
            <div className="absolute top-10 left-10">
                <Botao
                texto="Voltar"
                nomeIcone="voltar"
                tamanhoIcone={40}
                corDoTexto="#FFFFFF"
                corDeFundo="transparent"
                corDaBorda="transparent"
                className="px-0 py-0 text-3xl"
                onClick={() => router.push("/")}
                />
            </div>

            <div className="flex flex-col items-center w-full max-w-2xl gap-12">
                <div className="w-64 h-64 flex items-center justify-center">
                    <div className="scale-50">
                        <Logo className="w-auto h-auto" />
                    </div>
                </div>

                <form className="w-full flex flex-col items-center gap-8" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex gap-6 w-full">
                        <div className="flex-1">
                            <label htmlFor="login" className="block text-sm font-medium text-white">
                                Usuário
                            </label>
                            <input 
                                type="text" 
                                name="login" 
                                id="login"
                                className="mt-1 block w-full px-4 py-3 bg-[#262647] border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white outline-none"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label htmlFor="senha" className="block text-sm font-medium text-white">
                                Senha
                            </label>
                            <input 
                                type="password" 
                                name="senha" 
                                id="senha"
                                className="mt-1 block w-full px-4 py-3 bg-[#262647] border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-6 w-full">
                        <Botao 
                            type="submit" 
                            texto="Entrar" 
                            corDoTexto="#FFFFFF" 
                            className="flex-1 py-4 text-2xl flex items-center justify-center text-center" 
                            onClick={() => { router.push("/perfil") }} 
                        />
                        <Botao 
                            type="button" 
                            texto="Criar Conta" 
                            corDoTexto="#FFFFFF" 
                            className="flex-1 py-4 text-2xl flex items-center justify-center text-center" 
                            onClick={() => {}} 
                        />
                    </div>
                </form>
            </div>
        </main>
    );
}