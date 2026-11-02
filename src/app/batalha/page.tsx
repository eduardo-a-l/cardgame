"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { Botao } from "@/components/ui/Botao";
import { NomeIcone, Icone } from "@/components/ui/Icone";

import Modal, { CartaModal } from "@/components/layout/Modal";

import { Carta, Baralho } from "@/types/Carta";
import { EstadoJogador } from "@/types/EstadoJogador";
import { corTipo } from "../loja/page";
import { desbloquearConquista } from "@/lib/conquistas";
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

interface StatusProps {
    texto: string;
    cor: string;
}

function StatusIcon({ texto, cor }: StatusProps) {
    return (
        <span
            className="shrink-0 rounded-lg px-3 py-1 text-[clamp(11px,0.8vw,16px)] font-bold text-white"
            style={{ backgroundColor: cor }}
        >
            {texto}
        </span>
    );
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

        pularDecrementoBuffDano: false,
        pularDecrementoBuffDefesa: false,
        pularDecrementoFocusLens: false,
        pularDecrementoSmokescreen: false,
        pularDecrementoTurnosSemAcao: false
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

    const estatisticasConquistas = useRef({
        personagensInvocados: {} as Record<number, number>,
        suporteUsado: {} as Record<number, boolean>,
        researchHelp: {} as Record<number, number>,
        kingBlessing: {} as Record<number, boolean>,
        queenBlessing: {} as Record<number, boolean>,
        florCura: {} as Record<number, number>,
        camposTrocados: {} as Record<number, number>,
        ultimoJogadorCampo: 0,
        errosRocky: {} as Record<number, boolean>,
        errosFoggy: {} as Record<number, boolean>,
        errosSmokescreen: {} as Record<number, boolean>,
        orbExplosoes: {} as Record<number, number>,
        cartasUsadas: {} as Record<number, string[]>,
        vidaAbaixoMetade: {} as Record<number, boolean>,
        recebeuDano: {} as Record<number, boolean>
    });

    function registrarCartaUsada(idUsuario: number, nomeCarta: string) {
        const estatisticas = estatisticasConquistas.current;
        const outroId = jogador1.idUsuario === idUsuario
            ? jogador2.idUsuario
            : jogador1.idUsuario;

        const cartasDoOutro = estatisticas.cartasUsadas[outroId] ?? [];

        if (cartasDoOutro.includes(nomeCarta)) {
            desbloquearConquista(idUsuario, "copia");
        }

        const cartasDoJogador = estatisticas.cartasUsadas[idUsuario] ?? [];
        estatisticas.cartasUsadas[idUsuario] = [...cartasDoJogador, nomeCarta];
    }

    const [jogador1, setJogador1] = useState<EstadoJogador>( () => criarJogador(0, "Jogador 1") );

    const [jogador2, setJogador2] = useState<EstadoJogador>( () => criarJogador(0, "Jogador 2") );

    const [turnoDoJogador1, setTurnoDoJogador1] = useState<boolean>(true);

    const [contadorTurno, setContadorTurno] = useState(1);

    const [campoAtivo, setCampoAtivo] = useState<Carta | null>(null);

    const [batalhaFinalizada, setBatalhaFinalizada] = useState<boolean>(false);

    const [vencedor, setVencedor] = useState<string | null>(null);

    const [carregando, setCarregando] = useState<boolean>(true);

    const [aguardandoSubstituicao, setAguardandoSubstituicao] = useState(false);

    const [logs, setLogs] = useState<string[]>([]);

    const [cartaSelecionada, setCartaSelecionada] = useState<CartaModal | null>(null);

    const [indiceCartaSelecionada, setIndiceCartaSelecionada] = useState<number | null>(null);

    const [modalCartaAberto, setModalCartaAberto] = useState(false);

    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

    const [mostrarOverlayTurno, setMostrarOverlayTurno] = useState(false);

    const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);

    const [statusResultado, setStatusResultado] = useState<"salvando" | "salvo" | "erro" | null>(null);

    const [erroResultado, setErroResultado] = useState<string | null>(null);

    useEffect(() => {
        let cancelado = false;

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

                if (!cartasJogador1.some(carta => carta.tipo === "Personagem")) {
                    throw new Error("O baralho do Jogador 1 não possui personagens.");
                }

                if (!cartasJogador2.some(carta => carta.tipo === "Personagem")) {
                    throw new Error("O baralho do Jogador 2 não possui personagens.");
                }

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

                if (cancelado) return;

                setJogador1(jogadorInicial1);
                setJogador2(jogadorInicial2);

                Object.assign(estatisticasConquistas.current, {
                    personagensInvocados: {},
                    suporteUsado: {},
                    researchHelp: {},
                    kingBlessing: {},
                    queenBlessing: {},
                    ultimoJogadorCampo: 0,
                    florCura: {},
                    camposTrocados: {},
                    errosRocky: {},
                    errosFoggy: {},
                    errosSmokescreen: {},
                    orbExplosoes: {},
                    cartasUsadas: {},
                    vidaAbaixoMetade: {},
                    recebeuDano: {}
                });

                const primeiroJogadorEhJ1 = Math.random() < 0.5;

                // A preparação inicial ainda precisa permitir
                // que cada jogador escolha seu personagem.
                setAguardandoSubstituicao(true);
                setTurnoDoJogador1(primeiroJogadorEhJ1);
                setContadorTurno(1);
                setCampoAtivo(null);
                setBatalhaFinalizada(false);
                setVencedor(null);
                setMostrarOverlayTurno(false);
                setLogs([
                    `${primeiroJogadorEhJ1 ? jogadorInicial1.nome : jogadorInicial2.nome} deve escolher um personagem.`,
                    `Batalha iniciada: ${dadosJogador1.nomeUsuario} vs ${dadosJogador2.nomeUsuario}`
                ]);
                console.log("Jogador 1:", jogadorInicial1);
                console.log("Jogador 2:", jogadorInicial2);
                console.log("Cartas do jogador 1:", jogadorInicial1.mao);
                console.log("Cartas do jogador 2:", jogadorInicial2.mao);

            } catch (erro) {
                if (cancelado) return

                console.error("Erro ao carregar a batalha:", erro);
                
                const mensagem = erro instanceof Error ? erro.message : "Erro desconhecido ao carregar a batalha."

                setErroCarregamento(mensagem);
                setLogs([mensagem])

            } finally {
                if (!cancelado) {
                    setCarregando(false);
                }
            }
        }

        carregarBatalha();

        return () => {
            cancelado = true;
        };

    }, []);

    function iniciarTurno() {
        setMostrarOverlayTurno(false);

        if (batalhaFinalizada) return;

        let atual = jogadorDaVez;
        let adversario = oponente;

        let substituicaoPendente = aguardandoSubstituicao;
        let finalizada: boolean = batalhaFinalizada;
        let vencedorAtual: number | null = null;

        // Verifica se o jogador precisa escolher um personagem
        if (atual.personagemAtivo === null) {
            substituicaoPendente = true;

            registrarLog(`${atual.nome} deve escolher um personagem`);
        }

        // No primeiro turno, não compra carta nem decrementa efeitos
        if (contadorTurno === 1) {
            setAguardandoSubstituicao(substituicaoPendente);
            return;
        }

        // Compra uma carta, se houver espaço na mão
        if (atual.deck.length > 0 && atual.mao.length < 10) {
            atual = {
                ...atual,
                mao: [...atual.mao, atual.deck[0]],
                deck: atual.deck.slice(1)
            };
        }

        // Decrementa a duração do buff de dano
        const novaDuracaoDano = atual.pularDecrementoBuffDano
            ? atual.buffDano.duracao
            : Math.max(0, atual.buffDano.duracao - 1);

        // Decrementa a duração do buff de defesa
        const novaDuracaoDefesa = atual.pularDecrementoBuffDefesa
            ? atual.buffDefesa.duracao
            : Math.max(0, atual.buffDefesa.duracao - 1);

        const novosTurnosSemAcao = atual.pularDecrementoTurnosSemAcao
            ? atual.turnosSemAcao
            : Math.max(0, atual.turnosSemAcao - 1);

        atual = {
            ...atual,

            buffDano: {
                valor: novaDuracaoDano === 0 ? 0 : atual.buffDano.valor,
                duracao: novaDuracaoDano
            },

            buffDefesa: {
                valor: novaDuracaoDefesa === 0 ? 0 : atual.buffDefesa.valor,
                duracao: novaDuracaoDefesa
            },

            turnosSemAcao: novosTurnosSemAcao,

            refletirDano:
                novosTurnosSemAcao === 0 && atual.turnosSemAcao > 0
                    ? false
                    : atual.refletirDano,

            duracaoFocusLens: atual.pularDecrementoFocusLens
                ? atual.duracaoFocusLens
                : Math.max(0, atual.duracaoFocusLens - 1),

            duracaoSmokescreen: atual.pularDecrementoSmokescreen
                ? atual.duracaoSmokescreen
                : Math.max(0, atual.duracaoSmokescreen - 1),

            // As marcações são consumidas neste início de turno
            pularDecrementoBuffDano: false,
            pularDecrementoBuffDefesa: false,
            pularDecrementoFocusLens: false,
            pularDecrementoSmokescreen: false,
            pularDecrementoTurnosSemAcao: false
        };

        // Life Draining Flower
        if (atual.itensAtivos.lifeDrainingFlower && atual.personagemAtivo !== null && adversario.personagemAtivo !== null) {
            const vidaBase = atual.personagemAtivo.vida ?? 100;
            const curaRealFlor = Math.min(4, Math.max(0, vidaBase - atual.hpAtivo));

            adversario = {
                ...adversario,
                hpAtivo: adversario.hpAtivo - 4
            };

            atual = {
                ...atual,
                hpAtivo: Math.min(atual.hpAtivo + 4, vidaBase)
            };

            registrarLog("Life Draining Flower: Roubou 4 HP do oponente");

            const curaAcumulada = (estatisticasConquistas.current.florCura[atual.idUsuario] ?? 0) + curaRealFlor;
            estatisticasConquistas.current.florCura[atual.idUsuario] = curaAcumulada;

            if (curaAcumulada >= 20) {
                desbloquearConquista(atual.idUsuario, "aFlorDaVida");
            }

            // Verifica se o oponente morreu
            const morteOponente = resolverMorteOponente(atual, adversario);

            atual = morteOponente.atual;
            adversario = morteOponente.adversario;

            morteOponente.logs.forEach(registrarLog);

            if (morteOponente.finalizada) {
                finalizada = true;
                vencedorAtual = morteOponente.vencedorId;
            }
        }

        // Forest Glade: recupera 5 HP no início do turno.
        if (campoAtivo?.nome === "Forest Glade" && atual.personagemAtivo !== null) {
            const vidaBase = atual.personagemAtivo.vida ?? 100;
            const estavaAbaixoDaMetade = atual.hpAtivo < vidaBase / 2;

            atual = {
                ...atual,
                hpAtivo: Math.min(atual.hpAtivo + 5, vidaBase)
            };

            if (estavaAbaixoDaMetade) {
                desbloquearConquista(atual.idUsuario, "refugio");
            }

            registrarLog(`${atual.nome} recuperou 5 HP (Forest Glade)`);
        }

        // Toxic Swamp: impede o uso de suportes nos turnos pares.
        atual = {
            ...atual,
            podeJogarSuporte:
                campoAtivo?.nome === "Toxic Swamp"
                    ? contadorTurno % 2 !== 0
                    : true
        };

        salvarEstadosJogadores(atual, adversario);

        setAguardandoSubstituicao(substituicaoPendente);

        if (finalizada && vencedorAtual) {
            finalizarBatalha(vencedorAtual);
        }
    }

    const jogadorDaVez = turnoDoJogador1 ? jogador1 : jogador2;
    const oponente = turnoDoJogador1 ? jogador2 : jogador1;

    function selecionarCarta(indice: number) {
        const carta = jogadorDaVez.mao[indice];

        if (!carta) return;

        abrirModalCarta(carta, true, indice)
    }

    function abrirModalCarta(carta: Carta, mostrarConfirmacao: boolean, indice?: number) {

        setCartaSelecionada({
            idCarta: carta.idCarta!,
            nome: carta.nome ?? "Carta",
            raridade: carta.raridade ?? "Comum",
            tipo: carta.tipo,
            vida: carta.vida ?? undefined,
            acao1: carta.acao1,
            acao2: carta.acao2
        });

        setMostrarConfirmacao(mostrarConfirmacao)
        setIndiceCartaSelecionada(indice ?? null);
        setModalCartaAberto(true);
    }

    function usarCartaSelecionada() {
        if (!cartaSelecionada || indiceCartaSelecionada === null) return;
        if (batalhaFinalizada) return;

        let atual = jogadorDaVez;
        let adversarioAtualizado = oponente;

        const carta = cartaSelecionada;
        const indice = indiceCartaSelecionada;

        if ((atual.primeiroTurno || aguardandoSubstituicao) && carta.tipo !== "Personagem") {
            registrarLog("Escolha um personagem");
            return;
        }

        switch (carta.tipo) {

            // PERSONAGEM
            // ============================================
            case "Personagem": {
                if (atual.personagemAtivo !== null) return;

                if (!atual.primeiroTurno && !aguardandoSubstituicao) return;

                const consumirTurno = jogadorDaVez.primeiroTurno;

                let vidaInicial = cartaSelecionada.vida ?? 100;
                let erraGolpe = false;

                if (campoAtivo?.nome === "Rocky Hills") {
                    vidaInicial -= 5;
                    erraGolpe = Math.random() < 0.4;

                    registrarLog(
                        "Rocky Hills: tomou 5 de dano e pode errar o primeiro golpe"
                    );
                }

                atual = {
                    ...atual,
                    personagemAtivo : carta,
                    hpAtivo         : vidaInicial,
                    erraProximoGolpe: erraGolpe,
                    mao             : atual.mao.filter( (_, i) => i !== indice ),
                    primeiroTurno   : false
                }

                estatisticasConquistas.current.recebeuDano[atual.idUsuario] = false;

                const invocados = estatisticasConquistas.current.personagensInvocados[atual.idUsuario] ?? 0;
                estatisticasConquistas.current.personagensInvocados[atual.idUsuario] = invocados + 1;
                registrarCartaUsada(atual.idUsuario, carta.nome ?? "Personagem");

                registrarLog(`${atual.nome} invocou ${carta.nome}`);

                setAguardandoSubstituicao(false);
                fecharModalCarta();

                if (consumirTurno) {
                    // a seleção inicial consome o turno
                    passarTurno(true, atual, adversarioAtualizado);
                }
                else {
                    // a substituição não consome o turno
                    salvarEstadosJogadores(atual, adversarioAtualizado)
                }

                return;
            }

            // SUPORTE
            //========================================
            case "Suporte": {
                if (!atual.podeJogarSuporte) {
                    registrarLog("Toxic Swamp: Não pode usar suporte agora");
                    return;
                }

                estatisticasConquistas.current.suporteUsado[atual.idUsuario] = true;
                registrarCartaUsada(atual.idUsuario, carta.nome ?? "Suporte");

                switch (carta.nome) {

                    case "Heal Injection": {
                        const vidaBase = atual.personagemAtivo?.vida ?? 100;
                        const vidaAntesDaCura = atual.hpAtivo;
                        const vidaFaltante = Math.max(0, vidaBase - vidaAntesDaCura);

                        if (20 > vidaFaltante) {
                            desbloquearConquista(atual.idUsuario, "desperdicio");
                        }

                        if (vidaAntesDaCura < vidaBase / 2 && vidaAntesDaCura + 20 >= vidaBase) {
                            desbloquearConquista(atual.idUsuario, "segundoFolego");
                        }

                        if (
                            vidaFaltante > 0 &&
                            campoAtivo?.nome === "Forest Glade" &&
                            atual.itensAtivos.lifeDrainingFlower
                        ) {
                            desbloquearConquista(atual.idUsuario, "regeneracaoAbsoluta");
                        }

                        atual = {
                            ...atual,
                            hpAtivo: Math.min(atual.hpAtivo + 20, vidaBase)
                        };

                        registrarLog(`${atual.nome} curou 20 HP`);
                        break;
                    }

                    case "Attack Injection": {
                        atual = {
                            ...atual,
                            buffDano: {
                                valor: 8,
                                duracao: 3
                            },
                            pularDecrementoBuffDano: true
                        };

                        registrarLog("+8 Dano de ações ofensivas por 3 turnos");
                        break;
                    }

                    case "Defense Injection": {
                        atual = {
                            ...atual,
                            buffDefesa: {
                                valor: 5,
                                duracao: 4
                            },
                            pularDecrementoBuffDefesa: true
                        };

                        registrarLog("-5 Dano recebido por 4 turnos");
                        break;
                    }

                    case "Researcher's Help": {
                        const usosPesquisa = (estatisticasConquistas.current.researchHelp[atual.idUsuario] ?? 0) + 1;
                        estatisticasConquistas.current.researchHelp[atual.idUsuario] = usosPesquisa;

                        if (usosPesquisa >= 3) {
                            desbloquearConquista(atual.idUsuario, "espionagem");
                        }

                        atual = {
                            ...atual,
                            buffDefesa: {
                                valor: 8,
                                duracao: 6
                            },
                            pularDecrementoBuffDefesa: true
                        };

                        registrarLog("-8 Dano recebido por 6 turnos");

                        if (adversarioAtualizado.mao.length > 0) {
                            const indiceAleatorio = Math.floor(
                                Math.random() * adversarioAtualizado.mao.length
                            );

                            const cartaRevelada =
                                adversarioAtualizado.mao[indiceAleatorio];

                            registrarLog(
                                `Revelado da mão do oponente: ${cartaRevelada.nome}`
                            );
                        }

                        break;
                    }

                    case "King's Blessing": {
                        estatisticasConquistas.current.kingBlessing[atual.idUsuario] = true;

                        if (estatisticasConquistas.current.queenBlessing[atual.idUsuario]) {
                            desbloquearConquista(atual.idUsuario, "sobACoroa");
                        }

                        atual = {
                            ...atual,
                            buffDano: {
                                valor: 15,
                                duracao: 5
                            },
                            pularDecrementoBuffDano: true
                        };

                        registrarLog("+15 Dano de ações ofensivas por 5 turnos");
                        break;
                    }

                    case "Queen's Blessing": {
                        estatisticasConquistas.current.queenBlessing[atual.idUsuario] = true;

                        if (estatisticasConquistas.current.kingBlessing[atual.idUsuario]) {
                            desbloquearConquista(atual.idUsuario, "sobACoroa");
                        }

                        atual = {
                            ...atual,
                            buffDefesa: {
                                valor: 15,
                                duracao: 5
                            },
                            pularDecrementoBuffDefesa: true
                        };

                        registrarLog("-15 Dano recebido por 5 turnos");
                        break;
                    }

                    case "Focus Lens": {
                        atual = {
                            ...atual,
                            duracaoFocusLens: 7,
                            pularDecrementoFocusLens: true
                        };

                        registrarLog(
                            `${atual.nome} usou Focus Lens (Proteção contra erro por 7 turnos)`
                        );
                        break;
                    }

                    case "Smokescreen": {
                        adversarioAtualizado = {
                            ...adversarioAtualizado,
                            duracaoSmokescreen: 5,
                            pularDecrementoSmokescreen: true
                        };

                        registrarLog(
                            `${atual.nome} usou Smokescreen. Oponente terá chance de erro por 5 turnos`
                        );
                        break;
                    }

                    case "Sharp Claws": {
                        atual = {
                            ...atual,
                            itensAtivos: {
                                ...atual.itensAtivos,
                                sharpClaws: true
                            }
                        };

                        registrarLog(`${atual.nome} equipou Sharp Claws`);
                        break;
                    }

                    case "Rigid Shell": {
                        atual = {
                            ...atual,
                            itensAtivos: {
                                ...atual.itensAtivos,
                                rigidShell: true
                            }
                        };

                        registrarLog(`${atual.nome} equipou Rigid Shell`);
                        break;
                    }

                    case "Life Draining Flower": {
                        atual = {
                            ...atual,
                            itensAtivos: {
                                ...atual.itensAtivos,
                                lifeDrainingFlower: true
                            }
                        };

                        registrarLog(`${atual.nome} usou Life Draining Flower`);
                        break;
                    }

                    case "Devouring Orb": {
                        atual = {
                            ...atual,
                            itensAtivos: {
                                ...atual.itensAtivos,
                                devouringOrb: true
                            },
                            hpColetadoOrb: 0
                        };

                        registrarLog(`${atual.nome} usou Devouring Orb`);
                        break;
                    }

                    default: {
                        registrarLog(`${atual.nome} usou ${carta.nome}`);
                        break;
                    }
                }

                // Remove o suporte da mão.
                atual = {
                    ...atual,
                    mao: atual.mao.filter((_, i) => i !== indice)
                };

                fecharModalCarta();

                // O suporte consome o turno.
                passarTurno(false, atual, adversarioAtualizado);

                return;
            }

            // CAMPO
            //================================================
            case "Campo": {
                registrarCartaUsada(atual.idUsuario, carta.nome ?? "Campo");

                const estatisticas = estatisticasConquistas.current;
                const quantidadeCampos = (estatisticas.camposTrocados[atual.idUsuario] ?? 0) + 1;
                estatisticas.camposTrocados[atual.idUsuario] = quantidadeCampos;

                if (quantidadeCampos >= 3) {
                    desbloquearConquista(atual.idUsuario, "guerraDeTerritorios");
                }

                if (
                    estatisticas.ultimoJogadorCampo !== 0 &&
                    estatisticas.ultimoJogadorCampo !== atual.idUsuario
                ) {
                    desbloquearConquista(atual.idUsuario, "minhasRegrasMeuJogo");
                }

                estatisticas.ultimoJogadorCampo = atual.idUsuario;
                setCampoAtivo(carta);

                atual = {
                    ...atual,
                    mao: atual.mao.filter((_, i) => i !== indice)
                };

                registrarLog(`Campo Ativo: ${carta.nome}`);

                salvarEstadosJogadores(atual, adversarioAtualizado);

                fecharModalCarta();

                // Campo NÃO consome o turno.
                return;
            }

            default:
                console.log("Tipo de carta desconhecido:", cartaSelecionada.tipo);
                return;
        }
    }

    function fecharModalCarta() {
        setModalCartaAberto(false);
        setCartaSelecionada(null);
        setIndiceCartaSelecionada(null);
    }
                      // fica true se, no primeiro turno, 
                      // o aguardandoSubstituição como 'false' 
                      // ainda não foi registrado
    function passarTurno(liberarSelecaoInicial: boolean = false, 
                         jogadorAtualizadoInicial?: EstadoJogador, oponenteAtualizadoInicial?: EstadoJogador,
                         substituicaoPendenteInicial?: boolean) {
    
        if (batalhaFinalizada) return;

        let atual = jogadorAtualizadoInicial ?? jogadorDaVez;
        let adversario = oponenteAtualizadoInicial ?? oponente;

        let substituicaoPendente = liberarSelecaoInicial ? false : substituicaoPendenteInicial ?? aguardandoSubstituicao;

        let finalizada: boolean = batalhaFinalizada;
        let vencedorAtual: number | null = null;
        
        // Se o próprio jogador precisa substituir seu personagem,
        // salva os estados, mas não passa o turno.
        if (substituicaoPendente && !liberarSelecaoInicial) {
            salvarEstadosJogadores(atual, adversario);
            setAguardandoSubstituicao(true);
            return;
        }

        // Devouring Orb
        if (atual.itensAtivos.devouringOrb && adversario.personagemAtivo !== null) {
            const hpColetado =
                adversario.hpAtivo < 10
                    ? atual.hpColetadoOrb + adversario.hpAtivo
                    : atual.hpColetadoOrb + 10;

            registrarLog(
                `Devouring Orb: Sugou ${hpColetado - atual.hpColetadoOrb} do oponente (${hpColetado}/75)`
            );

            adversario = {
                ...adversario,
                hpAtivo: adversario.hpAtivo - 10
            };

            atual = {
                ...atual,
                hpColetadoOrb: hpColetado
            };

            // Verifica se o oponente morreu
            const morteOponente = resolverMorteOponente(atual, adversario);

            atual = morteOponente.atual;
            adversario = morteOponente.adversario;

            morteOponente.logs.forEach(registrarLog);

            if (morteOponente.finalizada) {
                finalizada = true;
                vencedorAtual = morteOponente.vencedorId;
            }

            if (finalizada) {
                salvarEstadosJogadores(atual, adversario);

                if (vencedorAtual) {
                    finalizarBatalha(vencedorAtual)
                }
                return;
            }

            // Explosão do Devouring Orb
            if (hpColetado >= 75) {
                const explosoes = (estatisticasConquistas.current.orbExplosoes[atual.idUsuario] ?? 0) + 1;
                estatisticasConquistas.current.orbExplosoes[atual.idUsuario] = explosoes;

                // Remove até 3 cartas aleatórias da mão
                for (let i = 0; i < 3; i++) {
                    if (atual.mao.length === 0) break;

                    const indice = Math.floor(Math.random() * atual.mao.length);
                    const removida = atual.mao[indice];

                    atual = {
                        ...atual,
                        mao: atual.mao.filter((_, index) => index !== indice)
                    };

                    registrarLog(`Carta perdida na explosão: ${removida.nome}`);
                }

                atual = {
                    ...atual,
                    hpAtivo: atual.hpAtivo - 45,
                    hpColetadoOrb: 0,
                    itensAtivos: {
                        ...atual.itensAtivos,
                        devouringOrb: false
                    }
                };

                estatisticasConquistas.current.recebeuDano[atual.idUsuario] = true;

                registrarLog(`O Devouring Orb explodiu. 45 de dano em ${atual.nome}`);

                // Verifica se o próprio jogador morreu
                const morteJogador = resolverMorteJogador(atual, adversario);

                atual = morteJogador.atual;
                adversario = morteJogador.adversario;

                morteJogador.logs.forEach(registrarLog);

                if (morteJogador.finalizada) {
                    finalizada = true;
                    vencedorAtual = morteJogador.vencedorId;
                }

                if (morteJogador.aguardandoSubstituicao) {
                    substituicaoPendente = true;
                }
            }
        }

        // Salva as alterações feitas nos jogadores
        salvarEstadosJogadores(atual, adversario);

        setAguardandoSubstituicao(substituicaoPendente);

        if (finalizada && vencedorAtual) {
            finalizarBatalha(vencedorAtual)
            return;
        }

        // Não passa o turno se ainda estiver aguardando substituição
        if (substituicaoPendente) return;

        // Exibe o aviso de troca de turno
        setMostrarOverlayTurno(true);

        // Alterna o jogador
        const proximoTurnoDoJogador1 = !turnoDoJogador1;

        setTurnoDoJogador1(proximoTurnoDoJogador1);

        const configuracaoConcluidaAgora = liberarSelecaoInicial && !atual.primeiroTurno && !adversario.primeiroTurno;

        // define o contador como dois após ambos os jogadores escolherem os personagens ativos
        if (configuracaoConcluidaAgora) {
            setContadorTurno(2);
        }
        // Incrementa o contador quando o turno volta ao jogador 1
        else if (!atual.primeiroTurno && !adversario.primeiroTurno && proximoTurnoDoJogador1) {
            setContadorTurno(anterior => anterior + 1);
        }
    }

    function salvarEstadosJogadores(atual: EstadoJogador, adversario: EstadoJogador) {
        if (turnoDoJogador1) {
            setJogador1(atual);
            setJogador2(adversario);
        } else {
            setJogador2(atual);
            setJogador1(adversario);
        }
    }

    function limparStatusJogador(jogador: EstadoJogador): EstadoJogador {
        return {
            ...jogador,
            buffDano: { valor: 0, duracao: 0 },
            buffDefesa: { valor: 0, duracao: 0 },
            turnosSemAcao: 0,
            refletirDano: false,
            erraProximoGolpe: false,
            duracaoFocusLens: 0,
            duracaoSmokescreen: 0,
            itensAtivos: {
                sharpClaws: false,
                rigidShell: false,
                lifeDrainingFlower: false,
                devouringOrb: false
            },
            hpColetadoOrb: 0,
            ignorarDefesa: false,
            ignorarDefesaProx: false,
            bonusChanceCrit: 0,
            bonusCritProx: false,
            pularDecrementoBuffDano: false,
            pularDecrementoBuffDefesa: false,
            pularDecrementoFocusLens: false,
            pularDecrementoSmokescreen: false,
            pularDecrementoTurnosSemAcao: false
        };
    }

    function temPersonagensDisponiveis(jogador: EstadoJogador): boolean {
        return jogador.mao.some(carta => carta.tipo === "Personagem");
    }

    function resolverMorteOponente(atual: EstadoJogador, adversario: EstadoJogador) {
        // caso o oponente não tenha personagem ativo, ou tenha um com vida sobrando
        if (adversario.personagemAtivo === null || adversario.hpAtivo > 0) {
            return {
                atual,
                adversario,
                finalizada: false,
                vencedorId: null,
                logs: [] as string[]
            };
        }

        const atualizadaAtual = {
            ...atual,
            personagensDerrotados: atual.personagensDerrotados + 1
        };

        const atualizadaAdversario = {
            ...limparStatusJogador(adversario),
            personagemAtivo: null,
            hpAtivo: 0
        };

        const vitoriaPorAbates = atualizadaAtual.personagensDerrotados >= 3;
        const adversarioSemPersonagens = !temPersonagensDisponiveis(atualizadaAdversario);

        const logsNovos = [
            `${adversario.personagemAtivo.nome} derrotado`
        ];

        if (adversarioSemPersonagens && !vitoriaPorAbates) {
            logsNovos.push(`${adversario.nome} não tem mais personagens na mão!`);
        } else if (vitoriaPorAbates) {
            logsNovos.push(`${atual.nome} derrotou 3 personagens!`);
        }

        const finalizada = vitoriaPorAbates || adversarioSemPersonagens;

        return {
            atual: atualizadaAtual,
            adversario: atualizadaAdversario,
            finalizada,
            vencedorId: finalizada ? atualizadaAtual.idUsuario : null,
            logs: logsNovos
        };
    }

    function resolverMorteJogador(atual: EstadoJogador, adversario: EstadoJogador) {
        if (atual.personagemAtivo === null || atual.hpAtivo > 0) {
            return {
                atual,
                adversario,
                finalizada: false,
                vencedorId: null,
                aguardandoSubstituicao: false,
                logs: [] as string[]
            };
        }

        const atualizadaAdversario = {
            ...adversario,
            personagensDerrotados: adversario.personagensDerrotados + 1
        };

        const atualizadaAtual = {
            ...limparStatusJogador(atual),
            personagemAtivo: null,
            hpAtivo: 0
        };

        const vitoriaPorAbates = atualizadaAdversario.personagensDerrotados >= 3;
        const jogadorSemPersonagens = !temPersonagensDisponiveis(atualizadaAtual);

        const logsNovos = [
            `${atual.personagemAtivo.nome} derrotado`
        ];

        if (jogadorSemPersonagens && !vitoriaPorAbates) {
            logsNovos.push(`${atual.nome} não tem mais personagens na mão!`);
        }

        const finalizada = vitoriaPorAbates || jogadorSemPersonagens;

        return {
            atual: atualizadaAtual,
            adversario: atualizadaAdversario,
            finalizada,
            vencedorId: finalizada ? atualizadaAdversario.idUsuario : null,
            aguardandoSubstituicao: !finalizada,
            logs: logsNovos
        };
    }

    function registrarLog(mensagem: string) {
        setLogs(anterior => [mensagem, ...anterior].slice(0, 15));
    }

    function executarAcao(numeroAcao: number = 1) {
        if (batalhaFinalizada) return;

        if ( numeroAcao === 2 && !jogadorDaVez.personagemAtivo?.acao2 ) {
            return;
        }

        if (aguardandoSubstituicao) {
            registrarLog("Escolha um personagem");
            return;
        }

        let atual = jogadorDaVez;
        let adversario = oponente;

        const personagem = atual.personagemAtivo;

        if (!personagem) return;

        // Paralisação
        if (atual.turnosSemAcao > 0) {
            registrarLog(
                `${personagem.nome} está paralisado (${atual.turnosSemAcao} turnos restantes)`
            );

            passarTurno();
            return;
        }

        // Verifica se o golpe será errôneo.
        let errou = false;

        if (atual.erraProximoGolpe) {
            errou = true;
            estatisticasConquistas.current.errosRocky[atual.idUsuario] = true;

            atual = {
                ...atual,
                erraProximoGolpe: false
            };

            registrarLog(`${personagem.nome} errou o golpe devido ao Rocky Hills`);
        }

        else if ( atual.duracaoSmokescreen > 0 && atual.duracaoFocusLens <= 0 ) {
            if (Math.random() * 100 < 20) {
                errou = true;
                estatisticasConquistas.current.errosSmokescreen[atual.idUsuario] = true;

                registrarLog(`${personagem.nome} errou o golpe devido ao Smokescreen`);
            }
        }
        else if ( campoAtivo?.nome === "Foggy Valley" && atual.duracaoFocusLens <= 0
        ) {
            if (Math.random() * 100 < 15) {
                errou = true;
                estatisticasConquistas.current.errosFoggy[atual.idUsuario] = true;

                registrarLog(`${personagem.nome} errou o golpe na neblina`);
            }
        }

        if (errou) {
            passarTurno(false, atual, adversario);
            return;
        }

        if (
            atual.duracaoFocusLens > 0 &&
            (atual.duracaoSmokescreen > 0 || campoAtivo?.nome === "Foggy Valley")
        ) {
            desbloquearConquista(atual.idUsuario, "atravesDaNevoa");
        }

        if (
            atual.duracaoFocusLens > 0 &&
            atual.duracaoSmokescreen > 0 &&
            campoAtivo?.nome === "Foggy Valley"
        ) {
            desbloquearConquista(atual.idUsuario, "imunidade");
        }

        if (
            atual.duracaoSmokescreen > 0 &&
            campoAtivo?.nome === "Foggy Valley"
        ) {
            desbloquearConquista(atual.idUsuario, "ataqueNoEscuro");
        }

        // Concentração da Sword Legend:
        // prepara a próxima ação para ignorar defesa e receber bônus crítico.
        if (atual.ignorarDefesaProx) {
            atual = {
                ...atual,
                ignorarDefesa: true,
                bonusChanceCrit: 30,
                ignorarDefesaProx: false,
                bonusCritProx: false
            };
        }

        let danoBase = 0;
        let bonusDano = 0;
        let curaPropria = 0;

        const vidaBase = personagem.vida ?? 100;

        // Habilidades dos personagens
        switch (personagem.nome) {

            case "Sword Apprentice":
                if (numeroAcao === 1) {
                    danoBase = 15;

                    if (Math.random() * 100 < 10) {
                        bonusDano = 5;
                    }
                }
                break;

            case "Magic Apprentice":
                if (numeroAcao === 1) {
                    danoBase = 10;
                    curaPropria = 5;
                }
                break;

            case "Thief":
                if (numeroAcao === 1) {
                    danoBase = 5;

                    if ( adversario.buffDano.valor > 0 || adversario.buffDefesa.valor > 0 ) {
                        atual = {
                            ...atual,
                            buffDano: { ...adversario.buffDano },
                            buffDefesa: { ...adversario.buffDefesa }
                        };

                        adversario = {
                            ...adversario,
                            buffDano: { valor: 0, duracao: 0 },
                            buffDefesa: { valor: 0, duracao: 0 }
                        };

                        registrarLog("Thief roubou os efeitos de suporte");
                    }
                }
                break;

            case "Sword Master":
                if (numeroAcao === 1) {
                    danoBase = 20;

                    if (Math.random() * 100 < 50) {
                        bonusDano = 5;
                    }
                }
                break;

            case "Magic Master":
                if (numeroAcao === 1) {
                    danoBase = 10;
                    curaPropria = 10;

                    if (Math.random() * 100 < 20) {
                        bonusDano = 10;
                    }
                }
                break;

            case "Alchemist":
                if (numeroAcao === 1) {
                    danoBase = 10;

                    if (Math.random() * 100 < 20) {
                        adversario = {
                            ...adversario,
                            buffDano: { valor: 0, duracao: 0 },
                            buffDefesa: { valor: 0, duracao: 0 }
                        };

                        registrarLog("Alchemist limpou os efeitos do inimigo");
                    }
                }
                break;

            case "Assassin":
                if (numeroAcao === 1) {
                    danoBase = 25;

                    const vidaBaseOponente =
                        adversario.personagemAtivo?.vida ?? 100;

                    if (adversario.hpAtivo >= vidaBaseOponente) {
                        bonusDano = 15;
                    }
                }
                break;

            case "Reaper":
                if (numeroAcao === 1) {
                    danoBase = 15;
                }
                else if (numeroAcao === 2) {
                    danoBase = 10;
                    curaPropria = 10;

                    const vidaBaseOponente = adversario.personagemAtivo?.vida ?? 100;

                    if (adversario.hpAtivo < vidaBaseOponente / 2) {
                        bonusDano = 20;
                    }
                }
                break;

            case "Dragon Knight":
                if (numeroAcao === 1) {
                    danoBase = 25;
                }
                else if (numeroAcao === 2) {
                    atual = {
                        ...atual,
                        turnosSemAcao: 2,
                        refletirDano: true,
                        pularDecrementoTurnosSemAcao: true
                    };

                    registrarLog(
                        "Dragon Knight em postura de contra-ataque (2 turnos)"
                    );

                    passarTurno(false, atual, adversario);
                    return;
                }
                break;

            case "Sword Legend":
                if (numeroAcao === 1) {
                    danoBase = 20;

                    const chanceCritica = 40 + atual.bonusChanceCrit;

                    if (Math.random() * 100 < chanceCritica) {
                        bonusDano = 15;
                    }
                    atual = {
                        ...atual,
                        bonusChanceCrit: 0
                    };

                }
                else if (numeroAcao === 2) {
                    atual = {
                        ...atual,
                        ignorarDefesa: false,
                        bonusChanceCrit: 0,
                        ignorarDefesaProx: true,
                        bonusCritProx: true
                    };

                    registrarLog(
                        "Sword Legend concentrando poder. Próxima ação ignorará defesa e terá +30% crítico"
                    );

                    passarTurno(false, atual, adversario);
                    return;
                }
                break;

            default:
                danoBase = 15;
                break;
        }

        // Calcula o dano total.
        let danoTotal = 0;

        if (danoBase > 0 || bonusDano > 0) {
            danoTotal =
                danoBase +
                bonusDano +
                atual.buffDano.valor;

            // Fiery Field: +10 de dano.
            if (campoAtivo?.nome === "Fiery Field") {
                danoTotal += 10;
            }

            // Sharp Claws: +8 contra personagens com até 100 de vida-base.
            if (atual.itensAtivos.sharpClaws) {

                const vidaBaseOponente = adversario.personagemAtivo?.vida ?? 100;

                if (vidaBaseOponente <= 100) {
                    danoTotal += 8;
                    registrarLog("Sharp Claws: +8 de dano");
                }
            }
        }

        // Calcula a redução de dano.
        let reducao = atual.ignorarDefesa ? 0 : adversario.buffDefesa.valor;

        // Tidal Seas: +10 de redução quando o oponente
        // está abaixo da metade da vida-base.
        if (campoAtivo?.nome === "Tidal Seas") {

            const vidaBaseOponente = adversario.personagemAtivo?.vida ?? 100;

            if ( adversario.hpAtivo < vidaBaseOponente / 2 && !atual.ignorarDefesa) {
                reducao += 10;
            }
        }

        let danoFinal = Math.max(danoTotal - reducao, 0);

        // Rigid Shell: reduz 6 de dano recebido quando o dano é de pelo menos 15.
        if (adversario.itensAtivos.rigidShell && danoFinal >= 15) {
            danoFinal -= 6;
            registrarLog("Rigid Shell: Dano reduzido em 6");
        }

        const vidaOponenteAntesAtaque = adversario.hpAtivo;
        const vidaBaseOponenteAntesAtaque = adversario.personagemAtivo?.vida ?? 100;
        const vidaBaseAtacanteAntesAtaque = personagem.vida ?? 100;

        if (danoTotal > 0 && danoFinal === 0) {
            desbloquearConquista(adversario.idUsuario, "paredeDeFerro");
        }

        if (campoAtivo?.nome === "Fiery Field" && danoFinal > 0) {
            desbloquearConquista(atual.idUsuario, "campoPerfeito");
        }

        if (
            campoAtivo?.nome === "Tidal Seas" &&
            vidaOponenteAntesAtaque > 0 &&
            danoTotal >= vidaOponenteAntesAtaque &&
            danoFinal < vidaOponenteAntesAtaque
        ) {
            desbloquearConquista(adversario.idUsuario, "calmaAntesDaTempestade");
        }

        // Aplica o dano ao oponente.
        adversario = {
            ...adversario,
            hpAtivo: adversario.hpAtivo - danoFinal
        };

        if (danoFinal > 0) {
            estatisticasConquistas.current.recebeuDano[adversario.idUsuario] = true;
        }

        if (
            adversario.hpAtivo > 0 &&
            adversario.hpAtivo < 10
        ) {
            desbloquearConquista(adversario.idUsuario, "porUmFio");
        }

        if (
            danoFinal > vidaOponenteAntesAtaque &&
            vidaOponenteAntesAtaque > 0
        ) {
            desbloquearConquista(atual.idUsuario, "overkill");
        }

        if (
            personagem.nome === "Assassin" &&
            vidaOponenteAntesAtaque === vidaBaseOponenteAntesAtaque &&
            adversario.hpAtivo <= 0
        ) {
            desbloquearConquista(atual.idUsuario, "precisaoCirurgica");
        }

        if (
            adversario.hpAtivo <= 0 &&
            !estatisticasConquistas.current.recebeuDano[atual.idUsuario]
        ) {
            desbloquearConquista(atual.idUsuario, "intocavel");
        }

        if (
            adversario.personagemAtivo?.nome === "Sword Legend" &&
            personagem.nome === "Sword Apprentice" &&
            adversario.hpAtivo <= 0
        ) {
            desbloquearConquista(atual.idUsuario, "derrubandoALenda");
        }

        if (
            vidaOponenteAntesAtaque === vidaBaseOponenteAntesAtaque &&
            atual.hpAtivo === vidaBaseAtacanteAntesAtaque &&
            vidaBaseOponenteAntesAtaque > vidaBaseAtacanteAntesAtaque &&
            adversario.hpAtivo <= 0
        ) {
            desbloquearConquista(atual.idUsuario, "superacaoDeVida");
        }

        if (
            personagem.nome === "Sword Legend" &&
            atual.ignorarDefesa &&
            bonusDano > 0 &&
            danoFinal > 0
        ) {
            desbloquearConquista(atual.idUsuario, "espadachimSupremo");
        }

        // Aplica a cura do próprio personagem.
        const vidaAntesDaCura = atual.hpAtivo;
        const vidaFaltanteAntesDaCura = Math.max(0, vidaBase - vidaAntesDaCura);
        const curaReal = Math.min(curaPropria, vidaFaltanteAntesDaCura);

        if (curaPropria > vidaFaltanteAntesDaCura) {
            desbloquearConquista(atual.idUsuario, "desperdicio");
        }

        atual = {
            ...atual,
            hpAtivo: Math.min(atual.hpAtivo + curaPropria, vidaBase)
        };

        if (
            vidaAntesDaCura < vidaBase / 2 &&
            atual.hpAtivo >= vidaBase
        ) {
            desbloquearConquista(atual.idUsuario, "segundoFolego");
        }

        if (
            curaReal > 0 &&
            campoAtivo?.nome === "Forest Glade" &&
            atual.itensAtivos.lifeDrainingFlower
        ) {
            desbloquearConquista(atual.idUsuario, "regeneracaoAbsoluta");
        }

        // Reflexão de dano.
        let substituicaoPendente = false;
        let finalizada = false;
        let vencedorAtual: number | null = null;

        let atualAtingiuVitoria = false;
        let oponenteAtingiuVitoria = false;
        let vencedorPorReflexao: number | null = null;

        if (adversario.refletirDano && danoFinal > 0) {
            const danoBaseRefletido = Math.floor(danoFinal * 0.5);

            let bonusOfensivoDefensor = adversario.buffDano.valor;

            // adiciona apenas a metade que 'cortou fora'
            if (campoAtivo?.nome === "Fiery Field") {
                bonusOfensivoDefensor += 5;
            }

            if (adversario.itensAtivos.sharpClaws) {
                const vidaBaseAtacante = atual.personagemAtivo?.vida ?? 100;

                if (vidaBaseAtacante <= 100) {
                    bonusOfensivoDefensor += 8;
                }
            }

            let reducaoDefensivaAtacante = atual.buffDefesa.valor;

            // adiciona apenas a metade que 'cortou fora'
            if (campoAtivo?.nome === "Tidal Seas") {
                const vidaBaseAtacante = atual.personagemAtivo?.vida ?? 100;

                if (atual.hpAtivo < vidaBaseAtacante / 2) {
                    reducaoDefensivaAtacante += 5;
                }
            }

            let danoRefletido = Math.max(
                0,
                danoBaseRefletido +
                bonusOfensivoDefensor -
                reducaoDefensivaAtacante
            );

            if (atual.itensAtivos.rigidShell && danoRefletido >= 15) {
                danoRefletido -= 6;
                registrarLog("Rigid Shell: Dano refletido reduzido em 6");
            }

            atual = {
                ...atual,
                hpAtivo: atual.hpAtivo - danoRefletido
            };

            if (danoRefletido > 0) {
                estatisticasConquistas.current.recebeuDano[atual.idUsuario] = true;
            }

            if (atual.hpAtivo > 0 && atual.hpAtivo < 10) {
                desbloquearConquista(atual.idUsuario, "porUmFio");
            }

            registrarLog(
                `Contra-ataque. ${atual.nome} recebeu ${danoRefletido} de volta`
            );

            // Verifica se o personagem do próprio jogador morreu.
            const morteJogador = resolverMorteJogador(atual, adversario);

            atual = morteJogador.atual;
            adversario = morteJogador.adversario;

            morteJogador.logs.forEach(registrarLog);

            if (
                (morteJogador.finalizada || morteJogador.aguardandoSubstituicao) &&
                adversario.personagemAtivo?.nome === "Dragon Knight"
            ) {
                desbloquearConquista(adversario.idUsuario, "contraAtaquePerfeito");
            }

            if (morteJogador.finalizada) {
                oponenteAtingiuVitoria = true;
                vencedorPorReflexao = morteJogador.vencedorId;
            }

            if (morteJogador.aguardandoSubstituicao) {
                substituicaoPendente = true;
            }
        }

        // Consome o efeito de ignorar defesa após o ataque.
        atual = {
            ...atual,
            ignorarDefesa: false
        };

        // Registra o ataque.
        const nomeAcao = numeroAcao === 1 ? "Ação 1" : "Ação 2";

        const logCura = curaPropria > 0
            ? ` / ${curaPropria} cura`
            : "";

        registrarLog(
            `${personagem.nome} usou ${nomeAcao}: ${danoFinal} dano${logCura}`
        );

        // Verifica a derrota do oponente.
        const morteOponente = resolverMorteOponente(atual, adversario);

        atual = morteOponente.atual;
        adversario = morteOponente.adversario;

        morteOponente.logs.forEach(registrarLog);

        if (morteOponente.finalizada) {
            atualAtingiuVitoria = true;
        }

        if (atualAtingiuVitoria || oponenteAtingiuVitoria) {
            finalizada = true;

            // Se ambos atingiram a condição de vitória, atual vence.
            vencedorAtual = atualAtingiuVitoria
                ? morteOponente.vencedorId
                : vencedorPorReflexao;
        }

        // Verifica novamente a morte do jogador, caso ainda tenha personagem.
        if (!finalizada && atual.personagemAtivo !== null) {
            const morteJogador = resolverMorteJogador(atual, adversario);

            atual = morteJogador.atual;
            adversario = morteJogador.adversario;

            morteJogador.logs.forEach(registrarLog);

            if (morteJogador.finalizada) {
                finalizada = true;
                vencedorAtual = morteJogador.vencedorId;
            }

            if (morteJogador.aguardandoSubstituicao) {
                substituicaoPendente = true;
            }
        }

        // Atualiza os estados e encerra a batalha, se necessário.
        if (finalizada && vencedorAtual !== null) {
            salvarEstadosJogadores(atual, adversario);
            finalizarBatalha(vencedorAtual);
            return;
        }

        // Passa o turno normalmente ou mantém o jogador atual
        // aguardando a substituição, caso tenha sido derrotado.
        passarTurno(
            false,
            atual,
            adversario,
            substituicaoPendente
        );
    }

    function desistir() {
        if (batalhaFinalizada || carregando) return;

        registrarLog(`${jogadorDaVez.nome} desistiu da batalha.`);

        finalizarBatalha(oponente.idUsuario);
    }

    function finalizarBatalha(idVencedor: number) {
        if (batalhaFinalizada) return;

        const vencedorEhJogador1 = idVencedor === jogador1.idUsuario;
        const vencedorEhJogador2 = idVencedor === jogador2.idUsuario;

        if (!vencedorEhJogador1 && !vencedorEhJogador2) {
            const mensagem = "Não foi possível identificar o vencedor da batalha.";

            setVencedor(null);
            setBatalhaFinalizada(true);
            setMostrarOverlayTurno(false);
            setAguardandoSubstituicao(false);
            setStatusResultado("erro");
            setErroResultado(mensagem);

            registrarLog(mensagem);
            return;
        }

        const idPerdedor = vencedorEhJogador1
            ? jogador2.idUsuario
            : jogador1.idUsuario;

        const nomeVencedor = vencedorEhJogador1
            ? jogador1.nome
            : jogador2.nome;

        const jogadorPerdedor = vencedorEhJogador1 ? jogador2 : jogador1;

        desbloquearConquista(idVencedor, "oPrimeiroPasso");

        if (typeof window !== "undefined") {
            const chaveVitorias = `cardgame_vitorias_${idVencedor}`;
            const totalVitorias = Number(localStorage.getItem(chaveVitorias) ?? "0") + 1;
            const chaveUltimoResultado = `cardgame_ultimo_resultado_${idVencedor}`;
            const ultimoResultado = localStorage.getItem(chaveUltimoResultado);

            localStorage.setItem(chaveVitorias, String(totalVitorias));
            localStorage.setItem(chaveUltimoResultado, "vitoria");

            if (totalVitorias >= 10) {
                desbloquearConquista(idVencedor, "caminhoDaMaestria");
            }

            if (ultimoResultado === "vitoria") {
                desbloquearConquista(idVencedor, "noEmbolo");
            }

            localStorage.setItem(
                `cardgame_ultimo_resultado_${idPerdedor}`,
                "derrota"
            );
        }

        if (
            jogadorPerdedor.personagensDerrotados >= 2
        ) {
            desbloquearConquista(idVencedor, "aGrandeVirada");
        }

        if (
            (estatisticasConquistas.current.personagensInvocados[idVencedor] ?? 0) === 1
        ) {
            desbloquearConquista(idVencedor, "solo");
        }

        if (!estatisticasConquistas.current.suporteUsado[idVencedor]) {
            desbloquearConquista(idVencedor, "autonomo");
        }

        if ((estatisticasConquistas.current.orbExplosoes[idVencedor] ?? 0) >= 3) {
            desbloquearConquista(idVencedor, "autoSabotagem");
        }

        if (
            estatisticasConquistas.current.errosRocky[idVencedor] &&
            estatisticasConquistas.current.errosFoggy[idVencedor]
        ) {
            desbloquearConquista(idVencedor, "nadaMePara");
        }

        setVencedor(nomeVencedor);
        setBatalhaFinalizada(true);
        setMostrarOverlayTurno(false);
        setAguardandoSubstituicao(false);

        setModalCartaAberto(false);
        setCartaSelecionada(null);
        setIndiceCartaSelecionada(null);

        setStatusResultado("salvando");
        setErroResultado(null);

        void sincronizarResultado(idVencedor, idPerdedor);
    }

    async function sincronizarResultado(idVencedor: number, idPerdedor: number) {

        if (idVencedor <= 0 || idPerdedor <= 0) {
            const mensagem = "Erro: ID de um dos jogadores inválido.";

            setStatusResultado("erro");
            setErroResultado(mensagem);
            registrarLog(mensagem);

            return;
        }

        try {
            const resposta = await fetch(
                "http://localhost:8081/Usuarios/resultado-batalha",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        idVencedor,
                        idPerdedor
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.erro ?? "Erro ao salvar o resultado da batalha."
                );
            }

            setStatusResultado("salvo")

            registrarLog(dados.Mensagem ?? "Resultado salvo com sucesso");

        } catch (erro) {
            const mensagem = erro instanceof Error
                ? erro.message
                : String(erro);

            setStatusResultado("erro");
            setErroResultado(mensagem);

            registrarLog(`Erro ao salvar resultado: ${mensagem}`);
        }
    }

    function obterEfeitos(jogador: EstadoJogador) {
        const efeitos: { texto: string; cor: string }[] = [];

        if (jogador.buffDano.valor > 0) {
            efeitos.push({
                texto: `ATK +${jogador.buffDano.valor} (${jogador.buffDano.duracao})`,
                cor: "#FF4500"
            });
        }

        if (jogador.buffDefesa.valor > 0) {
            efeitos.push({
                texto: `DEF +${jogador.buffDefesa.valor} (${jogador.buffDefesa.duracao})`,
                cor: "#1E90FF"
            });
        }

        if (jogador.turnosSemAcao > 0) {
            efeitos.push({
                texto: `STUN (${jogador.turnosSemAcao})`,
                cor: "#808000"
            });
        }

        if (jogador.refletirDano) {
            efeitos.push({
                texto: "REFLEXÃO",
                cor: "#9932CC"
            });
        }

        if (jogador.duracaoFocusLens > 0) {
            efeitos.push({
                texto: `FOCUS (${jogador.duracaoFocusLens})`,
                cor: "#228B22"
            });
        }

        if (jogador.duracaoSmokescreen > 0) {
            efeitos.push({
                texto: `SMOKE (${jogador.duracaoSmokescreen})`,
                cor: "#696969"
            });
        }

        if (jogador.itensAtivos.sharpClaws) {
            efeitos.push({ texto: "SHARP CLAWS", cor: "#B8860B" });
        }

        if (jogador.itensAtivos.rigidShell) {
            efeitos.push({ texto: "RIGID SHELL", cor: "#4682B4" });
        }

        if (jogador.itensAtivos.lifeDrainingFlower) {
            efeitos.push({ texto: "LIFE FLOWER", cor: "#8B008B" });
        }

        if (jogador.itensAtivos.devouringOrb) {
            efeitos.push({
                texto: `ORB (${jogador.hpColetadoOrb}/75)`,
                cor: "#4B0082"
            });
        }

        return efeitos;
    }

    function exibirCarta(borda: string, largura: string[], 
                         altura: string, nomeImagem: string, 
                         texto: string, tamanhoTexto: string,
                         borderRadius: string, fundo: string, 
                         clickable: boolean, proporcional: boolean = false,
                         onClick?: () => void) 
    {

        let click = ""
        if (clickable)
            click = "cursor-pointer"
        if (proporcional)
            altura = "aspect-[130/184]"

        return (
            <div onClick={clickable ? onClick : undefined} className={`${largura[0]} ${altura} border-[5px] ${borda} ${borderRadius} ${fundo} flex flex-col items-center justify-center text-center shrink-0 ${click}`}>
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
    if (erroCarregamento) {
        return (
            <main className="h-screen bg-[#1B1B2F] flex items-center justify-center p-6 text-white">

                <div className="flex flex-col items-center gap-6 text-center">

                    <h1 className="text-[clamp(30px,3vw,50px)] font-bold text-red-400">
                        Não foi possível iniciar a batalha
                    </h1>

                    <p className="text-[clamp(18px,1.5vw,26px)]">
                        {erroCarregamento}
                    </p>

                    <button
                        type="button"
                        onClick={() => router.push("/selecionar-oponente")}
                        className="rounded-xl border-2 border-[#C8911A] bg-[#21366B] px-10 py-4 text-xl font-semibold text-white transition hover:bg-[#2D4785] active:scale-95"
                    >
                        Voltar
                    </button>

                </div>

            </main>
        );
    }

    return (
        
        <main className="relative h-screen bg-[#1B1B2F] flex justify-center overflow-y-auto inventory-scrollbar">
            
            {/*container geral*/}
            <div className="flex flex-col w-[76vw] h-full">

                {/*Barra Superior*/}
                <div className="flex items-center justify-around gap-[3vw] h-[15vh]">

                    <h1 className={`${oponente.nome.length > 10
                                        ? "text-[clamp(35px,3.125vw,60px)]"
                                        : "text-[clamp(45px,3.75vw,72px)]"
                    }`}>
                        {oponente.nome}
                    </h1>

                    <div className="flex items-center gap-[3vw] overflow-x-auto min-w-0 max-w-[37vw] pb-3 inventory-scrollbar">
                        {oponente.mao.map((carta, indice) => (
                            <div key={`${carta.idCarta}-${indice}`} className="shrink-0">
                                {exibirCarta("border-[#686868]", ["w-[clamp(50px,4.167vw,80px)]", ""], "h-[clamp(55px,7.8704vh,85px)]", "", "", "", "rounded-[18px]", "bg-[#363C4B]", false)}
                            </div>
                        ))}
                    </div>
                    
                    <h1 className="text-[clamp(22px,1.875vw,36px)]" style={{ color : "red" }}>
                        Derrotados: {oponente.personagensDerrotados}/3
                    </h1>

                </div>

                {/*Campo de Batalha */}
                <div className="relative flex items-center h-[50.5vh]">
                    {/*Carta Jogador*/}
                    <div className="flex items-center justify-center w-[50%] h-full bg-[#363C4B]  gap-[20px]">
                        
                        <div className="flex flex-col">
                            <h1 className="text_dinheiro text-[clamp(25px,2.0833vw,40px)]">Você</h1>
                            {exibirCarta("border-[#C8911A]", ["w-[clamp(180px,13.0208vw,250px)]", ""], "h-[clamp(240px,31.4815vh,340px)]", "", jogadorDaVez.personagemAtivo?.nome ?? "Selecione um personagem", jogadorDaVez.personagemAtivo ? "text-[40px]" : "text-[25px]", "rounded-[30px]", "bg-[#21366B]", jogadorDaVez.personagemAtivo !== null, true, jogadorDaVez.personagemAtivo ? () => abrirModalCarta(jogadorDaVez.personagemAtivo!, false) : undefined)}
                        </div>

                        <div className="flex flex-col justify-start gap-[10px] h-[clamp(240px,31.4815vh,340px)] mt-[50px] min-w-0">
                                            
                            <h1 className="text-[clamp(25px,2.0833vw,40px)]">Vida: {jogadorDaVez.personagemAtivo ? jogadorDaVez.hpAtivo : "--"}</h1>

                            <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto inventory-scrollbar pr-2">
                                {obterEfeitos(jogadorDaVez).map((efeito, indice) => (
                                    <StatusIcon
                                        key={`${efeito.texto}-${indice}`}
                                        texto={efeito.texto}
                                        cor={efeito.cor}
                                    />
                                ))}
                            </div>

                        </div>

                    </div>

                    {campoAtivo && (
                        <div className="absolute bottom-[1vh] left-1/2 z-10 -translate-x-1/2">
                            {exibirCarta(
                                "border-[#C8911A]",
                                ["w-[clamp(85px,6.25vw,120px)]", ""],
                                "h-[clamp(110px,14vh,150px)]",
                                "",
                                campoAtivo.nome ?? "Campo",
                                "text-[clamp(11px,0.9vw,17px)]",
                                "rounded-[12px]",
                                "bg-[#216B35]",
                                true,
                                true,
                                () => abrirModalCarta(campoAtivo, false)
                            )}
                        </div>
                    )}
                    
                    {/*Carta Oponente*/}
                    <div className="flex items-center justify-center w-[50%] h-full bg-[#363C4B] gap-[20px]">
                        
                        <div className="flex flex-col">
                            <h1 className="text-[clamp(25px,2.0833vw,40px)]" style={{ color: "#B4B4B4" }}>
                                {oponente.nome}
                            </h1>
                            {exibirCarta("border-[#C8911A]", ["w-[clamp(180px,13.0208vw,250px)]", ""], "h-[clamp(240px,31.4815vh,340px)]", "", oponente.personagemAtivo?.nome ?? "Ainda não escolhido", oponente.personagemAtivo ? "text-[40px]" : "text-[25px]", "rounded-[30px]", "bg-[#21366B]", oponente.personagemAtivo !== null, true, oponente.personagemAtivo ? () => abrirModalCarta(oponente.personagemAtivo!, false) : undefined)}
                        </div>

                        <div className="flex flex-col justify-start gap-[10px] h-[clamp(240px,31.4815vh,340px)] mt-[50px] min-w-0">
                                            
                            <h1 className="text-[clamp(25px,2.0833vw,40px)]">Vida: {oponente.personagemAtivo ? oponente.hpAtivo : "--"}</h1>

                            <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto inventory-scrollbar pr-2">
                                {obterEfeitos(oponente).map((efeito, indice) => (
                                    <StatusIcon
                                        key={`${efeito.texto}-${indice}`}
                                        texto={efeito.texto}
                                        cor={efeito.cor}
                                    />
                                ))}
                            </div>

                        </div>

                    </div>

                </div>

                {/*Barra Inferior*/}
                <div className="flex flex-col h-[34.5vh]">

                    <div className="flex justify-start items-center pl-[5vw] gap-30">

                        <h1 className="text-[clamp(35px,3.125vw,60px)] pt-1 pb-3.5">{turnoDoJogador1 ? jogador1.nome : jogador2.nome}</h1>

                        <h1 className="text-[40px]" style={{ color : "red" }}>
                            Derrotados {jogadorDaVez.personagensDerrotados}/3
                        </h1>

                    </div>

                    <div className="flex justify-around items-start h-full min-w-0">

                        <div className="flex items-center gap-[2vw] overflow-x-auto min-w-0 max-w-[49.5vw] pb-3 inventory-scrollbar">

                            {jogadorDaVez.mao.map((carta, indice) => (

                                <div key={`${carta.idCarta}-${indice}`} className="shrink-0">

                                    {exibirCarta("border-[#686868]", ["w-[clamp(100px,7.8125vw,150px)]", ""], "h-[clamp(150px,20.3704vh,220px)]", "", carta.nome ?? "Carta", "text-[20px]", "rounded-[25px]", `bg-[${corTipo(carta.tipo ?? "Personagem")}]`, true, false, () => selecionarCarta(indice))}
                                
                                </div>

                            ))}

                        </div>

                        <div className="flex flex-col items-end gap-[45px] w-[29%] pr-[30px]">

                            <div className="flex justify-between w-full gap-[20px]">

                                <Botao
                                    texto="Ação 1"      
                                    raio={20}
                                    borda="border-[5px]"
                                    onClick={() => executarAcao(1)}
                                    disabled={
                                        carregando ||
                                        batalhaFinalizada ||
                                        mostrarOverlayTurno ||
                                        aguardandoSubstituicao ||
                                        !jogadorDaVez.personagemAtivo
                                    }
                                    className="botao_batalha w-[clamp(105px,9.4729vw,182px)] h-[clamp(45px,9.4815vh,83px)] flex items-center justify-center text-center text-[clamp(10px,1.8625vw,36px)]"
                                />

                                <Botao
                                    texto="Ação 2"      
                                    raio={20}
                                    borda="border-[5px]"
                                    onClick={() => executarAcao(2)}
                                    disabled={
                                        carregando ||
                                        batalhaFinalizada ||
                                        mostrarOverlayTurno ||
                                        aguardandoSubstituicao ||
                                        !jogadorDaVez.personagemAtivo ||
                                        !jogadorDaVez.personagemAtivo?.acao2
                                    }
                                    className="botao_batalha w-[clamp(105px,9.4729vw,182px)] h-[clamp(45px,9.4815vh,83px)] flex items-center justify-center text-center text-[clamp(10px,1.8625vw,36px)]"
                                />

                            </div>

                            <Botao
                                texto="Passar o turno"      
                                raio={20}
                                borda="border-[5px]"
                                onClick={() => passarTurno()}
                                disabled={
                                    carregando ||
                                    batalhaFinalizada ||
                                    mostrarOverlayTurno ||
                                    aguardandoSubstituicao ||
                                    !jogadorDaVez.personagemAtivo
                                }
                                className="botao_batalha w-[clamp(180px,16.1313vw,310px)] h-[clamp(45px,9.4815vh,83px)] flex items-center justify-center text-center text-[clamp(10px,1.8625vw,36px)]"
                            />

                        </div>

                    </div>

                </div>

            </div>
            {/*Barra Lateral*/}
            <aside className="w-[24vw] border-l-[7px] border-[#C8911A]">

                {/*Log de Batalha*/}
                <div className="h-[85vh] flex flex-col justify-center">

                    <h1 className="text-[clamp(24px,3vw,58px)] text-center pb-5">Log de Batalha</h1>

                    <div className="h-[80%] w-[95%] mx-auto overflow-y-auto flex flex-col gap-2 px-3 py-2">
                        {logs.length === 0 ? (
                                <p className="text-center text-gray-400">
                                    Nenhuma ação realizada.
                                </p>
                            ) : (
                                logs.map((mensagem, indice) => (
                                    <p
                                        key={`${indice}-${mensagem}`}
                                        className="text-white text-[clamp(13px,1.1vw,21px)] break-words"
                                    >
                                        {mensagem}
                                    </p>
                                ))
                            )}
                    </div>

                </div>

                {/*Desistir*/}
                <div className="h-[15vh] flex justify-center items-center border-t-[7px] border-[#C8911A]">

                    <Botao
                        texto="Desistir"
                        raio={20}
                        borda="border-[5px]"
                        onClick={desistir}
                        disabled={carregando || batalhaFinalizada}
                        className="botao_batalha w-[clamp(200px,20.625vw,396px)] h-[clamp(65px,11.2593vh,121px)] flex items-center justify-center text-center text-[clamp(30px,3.6042vw,70px)]"
                    />

                </div>

            </aside>

            {/* Overlay de troca de turno */}
            {mostrarOverlayTurno && !batalhaFinalizada && (

                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 p-4">

                    <div className="flex w-full max-w-xl flex-col items-center rounded-2xl border-8 border-[#C8911A] bg-[#1B1B2F] p-10 text-center text-white shadow-2xl">

                        <h1 className="mb-13 text-[clamp(28px,3.5vw,67px)] font-bold text_dinheiro">
                            Troca de turno
                        </h1>

                        <p className="mb-2 text-[clamp(20px,2.5vw,48px)]">
                            É a vez de:
                        </p>

                        <h2 className="mt-4 mb-13 text-[clamp(30px,4vw,77px)] font-bold">
                            {jogadorDaVez.nome}
                        </h2>

                        <Botao
                            texto="Iniciar turno"      
                            raio={20}
                            borda="border-[5px]"
                            onClick={() => iniciarTurno()}
                            type="button"
                            className="w-[clamp(180px,16.1313vw,310px)] h-[clamp(45px,9.4815vh,83px)] flex items-center justify-center text-center text-[clamp(10px,1.8625vw,36px)] loja-hover mt-5 mb-5"
                        />

                    </div>

                </div>
            )}

            {batalhaFinalizada && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="flex w-full max-w-xl flex-col items-center gap-5 rounded-2xl border-2 border-[#C8911A] bg-[#1B1B2F] p-10 text-center text-white shadow-2xl">

                        <h1 className="text-[clamp(32px,3vw,58px)] font-bold text-[#C8911A]">
                            Fim de batalha!
                        </h1>

                        <p className="text-[clamp(22px,1.8vw,34px)]">
                            Vencedor:
                        </p>

                        <h2 className="text-[clamp(28px,2.5vw,48px)] font-bold">
                            {vencedor ?? "Não identificado"}
                        </h2>

                        {statusResultado === "salvando" && (
                            <p className="text-yellow-400">
                                Salvando resultado no banco de dados...
                            </p>
                        )}

                        {statusResultado === "salvo" && (
                            <p className="text-green-400">
                                Resultado registrado com sucesso!
                            </p>
                        )}

                        {statusResultado === "erro" && (
                            <p className="text-red-400">
                                Não foi possível registrar o resultado: {erroResultado}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={() => router.push("/")}
                            className="mt-4 rounded-xl border-2 border-[#C8911A] bg-[#21366B] px-10 py-4 text-xl font-semibold text-white transition hover:bg-[#2D4785] active:scale-95"
                        >
                            Voltar
                        </button>

                    </div>
                </div>
            )}

            <Modal
                aberto={modalCartaAberto}
                titulo={cartaSelecionada?.nome ?? "Carta"}
                tipo="carta"
                carta={cartaSelecionada ?? undefined}
                mostrarConfirmacao={mostrarConfirmacao}
                onFechar={ fecharModalCarta }
                onConfirmar={ usarCartaSelecionada }
            />

        </main>
    )
}
