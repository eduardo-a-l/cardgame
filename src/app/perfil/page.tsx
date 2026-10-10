"use client";

import { NomeIcone } from "@/components/ui/Icone";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import { Icone } from "@/components/ui/Icone";
import { FotoPerfil } from "@/components/ui/FotoPerfil";

interface Usuario {
    idUsuario: number;
    nomeUsuario: string;
    pontos: number;
    moedas: number;
    vitorias: number;
    derrotas: number;
    pinBatalha: number;
}

interface Conquista {
    idConquista: number;
    codigo: string;
    nome: string;
    descricao: string;
    dificuldade: string;
    icone: string;
    desbloqueada: boolean;
    dataDesbloqueio: string | null;
}

function PerfilConteudo() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const idParam = searchParams.get("id");

    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [conquistas, setConquistas] = useState<Conquista[]>([]);
    const [input, setInput] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [salvandoPin, setSalvandoPin] = useState(false);
    const [enviandoFoto, setEnviandoFoto] = useState(false);
    const [fotoAtualizada, setFotoAtualizada] = useState(0);
    const [ehProprioUsuario, setEhProprioUsuario] = useState(false);
    const [erroServidor, setErroServidor] = useState(false);

    useEffect(() => {
        async function carregarDados() {
            try {
                const usuarioSalvo = localStorage.getItem("usuario");
                const usuarioLocal = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

                let idAlvo: number | null = null;

                if (idParam) {
                    idAlvo = Number(idParam);
                } else if (usuarioLocal) {
                    idAlvo = usuarioLocal.idUsuario;
                } else {
                    router.push("/login");
                    return;
                }

                const ehDono = usuarioLocal !== null && usuarioLocal.idUsuario === idAlvo;
                setEhProprioUsuario(ehDono);

                const responseUsuario = await fetch(
                    `http://localhost:8081/Usuarios/${idAlvo}`
                );

                if (!responseUsuario.ok) {
                    throw new Error("Erro ao carregar dados do usuário");
                }

                const dadosUsuario: Usuario = await responseUsuario.json();
                setUsuario(dadosUsuario);

                const responseConquistas = await fetch(
                    `http://localhost:8081/Usuarios/${idAlvo}/conquistas`
                );

                if (responseConquistas.ok) {
                    const dadosConquistas: Conquista[] = await responseConquistas.json();
                    setConquistas(dadosConquistas);
                }

            } catch (erro) {
                console.error(erro);
                setErroServidor(true);
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, [router, idParam]);

    if (erroServidor) {
        return (
            <main className="relative min-h-screen bg-[#1B1B2F] flex items-center justify-center p-4">
                <div className="absolute top-10 left-10">
                    <Botao
                        texto="Voltar"
                        nomeIcone="voltar"
                        tamanhoIcone={40}
                        corDeFundo="transparent"
                        corDaBorda="transparent"
                        corDoTexto="#FFFFFF"
                        onClick={() => idParam ? router.back() : router.push("/")}
                    />
                </div>
                <p className="text-white text-2xl text-center">
                    Não foi possível conectar-se com o servidor
                </p>
            </main>
        );
    }

    async function salvarPin() {
        if (!usuario || input.length !== 4) {
            return;
        }

        setErro("");
        setSalvandoPin(true);

        try {
            const response = await fetch(
                `http://localhost:8081/Usuarios/${usuario.idUsuario}/pinBatalha`,
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
                pinBatalha: Number(input)
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
                `http://localhost:8081/Usuarios/${usuario.idUsuario}/foto`,
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

    function getCorDificuldade(dificuldade: string) {
        switch (dificuldade) {
            case "Fácil": return "text-green-400";
            case "Médio": return "text-yellow-400";
            case "Difícil": return "text-orange-400";
            case "Difícil+": return "text-red-500";
            default: return "text-gray-400";
        }
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
                    onClick={() => idParam ? router.back() : router.push("/")}
                />
            </div>

            <div className="w-[97.5vw] xl:w-[92.5vw] 2xl:w-[87.5vw] mt-12 overflow-y-auto inventory-scrollbar flex flex-col">

                <div className="flex w-full justify-center mt-[100px] gap-[clamp(25px,13.02vw,250px)]">

                    <div
                        className="flex flex-col items-center gap-6"
                        style={{ width: "31.25vw" }}
                    >

                        <div className="flex flex-col items-center gap-3 mb-13">

                            {ehProprioUsuario ? (
                                <>
                                    <label
                                        htmlFor="fotoPerfil"
                                        className="cursor-pointer flex flex-col items-center"
                                    >

                                        <FotoPerfil
                                            idUsuario={usuario.idUsuario}
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
                                </>
                            ) : (
                                <FotoPerfil
                                    idUsuario={usuario.idUsuario}
                                    tamanho={120}
                                />
                            )}

                            <h1 className="text-[clamp(40px,4vw,77px)] text-white">
                                {usuario.nomeUsuario}
                            </h1>

                        </div>

                        {ehProprioUsuario && (
                            <>
                                <h2 className="text-[clamp(28px,2.083vw,40px)]">
                                    PIN de Batalha Atual: {String(usuario.pinBatalha).padStart(4, "0")}
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
                            </>
                        )}

                    </div>

                    <div
                        className="flex flex-col items-center justify-center gap-16"
                        style={{ width: "31.25vw" }}
                    >

                        <h1 className="text-[clamp(40px,3.125vw,60px)]">
                            Pontos: {usuario.pontos}
                        </h1>

                        <h1 className="text-[clamp(40px,3.125vw,60px)]">
                            Moedas: {usuario.moedas}G
                        </h1>

                        <h1 className="text-[clamp(40px,3.125vw,60px)]">
                            Vitórias: {usuario.vitorias}
                        </h1>

                        <h1 className="text-[clamp(40px,3.125vw,60px)]">
                            Derrotas: {usuario.derrotas}
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

                    <div className="grid grid-cols-5 mt-15 mb-25 w-full gap-x-[1.5vw] md:gap-x-[2vw] lg:gap-x-[4vw] xl:gap-x-[5.85vw] 2xl:gap-x-[8.85vw] gap-y-[13.76vh]">

                        {conquistas.map((conquista) => {

                            let cor = "";
                            let img: NomeIcone = "cadeado";

                            if (conquista.desbloqueada) {
                                cor = "#C8911A";
                                img = (conquista.icone?.toLowerCase() || "espada") as NomeIcone;
                            } else {
                                cor = "#686868";
                                img = "cadeado";
                            }

                            return (
                                <div
                                    key={conquista.idConquista}
                                    className="flex flex-col text-center items-center justify-between"
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

                                    <h1 className="text-[20px] font-bold mt-2">
                                        {conquista.nome}
                                    </h1>

                                    <span className={`text-[12px] px-2 py-0.5 my-1 ${getCorDificuldade(conquista.dificuldade)}`}>
                                        {conquista.dificuldade}
                                    </span>

                                    <h2 className="text-[13px] text-gray-300 h-[30px]">
                                        {conquista.descricao}
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

export default function TelaPerfil() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-[#1B1B2F] flex items-center justify-center">
                    <p className="text-white text-2xl">Carregando...</p>
                </main>
            }
        >
            <PerfilConteudo />
        </Suspense>
    );
}