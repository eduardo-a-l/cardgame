"use client";
import { JSX, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Botao } from "@/components/ui/Botao";
import { NomeIcone, Icone } from "@/components/ui/Icone";

import { Carta, Baralho } from "@/types/Carta";
import { EstadoJogador } from "@/types/EstadoJogador";
//, ItensAtivos, EfeitoTemporario

export interface ConfiguracaoBatalha {
    deck1: string;
    p1: string;
    p2: string;
    selecionado: number;
}

interface UsuarioAPI {
    idUsuario: number;
    nomeUsuario: string;
}

function criarJogador(
    idUsuario: number,
    nome: string
): EstadoJogador {
    return {
        idUsuario,
        nome,

        mao: [],
        deck: [],

        personagemAtivo: null,
        hpAtivo: 0,
        personagensDerrotados: 0,

        buffDano: {
            valor: 0,
            duracao: 0,
        },

        buffDefesa: {
            valor: 0,
            duracao: 0,
        },

        turnosSemAcao: 0,
        ignorarDefesa: false,

        bonusChanceCrit: 0,
        refletirDano: false,
        podeJogarSuporte: true,
        erraProximoGolpe: false,

        duracaoFocusLens: 0,
        duracaoSmokescreen: 0,

        itensAtivos: {
            sharpClaws: false,
            rigidShell: false,
            lifeDrainingFlower: false,
            devouringOrb: false,
        },

        hpColetadoOrb: 0,

        ignorarDefesaProx: false,
        bonusCritProx: false,

        primeiroTurno: true,
    };
}

function obterCartasDoBaralho(baralhos: Baralho[], idBaralho: number): Carta[] {

    const baralho = baralhos.find(
        b => b.idBaralho === idBaralho
    );

    if (!baralho) {
        throw new Error(
            `Baralho ${idBaralho} não encontrado.`
        );
    }

    return baralho.Inventarios
        .filter(inventario => inventario.Carta !== null)
        .map(inventario => inventario.Carta);
}

function embaralharCartas(cartas: Carta[]): Carta[] {
    const resultado = [...cartas];

    for (let i = resultado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [resultado[i], resultado[j]] = [
            resultado[j],
            resultado[i]
        ];
    }

    return resultado;
}

function prepararMaoInicial(cartas: Carta[]): { mao: Carta[];  deck: Carta[]; } 
{
    const deckEmbaralhado = embaralharCartas(cartas);
    const mao: Carta[] = [];

    const indicePersonagem = deckEmbaralhado.findIndex(
        carta => carta.tipo === "Personagem"
    );

    if (indicePersonagem !== -1) {
        mao.push(deckEmbaralhado.splice(indicePersonagem, 1)[0]);
    }

    while (mao.length < 5 && deckEmbaralhado.length > 0) {
        mao.push(deckEmbaralhado.shift()!);
    }

    return {
        mao,
        deck: deckEmbaralhado
    };
}

export default function TelaBatalha() {
    const router = useRouter();

    const [jogador1, setJogador1] = useState<EstadoJogador>( () => criarJogador(0, "Jogador 1") );

    const [jogador2, setJogador2] = useState<EstadoJogador>( () => criarJogador(0, "Jogador 2") );

    const [turnoDoJogador1, setTurnoDoJogador1] = useState<boolean>(true);

    const [contadorTurno, setContadorTurno] = useState(1);

    const [campoAtivo, setCampoAtivo] = useState<Carta | null>(null);

    const [batalhaFinalizada, setBatalhaFinalizada] = useState<boolean>(false);

    const [vencedor, setVencedor] = useState<string | null>(null);

    const [carregando, setCarregando] = useState<boolean>(true);

    const [aguardandoSubstituicao, setAguardandoSubstituicao] = useState<boolean>(false);

    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        async function carregarBatalha() {
            setCarregando(true);

            try {
                const configuracaoSalva = sessionStorage.getItem("configuracaoBatalha");

                if (!configuracaoSalva) {
                    throw new Error("Configuração da batalha não encontrada.");
                }

                const configuracao: ConfiguracaoBatalha = JSON.parse(configuracaoSalva);

                const idJogador1 = Number(configuracao.p1);
                const idJogador2 = Number(configuracao.p2);
                const idBaralho1 = Number(configuracao.deck1);
                const idBaralho2 = Number(configuracao.selecionado);

                if (
                    !Number.isFinite(idJogador1) ||
                    !Number.isFinite(idJogador2) ||
                    !Number.isFinite(idBaralho1) ||
                    !Number.isFinite(idBaralho2) ||
                    idJogador1 <= 0 ||
                    idJogador2 <= 0 ||
                    idBaralho1 <= 0 ||
                    idBaralho2 <= 0
                ) {
                    throw new Error("A configuração contém IDs inválidos.");
                }

                const [
                    respostaJogador1,
                    respostaJogador2,
                    respostaBaralho1,
                    respostaBaralho2
                ] = await Promise.all([
                    fetch(`http://localhost:8081/Usuarios/${idJogador1}`),
                    fetch(`http://localhost:8081/Usuarios/${idJogador2}`),
                    fetch(`http://localhost:8081/Baralhos/${idJogador1}`),
                    fetch(`http://localhost:8081/Baralhos/${idJogador2}`)
                ]);

                if (
                    !respostaJogador1.ok ||
                    !respostaJogador2.ok ||
                    !respostaBaralho1.ok ||
                    !respostaBaralho2.ok
                ) {
                    throw new Error(
                        "Não foi possível carregar os dados da batalha."
                    );
                }

                const [
                    dadosJogador1,
                    dadosJogador2,
                    registrosBaralho1,
                    registrosBaralho2
                ] = await Promise.all([
                    respostaJogador1.json() as Promise<UsuarioAPI>,
                    respostaJogador2.json() as Promise<UsuarioAPI>,
                    respostaBaralho1.json() as Promise<Baralho[]>,
                    respostaBaralho2.json() as Promise<Baralho[]>
                ]);

                const cartasJogador1 = obterCartasDoBaralho(registrosBaralho1, idBaralho1);

                const cartasJogador2 = obterCartasDoBaralho(registrosBaralho2, idBaralho2);

                const maoInicial1 = prepararMaoInicial(cartasJogador1);

                const maoInicial2 = prepararMaoInicial(cartasJogador2);

                const jogadorInicial1 = {
                    ...criarJogador(idJogador1, dadosJogador1.nomeUsuario),
                    mao: maoInicial1.mao,
                    deck: maoInicial1.deck
                };

                const jogadorInicial2 = {
                    ...criarJogador(idJogador2, dadosJogador2.nomeUsuario),
                    mao: maoInicial2.mao,
                    deck: maoInicial2.deck
                };

                setJogador1(jogadorInicial1);
                setJogador2(jogadorInicial2);

                // A preparação inicial ainda precisa permitir
                // que cada jogador escolha seu personagem.
                setAguardandoSubstituicao(true);
                setTurnoDoJogador1(Math.random() < 0.5);
                setContadorTurno(1);
                setCampoAtivo(null);
                setBatalhaFinalizada(false);
                setVencedor(null);
                setLogs([`Batalha iniciada: ${dadosJogador1.nomeUsuario} vs ${dadosJogador2.nomeUsuario}`]);
                console.log("Jogador 1:", jogadorInicial1);
                console.log("Jogador 2:", jogadorInicial2);
                console.log("Cartas do jogador 1:", jogadorInicial1.mao);
                console.log("Cartas do jogador 2:", jogadorInicial2.mao);
            } catch (erro) {
                console.error("Erro ao carregar a batalha:", erro);
                setLogs([
                    erro instanceof Error
                        ? erro.message
                        : "Erro desconhecido ao carregar a batalha."
                ]);
            } finally {
                setCarregando(false);
            }
        }

        carregarBatalha();
    }, []);
    const jogadorDaVez = turnoDoJogador1 ? jogador1 : jogador2;
    const oponente = turnoDoJogador1 ? jogador2 : jogador1;

    function exibirCarta(borda: string, largura: string[], 
                         altura: string, nomeImagem: string, 
                         texto: string, tamanhoTexto: string,
                         borderRadius: string, fundo: string, 
                         clickable: boolean, proporcional: boolean = false) 
                         : JSX.Element {

        let click = ""
        if (clickable)
            click = "cursor-pointer"
        if (proporcional)
            altura = "aspect-[185.74/252]"

        return (
            <div className={`${largura[0]} ${altura} border-[5px] ${borda} ${borderRadius} ${fundo} flex flex-col items-center justify-center text-center shrink-0 ${click}`}>
                {nomeImagem !== "" && (
                    <Icone
                        nome={nomeImagem as NomeIcone}
                        tamanho={largura[1]}
                    />
                )}

                {texto !== "" && (
                    <h1 className={`${tamanhoTexto}`}>
                        {texto}
                    </h1>
                )}
            </div>
        )
    }
    return (
        
        <main className="relative h-screen bg-[#1B1B2F] flex justify-center overflow-y-auto inventory-scrollbar">
            
            {/*container geral*/}
            <div className="flex flex-col w-[78vw] h-full">

                {/*Barra Superior*/}
                <div className="flex items-center justify-center gap-[3vw] h-[15vh]">

                    <h1 className="text-[52px] shrink-0">{oponente.nome}</h1>

                    <div className="flex items-center gap-[3vw] overflow-x-auto min-w-0 max-w-[37vw] pb-3 inventory-scrollbar">
                        {oponente.mao.map(() => (
                            exibirCarta("border-[#686868]", ["w-[clamp(50px,4.167vw,80px)]", ""], "h-[clamp(55px,7.8704vh,85px)]", "", "", "", "rounded-[18px]", "bg-[#363C4B]", false)
                        ))}
                    </div>
                    
                    <h1 className="text-[clamp(22px,1.875vw,36px)]" style={{ color : "red" }}>
                        Derrotados: {oponente.personagensDerrotados}/3
                    </h1>

                </div>

                {/*Campo de Batalha */}
                <div className="flex items-center h-[53vh]">
                    {/*Carta Jogador*/}
                    <div className="flex items-center justify-center w-[50%] h-full bg-[#363C4B]  gap-[20px]">
                        
                        <div className="flex flex-col">
                            <h1 className="text_dinheiro text-[30px]">Você</h1>
                            {exibirCarta("border-[#C8911A]", ["w-[clamp(180px,13.0208vw,250px)]", ""], "h-[clamp(240px,31.4815vh,340px)]", "", jogadorDaVez.personagemAtivo?.nome ?? "Selecione um personagem", jogadorDaVez.personagemAtivo ? "text-[40px]" : "text-[25px]", "rounded-[15px]", "bg-[#21366B]", true, true)}
                        </div>

                        <div className="flex flex-col justify-start gap-[10px] h-[clamp(240px,31.4815vh,340px)] mt-[50px]">

                            <h1 className="text-[30px]">Vida: {jogadorDaVez.personagemAtivo ? jogadorDaVez.hpAtivo : "--"}</h1>

                        </div>

                    </div>
                    
                    {/*Carta Oponente*/}
                    <div className="flex items-center justify-center w-[50%] h-full bg-[#363C4B] gap-[20px]">
                        
                        <div className="flex flex-col">
                            <h1 className="text-[30px]" style={{ color: "#B4B4B4" }}>
                                {oponente.nome}
                            </h1>
                            {exibirCarta("border-[#C8911A]", ["w-[clamp(180px,13.0208vw,250px)]", ""], "h-[clamp(240px,31.4815vh,340px)]", "", oponente.personagemAtivo?.nome ?? "Ainda não escolhido", oponente.personagemAtivo ? "text-[40px]" : "text-[25px]", "rounded-[15px]", "bg-[#21366B]", true, true)}
                        </div>

                        <div className="flex flex-col justify-start gap-[10px] h-[clamp(240px,31.4815vh,340px)] mt-[50px]">

                            <h1 className="text-[30px]">Vida: {oponente.personagemAtivo ? oponente.hpAtivo : "--"}</h1>

                        </div>

                    </div>

                </div>

                {/*Barra Inferior*/}
                <div className="flex flex-col h-[32vh]">

                    <div className="flex justify-between items-center pl-[45px] pr-[45px]">

                        <h1 className="text-[45px]">{turnoDoJogador1 ? jogador1.nome : jogador2.nome}</h1>

                        <h1 className="text-[35px]" style={{ color : "red" }}>
                            Derrotados {jogadorDaVez.personagensDerrotados}/3
                        </h1>

                    </div>

                    <div className="flex justify-around items-center h-full min-w-0">

                        <div className="flex items-center gap-[2vw] overflow-x-auto min-w-0 max-w-[47.5vw] pb-3 inventory-scrollbar">
                            {jogadorDaVez.mao.map((carta) => (
                                exibirCarta("border-[#686868]", ["w-[clamp(100px,7.8125vw,150px)]", ""], "h-[clamp(150px,20.3704vh,220px)]", "", carta.nome ?? "Carta", "text-[20px]", "rounded-[25px]", "bg-[#21366B]", true)
                            ))}
                        </div>

                        <div className="flex flex-col items-end gap-[25px] w-[32%] pr-[30px]">

                            <div className="flex justify-between w-full gap-[20px]">

                                <Botao
                                    texto="Ação 1"      
                                    raio={20}
                                    borda="border-[5px]"
                                    className="w-[clamp(105px,9.4729vw,155px)] h-[clamp(45px,9.4815vh,70px)] flex items-center justify-center text-center text-[clamp(10px,1.5625vw,30px)]"
                                />

                                <Botao
                                    texto="Ação 2"      
                                    raio={20}
                                    borda="border-[5px]"
                                    className="w-[clamp(105px,9.4729vw,155px)] h-[clamp(45px,9.4815vh,70px)] flex items-center justify-center text-center text-[clamp(10px,1.5625vw,30px)]"
                                />

                            </div>

                            <Botao
                                texto="Passar o turno"      
                                raio={20}
                                borda="border-[5px]"
                                className="w-[clamp(180px,16.1313vw,255px)] h-[clamp(45px,9.4815vh,70px)] flex items-center justify-center text-center text-[clamp(10px,1.5625vw,30px)]"
                            />

                        </div>

                    </div>

                </div>

            </div>
            {/*Barra Lateral*/}
            <aside className="w-[22vw] border-l-[7px] border-[#C8911A]">

                {/*Log de Batalha*/}
                <div className="h-[85vh] flex flex-col justify-center">

                    <h1 className="text-[clamp(24px,2.5833vw,40px)] text-center">Log de Batalha</h1>

                    <div className="h-[80%] w-[95%]"></div>

                </div>

                {/*Desistir*/}
                <div className="h-[15vh] flex justify-center items-center border-t-[7px] border-[#C8911A]">

                    <Botao
                        texto="Desistir"
                        raio={20}
                        borda="border-[5px]"
                        className="w-[clamp(200px,15.625vw,300px)] h-[clamp(65px,11.2593vh,100px)] flex items-center justify-center text-center text-[clamp(30px,2.6042vw,50px)]"
                    />

                </div>

            </aside>

        </main>
    )
}