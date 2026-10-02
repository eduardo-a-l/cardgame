"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import Logo from "@/assets/logo.svg";

export default function TelaLogin() {
    const router = useRouter();

    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function entrar() {
        setErro("");
        setCarregando(true);

        try {
            const response = await fetch(
                "http://localhost:8081/Usuarios/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nomeUsuario: login,
                        senha: senha
                    })
                }
            );

            if (response.status === 401) {
                setErro("Usuário ou senha incorretos.");
                return;
            }

            if (!response.ok) {
                setErro("Erro ao realizar login.");
                return;
            }

            const usuario = await response.json();

            localStorage.setItem(
                "usuario",
                JSON.stringify({
                    idUsuario: usuario.idUsuario,
                    nomeUsuario: usuario.nomeUsuario
                })
            );

            router.push("/perfil");
        } catch (erro) {
            console.error(erro);
            setErro("Não foi possível conectar com a API.");
        } finally {
            setCarregando(false);
        }
    }

    async function criarConta() {
        setErro("");

        if (senha.length < 8) {
            setErro("A senha deve possuir pelo menos 8 caracteres.");
            return;
        }

        setCarregando(true);

        try {
            const response = await fetch(
                "http://localhost:8081/Usuarios",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nomeUsuario: login,
                        senha: senha
                    })
                }
            );

            if (response.status === 409) {
                setErro("Esse usuário já está cadastrado.");
                return;
            }

            if (!response.ok) {
                setErro("Erro ao criar conta.");
                return;
            }

            const usuario = await response.json();

            localStorage.setItem(
                "usuario",
                JSON.stringify({
                    idUsuario: usuario.idUsuario,
                    nomeUsuario: usuario.nomeUsuario
                })
            );

            window.dispatchEvent(new Event("usuarioAtualizado"));

            router.push("/perfil");
        } catch (erro) {
            console.error(erro);
            setErro("Não foi possível conectar com a API.");
        } finally {
            setCarregando(false);
        }
    }

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

                <div className="w-full flex flex-col items-center gap-8">
                    <div className="flex gap-6 w-full">
                        <div className="flex-1">
                            <label
                                htmlFor="login"
                                className="block text-sm font-medium text-white"
                            >
                                Usuário
                            </label>

                            <input
                                type="text"
                                name="login"
                                id="login"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 bg-[#262647] border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white outline-none"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label
                                htmlFor="senha"
                                className="block text-sm font-medium text-white"
                            >
                                Senha
                            </label>

                            <input
                                type="password"
                                name="senha"
                                id="senha"
                                maxLength={50}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 bg-[#262647] border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-white outline-none"
                                required
                            />
                        </div>
                    </div>

                    {erro && (
                        <p className="text-red-400 text-center">
                            {erro}
                        </p>
                    )}

                    <div className="flex gap-6 w-full">
                        <Botao
                            type="button"
                            texto={carregando ? "Entrando..." : "Entrar"}
                            corDoTexto="#FFFFFF"
                            className="flex-1 py-4 text-2xl flex items-center justify-center text-center"
                            onClick={entrar}
                        />

                        <Botao
                            type="button"
                            texto={carregando ? "Criando..." : "Criar Conta"}
                            corDoTexto="#FFFFFF"
                            className="flex-1 py-4 text-2xl flex items-center justify-center text-center"
                            onClick={criarConta}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}