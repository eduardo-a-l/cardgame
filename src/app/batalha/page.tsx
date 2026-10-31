"use client";
import { JSX, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Botao } from "@/components/ui/Botao";
import { NomeIcone, Icone } from "@/components/ui/Icone";

import Modal, { CartaModal } from "@/components/layout/Modal";

import { Carta, Baralho } from "@/types/Carta";
import { EstadoJogador } from "@/types/EstadoJogador";
import { corTipo } from "../loja/page";
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

    const [aguardandoSubstituicao, setAguardandoSubstituicao] = useState(false);

    const [logs, setLogs] = useState<string[]>([]);

    const [cartaSelecionada, setCartaSelecionada] = useState<CartaModal | null>(null);

    const [indiceCartaSelecionada, setIndiceCartaSelecionada] = useState<number | null>(null);

    const [modalCartaAberto, setModalCartaAberto] = useState(false);

    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

    const [mostrarOverlayTurno, setMostrarOverlayTurno] = useState(false);

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

                // A preparação inicial ainda precisa permitir
                // que cada jogador escolha seu personagem.
                setAguardandoSubstituicao(true);
                setTurnoDoJogador1(Math.random() < 0.5);
                setContadorTurno(1);
                setCampoAtivo(null);
                setBatalhaFinalizada(false);
                setVencedor(null);
                setMostrarOverlayTurno(false);
                setLogs([`Batalha iniciada: ${dadosJogador1.nomeUsuario} vs ${dadosJogador2.nomeUsuario}`]);

                console.log("Jogador 1:", jogadorInicial1);
                console.log("Jogador 2:", jogadorInicial2);
                console.log("Cartas do jogador 1:", jogadorInicial1.mao);
                console.log("Cartas do jogador 2:", jogadorInicial2.mao);

            } catch (erro) {
                if (cancelado) return

                console.error("Erro ao carregar a batalha:", erro);
                setLogs([
                    erro instanceof Error
                        ? erro.message
                        : "Erro desconhecido ao carregar a batalha."
                ]);
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
        let vencedorAtual = vencedor;

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
        const novaDuracaoDano = Math.max(0, atual.buffDano.duracao - 1);

        // Decrementa a duração do buff de defesa
        const novaDuracaoDefesa = Math.max(0, atual.buffDefesa.duracao - 1);

        // Decrementa os turnos sem ação
        const novosTurnosSemAcao = Math.max(0, atual.turnosSemAcao - 1);

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

            duracaoFocusLens: Math.max(0, atual.duracaoFocusLens - 1),

            duracaoSmokescreen: Math.max(0, atual.duracaoSmokescreen - 1)
        };

        // Life Draining Flower
        if (atual.itensAtivos.lifeDrainingFlower && atual.personagemAtivo !== null && adversario.personagemAtivo !== null) {
            const vidaBase = atual.personagemAtivo.vida ?? 100;

            adversario = {
                ...adversario,
                hpAtivo: adversario.hpAtivo - 4
            };

            atual = {
                ...atual,
                hpAtivo: Math.min(atual.hpAtivo + 4, vidaBase)
            };

            registrarLog("Life Draining Flower: Roubou 4 HP do oponente");

            // Verifica se o oponente morreu
            const morteOponente = resolverMorteOponente(atual, adversario);

            atual = morteOponente.atual;
            adversario = morteOponente.adversario;

            morteOponente.logs.forEach(registrarLog);

            if (morteOponente.finalizada) {
                finalizada = true;
                vencedorAtual = morteOponente.vencedor;
            }
        }

        // Por enquanto, os suportes ficam disponíveis.
        // A restrição do Toxic Swamp será adicionada quando implementarmos os campos.
        atual = {
            ...atual,
            podeJogarSuporte: true
        };

        salvarEstadosJogadores(atual, adversario);

        setAguardandoSubstituicao(substituicaoPendente);

        if (finalizada) {
            setBatalhaFinalizada(true);
            setVencedor(vencedorAtual);
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
            vida: carta.vida,
            acao1: carta.acao1,
            acao2: carta.acao2
        });

        setMostrarConfirmacao(mostrarConfirmacao)
        setIndiceCartaSelecionada(indice ?? null);
        setModalCartaAberto(true);
    }

    function usarCartaSelecionada() {
        if (!cartaSelecionada || indiceCartaSelecionada === null) return;

        const jogadorAtualizado = {...jogadorDaVez}

        switch (cartaSelecionada.tipo) {

            case "Personagem": {
                if (jogadorDaVez.personagemAtivo !== null) return;

                if (!jogadorDaVez.primeiroTurno && !aguardandoSubstituicao) return;

                const consumirTurno = jogadorDaVez.primeiroTurno;

                jogadorAtualizado.personagemAtivo = cartaSelecionada,
                jogadorAtualizado.hpAtivo         = cartaSelecionada.vida ?? 100,
                jogadorAtualizado.mao             = jogadorDaVez.mao.filter( (_, indice) => indice !== indiceCartaSelecionada ),
                jogadorAtualizado.primeiroTurno   = false

                atualizarJogadorDaVez(jogadorAtualizado)

                setAguardandoSubstituicao(false);
                setModalCartaAberto(false);
                setCartaSelecionada(null);
                setIndiceCartaSelecionada(null);

                if (consumirTurno) {
                    passarTurno(true, jogadorAtualizado);
                }
                
                break
            }

            case "Suporte":
                // Aplicar o efeito do suporte
                break;

            case "Campo":
                // Ativar ou trocar o campo
                break;

            default:
                console.log("Tipo de carta desconhecido:", cartaSelecionada.tipo);
                return;
        }

        setCartaSelecionada(null);
        setIndiceCartaSelecionada(null);
    }

    function passarTurno(liberarSelecaoInicial: boolean = false, jogadorAtualizadoInicial?: EstadoJogador) {
        if (aguardandoSubstituicao && !batalhaFinalizada && !liberarSelecaoInicial) {
            return;
        }

        let atual = jogadorAtualizadoInicial ?? jogadorDaVez;
        let adversario = oponente;

        let finalizada = batalhaFinalizada;
        let vencedorAtual = vencedor;
        let substituicaoPendente = liberarSelecaoInicial ? false : aguardandoSubstituicao;

        // Devouring Orb
        if (atual.itensAtivos.devouringOrb && adversario.personagemAtivo !== null) {
            const hpColetado =
                adversario.hpAtivo < 10
                    ? atual.hpColetadoOrb + adversario.hpAtivo
                    : atual.hpColetadoOrb + 10;

            registrarLog(
                `Devouring Orb: Sugou ${adversario.hpAtivo} do oponente (${hpColetado}/75)`
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
                vencedorAtual = morteOponente.vencedor;
            }

            if (finalizada) {
                salvarEstadosJogadores(atual, adversario);
                setBatalhaFinalizada(true);
                setVencedor(vencedorAtual);
                return;
            }

            // Explosão do Devouring Orb
            if (hpColetado >= 75) {

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

                registrarLog(`O Devouring Orb explodiu. 45 de dano em ${atual.nome}`);

                // Verifica se o próprio jogador morreu
                const morteJogador = resolverMorteJogador(atual, adversario);

                atual = morteJogador.atual;
                adversario = morteJogador.adversario;

                morteJogador.logs.forEach(registrarLog);

                if (morteJogador.finalizada) {
                    finalizada = true;
                    vencedorAtual = morteJogador.vencedor;
                }

                if (morteJogador.aguardandoSubstituicao) {
                    substituicaoPendente = true;
                }
            }
        }

        // Salva as alterações feitas nos jogadores
        salvarEstadosJogadores(atual, adversario);

        setAguardandoSubstituicao(substituicaoPendente);

        if (finalizada) {
            setBatalhaFinalizada(true);
            setVencedor(vencedorAtual);
            return;
        }

        // Não passa o turno se ainda estiver aguardando substituição
        if (substituicaoPendente) return;

        // Exibe o aviso de troca de turno
        setMostrarOverlayTurno(true);

        // Alterna o jogador
        const proximoTurnoDoJogador1 = !turnoDoJogador1;

        setTurnoDoJogador1(proximoTurnoDoJogador1);

        // Incrementa o contador quando o turno volta ao jogador 1
        if (proximoTurnoDoJogador1) {
            setContadorTurno(anterior => anterior + 1);
        }
    }

    function atualizarJogadorDaVez(jogadorAtualizado: EstadoJogador) {
        if (turnoDoJogador1) {
            setJogador1(jogadorAtualizado);
        } else {
            setJogador2(jogadorAtualizado);
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
            bonusCritProx: false
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
                vencedor: null,
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
            vencedor: finalizada ? atual.nome : null,
            logs: logsNovos
        };
    }

    function resolverMorteJogador(atual: EstadoJogador, adversario: EstadoJogador) {
        if (atual.personagemAtivo === null || atual.hpAtivo > 0) {
            return {
                atual,
                adversario,
                finalizada: false,
                vencedor: null,
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
            vencedor: finalizada ? adversario.nome : null,
            aguardandoSubstituicao: !finalizada,
            logs: logsNovos
        };
    }

    function registrarLog(mensagem: string) {
        setLogs(anterior => [mensagem, ...anterior].slice(0, 15));
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
    return (
        
        <main className="relative h-screen bg-[#1B1B2F] flex justify-center overflow-y-auto inventory-scrollbar">
            
            {/*container geral*/}
            <div className="flex flex-col w-[76vw] h-full">

                {/*Barra Superior*/}
                <div className="flex items-center justify-center gap-[3vw] h-[15vh]">

                    <h1 className="text-[52px] shrink-0">{oponente.nome}</h1>

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
                <div className="flex items-center h-[53vh]">
                    {/*Carta Jogador*/}
                    <div className="flex items-center justify-center w-[50%] h-full bg-[#363C4B]  gap-[20px]">
                        
                        <div className="flex flex-col">
                            <h1 className="text_dinheiro text-[30px]">Você</h1>
                            {exibirCarta("border-[#C8911A]", ["w-[clamp(180px,13.0208vw,250px)]", ""], "h-[clamp(240px,31.4815vh,340px)]", "", jogadorDaVez.personagemAtivo?.nome ?? "Selecione um personagem", jogadorDaVez.personagemAtivo ? "text-[40px]" : "text-[25px]", "rounded-[15px]", "bg-[#21366B]", jogadorDaVez.personagemAtivo !== null, true, jogadorDaVez.personagemAtivo ? () => abrirModalCarta(jogadorDaVez.personagemAtivo!, false) : undefined)}
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
                            {exibirCarta("border-[#C8911A]", ["w-[clamp(180px,13.0208vw,250px)]", ""], "h-[clamp(240px,31.4815vh,340px)]", "", oponente.personagemAtivo?.nome ?? "Ainda não escolhido", oponente.personagemAtivo ? "text-[40px]" : "text-[25px]", "rounded-[15px]", "bg-[#21366B]", oponente.personagemAtivo !== null, true, oponente.personagemAtivo ? () => abrirModalCarta(oponente.personagemAtivo!, false) : undefined)}
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

                        <div className="flex items-center gap-[2vw] overflow-x-auto min-w-0 max-w-[49.5vw] pb-3 inventory-scrollbar">

                            {jogadorDaVez.mao.map((carta, indice) => (

                                <div key={`${carta.idCarta}-${indice}`} className="shrink-0">

                                    {exibirCarta("border-[#686868]", ["w-[clamp(100px,7.8125vw,150px)]", ""], "h-[clamp(150px,20.3704vh,220px)]", "", carta.nome ?? "Carta", "text-[20px]", "rounded-[25px]", `bg-[${corTipo(carta.tipo ?? "Personagem")}]`, true, false, () => selecionarCarta(indice))}
                                
                                </div>

                            ))}

                        </div>

                        <div className="flex flex-col items-end gap-[25px] w-[29%] pr-[30px]">

                            <div className="flex justify-between w-full gap-[20px]">

                                <Botao
                                    texto="Ação 1"      
                                    raio={20}
                                    borda="border-[5px]"
                                    className="w-[clamp(105px,9.4729vw,182px)] h-[clamp(45px,9.4815vh,83px)] flex items-center justify-center text-center text-[clamp(10px,1.5625vw,30px)]"
                                />

                                <Botao
                                    texto="Ação 2"      
                                    raio={20}
                                    borda="border-[5px]"
                                    className="w-[clamp(105px,9.4729vw,182px)] h-[clamp(45px,9.4815vh,83px)] flex items-center justify-center text-center text-[clamp(10px,1.5625vw,30px)]"
                                />

                            </div>

                            <Botao
                                texto="Passar o turno"      
                                raio={20}
                                borda="border-[5px]"
                                className="w-[clamp(180px,16.1313vw,310px)] h-[clamp(45px,9.4815vh,83px)] flex items-center justify-center text-center text-[clamp(10px,1.5625vw,30px)]"
                            />

                        </div>

                    </div>

                </div>

            </div>
            {/*Barra Lateral*/}
            <aside className="w-[24vw] border-l-[7px] border-[#C8911A]">

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
                        className="w-[clamp(200px,20.625vw,396px)] h-[clamp(65px,11.2593vh,121px)] flex items-center justify-center text-center text-[clamp(30px,3.6042vw,70px)]"
                    />

                </div>

            </aside>

            {/* Overlay de troca de turno */}
            {mostrarOverlayTurno && !batalhaFinalizada && (

                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 p-4">

                    <div className="flex w-full max-w-lg flex-col items-center rounded-2xl border-2 border-[#C8911A] bg-[#1B1B2F] p-10 text-center text-white shadow-2xl">

                        <h1 className="mb-4 text-[clamp(28px,2.5vw,48px)] font-bold text-[#C8911A]">
                            Troca de turno
                        </h1>

                        <p className="mb-2 text-[clamp(20px,1.5vw,29px)]">
                            É a vez de:
                        </p>

                        <h2 className="mb-8 text-[clamp(30px,2vw,40px)] font-bold">
                            {jogadorDaVez.nome}
                        </h2>

                        <button
                            type="button"
                            onClick={iniciarTurno}
                            className="rounded-xl border-2 border-[#C8911A] bg-[#21366B] px-10 py-4 text-xl font-semibold text-white transition hover:bg-[#2D4785] active:scale-95"
                        >
                            Iniciar turno
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
                onFechar={() => setModalCartaAberto(false)}
                onConfirmar={() => {
                    usarCartaSelecionada
                }}
            />

        </main>
    )
}