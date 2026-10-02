"use client";

import { NomeIcone } from "@/components/ui/Icone";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import { Icone } from "@/components/ui/Icone";
import { FotoPerfil } from "@/components/ui/FotoPerfil";

interface Usuario {
    IDUSUARIO: number;
    NOMEUSUARIO: string;
    PONTOS: number;
    MOEDAS: number;
    VITORIAS: number;
    DERROTAS: number;
    PINBATALHA: number;
}

export default function TelaPerfil() {
    const router = useRouter();

    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [input, setInput] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [salvandoPin, setSalvandoPin] = useState(false);
    const [enviandoFoto, setEnviandoFoto] = useState(false);
    const [fotoAtualizada, setFotoAtualizada] = useState(0);

    const conquistas: [string, boolean][] = [
        ["Espada", true],
        ["Escudo", false],
        ["Arco", false],
        ["Poção", false],
        ["Capacete", false],
        ["Armadura", false],
        ["Machado", false],
        ["Lança", true],
        ["Arco Mágico", false],
        ["Anel", false]
    ];

    useEffect(() => {
        async function carregarDados() {
            try {
                const usuarioSalvo = localStorage.getItem("usuario");

                if (!usuarioSalvo) {
                    router.push("/login");
                    return;
                }

                const usuarioLocal = JSON.parse(usuarioSalvo);

                const responseUsuario = await fetch(
                    `http://localhost:8081/Usuarios/${usuarioLocal.idUsuario}`
                );

                if (!responseUsuario.ok) {
                    throw new Error("Erro ao carregar dados do usuário");
                }

                const dadosUsuario: Usuario = await responseUsuario.json();

                setUsuario(dadosUsuario);

            } catch (erro) {
                console.error(erro);
                setErro("Não foi possível carregar os dados do perfil.");
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, [router]);

    async function salvarPin() {
        if (!usuario || input.length !== 4) {
            return;
        }

        setErro("");
        setSalvandoPin(true);

        try {
            const response = await fetch(
                `http://localhost:8081/Usuarios/${usuario.IDUSUARIO}/pinBatalha`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        novoPin: Number(input)
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao atualizar PIN");
            }

            setUsuario({
                ...usuario,
                PINBATALHA: Number(input)
            });

            setInput("");
        } catch (erro) {
            console.error(erro);
            setErro("Não foi possível atualizar o PIN.");
        } finally {
            setSalvandoPin(false);
        }
    }

    async function mudarFotoPerfil(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const arquivo = e.target.files?.[0];

        if (!arquivo || !usuario) {
            return;
        }

        setErro("");
        setEnviandoFoto(true);

        try {
            const formData = new FormData();

            formData.append("foto", arquivo);

            const response = await fetch(
                `http://localhost:8081/Usuarios/${usuario.IDUSUARIO}/foto`,
                {
                    method: "PATCH",
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao atualizar foto");
            }

            setFotoAtualizada((valor) => valor + 1);

            window.dispatchEvent(
                new Event("usuarioAtualizado")
            );
        } catch (erro) {
            console.error(erro);
            setErro("Não foi possível atualizar a foto de perfil.");
        } finally {
            setEnviandoFoto(false);
            e.target.value = "";
        }
    }

    if (carregando) {
        return (
            <main className="min-h-screen bg-[#1B1B2F] flex items-center justify-center">
                <p className="text-white text-2xl">
                    Carregando...
                </p>
            </main>
        );
    }

    if (!usuario) {
        return null;
    }

    return (
        <main className="relative min-h-screen bg-[#1B1B2F] flex items-center justify-center w-full">

            <div className="absolute top-10 left-10">
                <Botao
                    texto="Voltar"
                    nomeIcone="voltar"
                    tamanhoIcone={40}
                    corDeFundo="transparent"
                    corDaBorda="transparent"
                    corDoTexto="#FFFFFF"
                    onClick={() => router.push("/")}
                />
            </div>

            <div className="w-[97.5vw] xl:w-[92.5vw] 2xl:w-[87.5vw] mt-12 overflow-y-auto inventory-scrollbar flex flex-col">

                <div className="flex w-full justify-center mt-[100px] gap-[clamp(25px,13.02vw,250px)]">

                    <div
                        className="flex flex-col items-center gap-6"
                        style={{ width: "31.25vw" }}
                    >

                        <div className="flex flex-col items-center gap-3 mb-13">

                            <label
                                htmlFor="fotoPerfil"
                                className="cursor-pointer flex flex-col items-center"
                            >

                                <FotoPerfil
                                    idUsuario={usuario.IDUSUARIO}
                                    tamanho={120}
                                    atualizacao={fotoAtualizada}
                                />

                                <span className="text-white text-sm mt-2">
                                    {enviandoFoto
                                        ? "Enviando..."
                                        : "Mudar foto de perfil"}
                                </span>

                            </label>

                            <input
                                id="fotoPerfil"
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                className="hidden"
                                onChange={mudarFotoPerfil}
                                disabled={enviandoFoto}
                            />

                            <h1 className="text-[clamp(40px,4vw,77px)] text-white">
                                {usuario.NOMEUSUARIO}
                            </h1>

                        </div>

                        <h2 className="text-[clamp(28px,2.083vw,40px)]">
                            PIN de Batalha Atual: {String(usuario.PINBATALHA).padStart(4, "0")}
                        </h2>

                        <div className="flex flex-col mb-13">

                            <label
                                htmlFor="pinBatalha"
                                className="text-[clamp(35px,2.760vw,53px)] text-white"
                            >
                                Alterar PIN de Batalha:
                            </label>

                            <input
                                type="number"
                                min="0"
                                max="9999"
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "e" ||
                                        e.key === "E" ||
                                        e.key === "+" ||
                                        e.key === "-"
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                                name="pinBatalha"
                                id="pinBatalha"
                                value={input}
                                onChange={(e) => {
                                    if (e.target.value.length <= 4) {
                                        setInput(e.target.value);
                                    }
                                }}
                                placeholder="Digite o novo PIN"
                                className="bg-[#262647] text-white rounded-[5px] text-[clamp(21px,1.5vw,30px)] px-[clamp(22px,1.615vw,31px)] py-[clamp(10px,0.677vw,13px)] border border-indigo-500 focus:border-[#C8911A] outline-none"
                            />

                        </div>

                        <Botao
                            texto={salvandoPin ? "Salvando..." : "Salvar PIN"}
                            raio={20}
                            className="w-[clamp(250px,18.229vw,350px)] h-[clamp(70px,10.582vh,100px)] flex items-center justify-center text-center text-[clamp(30px,2.240vw,43px)]"
                            onClick={salvarPin}
                        />

                    </div>

                    <div
                        className="flex flex-col items-center gap-6"
                        style={{ width: "31.25vw" }}
                    >

                        <h1 className="text-[clamp(40px,3.125vw,60px)]">
                            Pontos: {usuario.PONTOS}
                        </h1>

                        <h1 className="text-[clamp(40px,3.125vw,60px)]">
                            Moedas: {usuario.MOEDAS}G
                        </h1>

                        <h1 className="text-[clamp(40px,3.125vw,60px)]">
                            Vitórias: {usuario.VITORIAS}
                        </h1>

                        <h1 className="text-[clamp(40px,3.125vw,60px)]">
                            Derrotas: {usuario.DERROTAS}
                        </h1>

                    </div>

                </div>

                {erro && (
                    <p className="text-red-400 text-center mt-10">
                        {erro}
                    </p>
                )}

                <div className="flex flex-col items-center justify-center mt-30 w-full">

                    <h1 className="text-[77px]">
                        Conquistas
                    </h1>

                    <div className="grid grid-cols-5 mt-15 mb-25 w-full gap-x-[0.5vw] md:gap-x-[2vw] lg:gap-x-[4vw] xl:gap-x-[5.85vw] 2xl:gap-x-[8.85vw] gap-y-[4vh] lg:gap-y-[8vh] xl:gap-y-[10vh] 2xl:gap-y-[13.76vh]">

                        {conquistas.map((conquista, index) => {

                            let cor = "";
                            let img: NomeIcone = "cadeado";

                            if (conquista[1]) {
                                cor = "#C8911A";
                                img = conquista[0].toLowerCase() as NomeIcone;
                            } else {
                                cor = "#686868";
                                img = "cadeado";
                            }

                            return (
                                <div
                                    key={index}
                                    className="flex flex-col text-center items-center justify-center"
                                >

                                    <div
                                        className="w-[10.4167vw] aspect-square rounded-[5px] shadow-sm flex items-center justify-center"
                                        style={{ backgroundColor: cor }}
                                    >
                                        <Icone
                                            nome={img}
                                            tamanho="9.375vw"
                                        />
                                    </div>

                                    <h1 className="text-[20px]">
                                        Conquista #{index + 1}
                                    </h1>

                                    <h2 className="text-[15px]">
                                        {conquista[0]}
                                    </h2>

                                </div>
                            );
                        })}

                    </div>

                </div>

            </div>

        </main>
    );
}