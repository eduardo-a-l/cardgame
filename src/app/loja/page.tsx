"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";
import Modal from "@/components/layout/Modal";
import type { CartaModal } from "@/components/layout/Modal";

interface ItemLoja {
    idLojaItem: number,
    idCarta: number,
    desconto: number,
    ehOferta: number,
    ativo: number,
    carta_nome: string,
    carta_tipo: string,
    carta_raridade: string,
    carta_precoPadrao: number,
    carta_vida?: number,
    carta_acao1: string,
    carta_acao2?: string
}

interface ProbabilidadesPacote {
    raridade: string,
    chanceCartas: number,
    chanceUltimaCarta: number
}

interface PacoteAPI {
    idPacote: number;
    raridade: string;
    preco: number;
    descricao: string;
    probabilidades: string | ProbabilidadesPacote[];
}

export interface Pacote {
    idPacote: number,
    raridade: string,
    probabilidades: ProbabilidadesPacote[],
    preco: number,
    descricao: string,
    cor?: string
}

export function corTipo(x: string) {
    return x === "Personagem" ? "#21366B"
            : x === "Suporte" ? "#53216B"
            : x === "Campo" ? "#216B35"
            : x === "Base" || x === "Avançado" ? "#D4AF37"
            : x === "Épico" ? "#C8911A"
            : x === "Incomum" ? "#56BF72"
            : x === "Raro" ? "#3960C2"
            : x === "Ultra Raro" ? "#620D69"
            : x === "Lendário" ? "#E6A71F"
            : "white";
}

export default function TelaLoja() {
    const router = useRouter();

    const [itens, setItens] = useState<ItemLoja[]>([]);
    const [pacotes, setPacotes] = useState<Pacote[]>([]);

    const [idUsuario, setIdUsuario] = useState<number | null>(null);
    const [dinheiro, setDinheiro] = useState<number>(0);

    async function carregarItens(id: number) {
        const response = await fetch(
            `http://localhost:8081/Loja/itens/${id}`
        );

        if (response.ok) {
            const dadosLoja: ItemLoja[] = await response.json();
            setItens(dadosLoja);
        }
    }

    useEffect(() => {
        async function carregarDados() {
            try {
                const usuarioSalvo = localStorage.getItem("usuario");

                if (!usuarioSalvo) {
                    router.push("/login");
                    return;
                }

                const usuarioLocal = JSON.parse(usuarioSalvo);

                setIdUsuario(usuarioLocal.idUsuario);
                
                const responseUsuario = await fetch(
                    `http://localhost:8081/Usuarios/${usuarioLocal.idUsuario}`
                );

                if (responseUsuario.ok) {
                    const dadosUsuario = await responseUsuario.json();
                    setDinheiro(dadosUsuario.moedas);
                }

                await carregarItens(usuarioLocal.idUsuario);

                const responsePacotes = await fetch(
                    "http://localhost:8081/Loja/pacotes"
                );

                if (!responsePacotes.ok) {
                    throw new Error("Erro ao carregar os pacotes");
                }

                const dadosPacotes: PacoteAPI[] = await responsePacotes.json();

                const pacotesComCor = dadosPacotes.map((pacote) => ({
                    ...pacote,
                    probabilidades:
                        typeof pacote.probabilidades === "string"
                            ? JSON.parse(pacote.probabilidades)
                            : pacote.probabilidades,
                    cor:
                        pacote.raridade === "Base" ? "#21366B" :
                        pacote.raridade === "Avançado" ? "#216B35" :
                        pacote.raridade === "Épico" ? "#53216B" :
                        "#686868"
                }));

                setPacotes(pacotesComCor);
                
            } catch (erro) {
                console.error(erro);
            }
        }
        carregarDados();
    }, [router]);

    const [indexSelecoes, setIndexSelecoes] = useState(2);

    const [indexSelecionado, setIndexSelecionado] = useState(-1);

    const ofertas = itens.filter(item => item.ehOferta && item.ativo);

    const avulsas = itens.filter(item => !item.ehOferta && item.ativo);

    const secoes = [
            { nome: "Ofertas",         dados: ofertas}, 
            { nome: "Pacotes",         dados: pacotes}, 
            { nome: "Cartas Avulsas",  dados: avulsas}, 
            { nome: "Fundos de campo", dados: [""]}
    ];

    const [modalAberto, setModalAberto] = useState(false);

    const [tituloModal, setTituloModal] = useState("");
    const [mensagemModal, setMensagemModal] = useState("");

    const [tipoModal, setTipoModal] = useState< "erro" | "sucesso" | "pacote" | "detalhesPacote" >("erro");

    const [cartasRecebidas, setCartasRecebidas] = useState<CartaModal[]>([]);

    const [pacoteDetalhes, setPacoteDetalhes] = useState<Pacote>()

    function checkCor(index: number) {
        if (index === indexSelecoes) {
            return "text_dinheiro";
        }
        return "text_indicesLoja";
    }

    function descricao() {
        if (indexSelecionado === -1) {
            return ( <h1 className="text-[clamp(20px,3.125vw,45px)]">Selecione um item para ver a descrição</h1> )
        }

        if (indexSelecoes === 1) {
            const pacoteSelecionado = secoes[indexSelecoes].dados[indexSelecionado] as Pacote;
            return (
                <div className="text-[clamp(20px,1.98vw,38px)] overflow-y-auto inventory-scrollbar">
                    <p style={{ color: pacoteSelecionado.cor }}>
                        Pacote {pacoteSelecionado.raridade}
                    </p>
                    <p className="text-[clamp(18px,1.5vw,29px)]">
                        {pacoteSelecionado.descricao}
                    </p>
                    <p className="text-[clamp(18px,1.5vw,29px)] text_dinheiro">
                        Preço: {pacoteSelecionado.preco}G
                    </p>
                    <p className="text-[clamp(18px,1.5vw,29px)]">
                        Chances das Cartas 1-4:
                    </p>
                    {pacoteSelecionado.probabilidades.map((probabilidade, index) => (
                        <p key={index} className="text-[clamp(16px,1.2vw,24px)]" style={{ color: corTipo(probabilidade.raridade) }}>
                            {probabilidade.raridade}: {(probabilidade.chanceCartas*100).toFixed(0)}%
                        </p>
                    ))}
                    <p className="text-[clamp(18px,1.5vw,29px)]">
                        Chances da Última Carta:
                    </p>
                    {pacoteSelecionado.probabilidades.map((probabilidade, index) => (
                        <p key={index} className="text-[clamp(16px,1.2vw,24px)]" style={{ color: corTipo(probabilidade.raridade) }}>
                            {probabilidade.raridade}: {(probabilidade.chanceUltimaCarta*100).toFixed(0)}%
                        </p>
                    ))}
                </div>
            )
        }

        if (indexSelecoes === 0 || indexSelecoes === 2) {
            const itemSelecionado = secoes[indexSelecoes].dados[indexSelecionado] as ItemLoja;
            return (
                <div className="text-[clamp(20px,1.98vw,38px)] overflow-y-auto inventory-scrollbar">
                    <p>
                        {itemSelecionado.carta_nome}<br/>
                    </p>
                    <p className="text-[clamp(18px,1.5vw,29px)]" style={{ color: corTipo(itemSelecionado.carta_tipo) }}>
                        Tipo: {itemSelecionado.carta_tipo}
                    </p>
                    <p className="text-[clamp(18px,1.5vw,29px)]" style={{ color: corTipo(itemSelecionado.carta_raridade) }}>
                        Raridade: {itemSelecionado.carta_raridade}
                    </p>
                    { itemSelecionado.carta_vida && ( 
                        <p className="text-[clamp(18px,1.5vw,29px)]" style={{ color: "#4CAF50" }}>
                            HP: {itemSelecionado.carta_vida}
                        </p>
                      ) 
                    }
                    { itemSelecionado.carta_tipo !== "Personagem"
                        ? 
                        (<p className="text-[clamp(18px,1.5vw,29px)]">
                            Efeito: {itemSelecionado.carta_acao1}
                        </p>)
                        : 
                        (
                            <>
                                <p className="text-[clamp(18px,1.5vw,29px)]">
                                    Ação 1: {itemSelecionado.carta_acao1}
                                </p>
                                
                                {
                                    itemSelecionado.carta_acao2
                                    ? 
                                    (<p className="text-[clamp(18px,1.5vw,29px)]">
                                            Ação 1: {itemSelecionado.carta_acao1}
                                    </p>)
                                    : null
                                }
                            </>
                        )
                    }
                </div>
            )
        }
    }

    function exibirCartas(indice: number) {
        const secao = secoes[indice];

        if (!secao)
            return null;

        if (secao.nome === "Ofertas" || secao.nome === "Cartas Avulsas") {

            const exibicoes = secao.dados as ItemLoja[];

            console.log("Mostando...")
            console.log(exibicoes)
            console.log(ofertas)
            console.log(itens)

            if (exibicoes.length > 0) {

                return (exibicoes.map
                            ((item, index) => (
                                <div 
                                    key={item.idLojaItem}
                                    onClick={() => { setIndexSelecionado(index); }}
                                    className="loja-hover w-full max-w-[209px] aspect-[209/301.4] border-[5px] border-[#686868] rounded-[33px] shadow-sm flex flex-col items-center justify-center"
                                    style={{ backgroundColor: corTipo(item.carta_tipo) }}
                                >
                                    <p className="text-[clamp(24px,1.5vw,29px)] text-center ">{item.carta_nome}</p>
                                    <p className="text_dinheiro text-[clamp(24px,1.5vw,29px)] text-center ">{ Math.floor(item.carta_precoPadrao * (1 - item.desconto)) }G</p>
                                </div>
                            ))
                        )

            }

            return ( <h1 className="absolute mt-[200px] text-[clamp(20px,3.125vw,45px)]">Sem itens disponíveis</h1> )

        }

        if (secao.nome === "Pacotes") {

            const exibicoes = secao.dados as Pacote[];

            if (exibicoes.length > 0) {

                return (exibicoes.map
                            ((item, index) => (
                                <div 
                                    key={index}
                                    style={{ backgroundColor: item.cor,
                                             borderColor: corTipo(item.raridade)
                                     }}
                                    onClick={() => { setIndexSelecionado(index); }}
                                    className="loja-hover w-full max-w-[209px] aspect-[209/301.4] border-[5px] rounded-[33px] shadow-sm flex flex-col items-center justify-center text-white text-[38px] text-center"
                                >
                                    <p className="text-[clamp(24px,1.5vw,29px)] text-center">{item.raridade}</p>
                                    <p className="text_dinheiro text-[clamp(24px,1.5vw,29px)] text-center ">{ item.preco }G</p>
                                </div>
                            ))
                        )

            }

            return ( <h1 className="absolute mt-[200px] text-[clamp(20px,3.125vw,45px)]">Sem pacotes disponíveis</h1> )
        }
        return ( <h1 className="absolute mt-[200px] text-[clamp(20px,3.125vw,45px)]">Função ainda em desenvolvimento</h1> )
    }

    async function gerenciarCompra() {
        if (indexSelecoes == 3) {
            setTituloModal("Compra Inválida!");
            setMensagemModal("Essa aba não possui compra implementada ainda!");
            setTipoModal("erro");
            setModalAberto(true);
            return
        }
        if (indexSelecionado === -1) {
            setTituloModal("Compra nula!");
            setMensagemModal("Certifique-se de que o item a ser comprado está selecionado.");
            setTipoModal("erro");
            setModalAberto(true);
            return
        }
        if (idUsuario === null) {
            alert("Por favor, faça login para realizar compras.")
            return
        }
        if (indexSelecoes == 1) {
            const pacoteSelecionado = secoes[indexSelecoes].dados[indexSelecionado] as Pacote;
            if (dinheiro < pacoteSelecionado.preco) {
                setTituloModal("Saldo insuficiente!");
                setMensagemModal("Você não possui moedas suficientes para comprar este pacote.");
                setTipoModal("erro");
                setModalAberto(true);
                return;
            }

            try {
                const response = await fetch(`http://localhost:8081/Loja/comprarPacote/${idUsuario}/${pacoteSelecionado.idPacote}`, {
                    method: "POST"
                });

                const resultado = await response.json();

                if (!response.ok) {
                    setTituloModal("Não foi possível realizar a compra");
                    setMensagemModal( resultado.erro || "Ocorreu um erro inesperado.");
                    setTipoModal("erro");
                    setModalAberto(true);
                    return;
                }

                setDinheiro(resultado.novoSaldo)

                setCartasRecebidas(resultado.cartas);
                setTituloModal("Pacote aberto!");
                setMensagemModal("Estas são as cinco cartas que você recebeu.");
                setTipoModal("pacote");
                setModalAberto(true);

                console.log("Cartas recebidas: ")
                console.table(resultado.cartas)

                setIndexSelecionado(-1);

            } catch (erro) {
                console.error("Erro ao realizar compra de pacote:", erro);
                setTituloModal("Erro de conexão");
                setMensagemModal("Não foi possível conectar ao servidor.");
                setTipoModal("erro");
                setModalAberto(true);
            }
            return;
        }
        if (indexSelecoes == 0 || indexSelecoes == 2) {
            const itemSelecionado = secoes[indexSelecoes].dados[indexSelecionado] as ItemLoja;
            const idItem = itemSelecionado.idLojaItem;

            try {
                const response = await fetch(`http://localhost:8081/Loja/comprar/${idUsuario}/${idItem}`, {
                    method: "POST"
                });

                const resultado = await response.json();

                if (!response.ok) {
                    setTituloModal("Não foi possível realizar a compra");
                    setMensagemModal( resultado.erro || "Ocorreu um erro inesperado.");
                    setTipoModal("erro");
                    setModalAberto(true);
                    return;
                }

                setDinheiro(resultado.novoSaldo);

                setTituloModal("Compra realizada!");
                setMensagemModal(`Carta ${itemSelecionado.carta_nome} comprada.\nNovo saldo: ${resultado.novoSaldo}G`);
                setTipoModal("sucesso");
                setModalAberto(true);

                setIndexSelecionado(-1);
                await carregarItens(idUsuario);

            } catch (erro) {
                console.error("Erro ao realizar compra:", erro);
                setTituloModal("Erro de conexão");
                setMensagemModal("Não foi possível conectar ao servidor.");
                setTipoModal("erro");
                setModalAberto(true);
            }
        }
    }

    return (
        <main className="relative h-screen bg-[#1B1B2F] flex justify-center xl:p-4">

            <div className="header-loja absolute top-[4.23vh] left-[2.083vw] right-[2.083vw] flex justify-between items-center">

                <Botao
                    texto="Voltar"
                    nomeIcone="voltar"
                    tamanhoIcone={40}
                    corDeFundo="transparent"
                    corDaBorda="transparent"
                    corDoTexto="#FFFFFF"
                    onClick={() => router.push("/")}
                    className="botao-sair-loja loja-hover"
                />

                <h1 className="text-[53px] text-white">Loja</h1>

                <h2 className="text_dinheiro text-[clamp(35px,2.760vw,53px)]">Moedas: {dinheiro}G</h2>

            </div>
            
            <div className="loja-container w-screen 2xl:w-[95vw] mt-[clamp(120px,14vh,151.2px)] grid grid-cols-[15vw_1fr_15vw]">
                
                <aside className="min-h-0 h-full flex flex-col pt-[2vh] ">
                    
                    {secoes.map((nome_e_itens, index) => (
                            <h2 
                                key={index} 
                                className={`${checkCor(index)} loja-hover text-[clamp(20px,1.98vw,38px)] mt-[clamp(21px,3.17vh,30px)] mb-[clamp(10px,7.41vh,70px)] ml-[clamp(10px,1.615vw,31px)] border-b-[3px] border-[#686868] rounded-[10px] text-center hover:bg-[#21366B]`}
                                onClick={ () => {setIndexSelecoes(index); setIndexSelecionado(-1)} }
                            >
                                • {nome_e_itens.nome}
                            </h2>
                        ))}

                </aside>

                <section className="min-h-0 overflow-y-auto inventory-scrollbar pl-[2vw] pr-[1vw] mr-[1vw] pt-[2vh]">

                    <div className="grid grid-cols-4 gap-[3vw] justify-items-center">

                        {exibirCartas(indexSelecoes)}

                    </div>

                </section>

                <aside className="min-h-0 h-full flex flex-col items-center pt-[2vh]">

                    <Botao
                        texto="Comprar"
                        raio={20}
                        className="loja-hover w-[clamp(50px,13.03vw,250px)] h-[clamp(30px,9vh,85px)] flex items-center justify-center text-center text-[clamp(15px,2.240vw,43px)] mb-[clamp(21px,3.175vh,30px)]"
                        onClick={() => {
                            gerenciarCompra()
                        }}
                    />

                    <Botao
                        texto="Detalhes"
                        raio={20}
                        className="loja-hover w-[clamp(50px,13.03vw,250px)] h-[clamp(30px,9vh,85px)] flex items-center justify-center text-center text-[clamp(15px,2.240vw,43px)] mb-[clamp(21px,6.35vh,60px)]"
                        onClick={() => { 
                            if (indexSelecoes == 3) {
                                setTituloModal("Função não implementada");
                                setMensagemModal("A parte de detalhes ainda não foi implementada pra fundos de campo.");
                                setTipoModal("erro");
                                setModalAberto(true);
                            }
                            else if (indexSelecionado === -1) {
                                setTituloModal("Item não selecionado");
                                setMensagemModal("Selecione um item válido para ver detalhes.");
                                setTipoModal("erro");
                                setModalAberto(true);
                            }
                            else if ([0, 2].includes(indexSelecoes)) {
                                const idSelecionado = (secoes[indexSelecoes].dados[indexSelecionado] as ItemLoja).idCarta;
                                router.push(`/carta/${idSelecionado}/descricao`);
                            }
                            else if (indexSelecoes == 1) {
                                setPacoteDetalhes(pacotes[indexSelecionado])
                                setTituloModal(`Pacote ${pacoteDetalhes?.raridade}`);
                                setMensagemModal(pacoteDetalhes?.descricao as string);
                                setTipoModal("detalhesPacote");
                                setModalAberto(true);
                            }
                        }}
                    />
                    {descricao()}
                </aside>

            </div>
            
            <Modal
                aberto={modalAberto}
                titulo={tituloModal}
                mensagem={mensagemModal}
                tipo={tipoModal}
                cartas={cartasRecebidas}
                pacote={pacoteDetalhes}
                onFechar={() => setModalAberto(false)}
            />

        </main>
    )
}