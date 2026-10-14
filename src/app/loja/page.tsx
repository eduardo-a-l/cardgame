"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Botao } from "@/components/ui/Botao";

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

interface Pacote {
    raridade: string,
    cor: string,
    chancesCartas: number[],
    chancesUltimaCarta: number[],
    preco: number,
    descricao: string
}

export default function TelaLoja() {
    const router = useRouter();

    const [itens, setItens] = useState<ItemLoja[]>([]);
    
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
                    console.log("Dados do usuário:", dadosUsuario);
                    console.log("Moedas do usuário:", dadosUsuario.moedas);
                    setDinheiro(dadosUsuario.moedas);
                }

                await carregarItens(usuarioLocal.idUsuario);

            } catch (erro) {
                console.error(erro);
            }
        }
        carregarDados();
    }, [router]);

    const [indexSelecoes, setIndexSelecoes] = useState(2);

    const [indexSelecionado, setIndexSelecionado] = useState(-1);

    const pacotes: Pacote[] = [
        { raridade: "Base",     cor: "#21366B", chancesCartas: [0.45, 0.4, 0.14, 0.01, 0.0 ], chancesUltimaCarta: [0.0, 0.5, 0.45, 0.05, 0.0 ], preco: 80,  descricao: "Contém cartas aleatórias"},
        { raridade: "Avançado", cor: "#216B35", chancesCartas: [0.05, 0.4, 0.45, 0.09, 0.01], chancesUltimaCarta: [0.0, 0.0, 0.5,  0.45, 0.05], preco: 250, descricao: "Contém cartas aleatórias"},
        { raridade: "Épico",    cor: "#53216B", chancesCartas: [0.0,  0.1, 0.4,  0.45, 0.05], chancesUltimaCarta: [0.0, 0.0, 0.0,  0.7,  0.3 ], preco: 450, descricao: "Contém cartas aleatórias"}
    ];

    const ofertas = itens.filter(item => item.ehOferta && item.ativo);

    const avulsas = itens.filter(item => !item.ehOferta && item.ativo);

    const secoes = [
            { nome: "Ofertas",         dados: ofertas}, 
            { nome: "Pacotes",         dados: pacotes}, 
            { nome: "Cartas Avulsas",  dados: avulsas}, 
            { nome: "Fundos de campo", dados: [""]}
    ];

    function corTipo(x: string) {
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

    function checkCor(index: number) {
        if (index === indexSelecoes) {
            return "text_dinheiro";
        }
        return "text-white";
    }

    function descricao() {
        if (indexSelecionado === -1) {
            return ( <h1 className="text-[clamp(20px,3.125vw,45px)]">Selecione um item para ver a descrição</h1> )
        }

        if (indexSelecoes === 1) {
            const pacoteSelecionado = secoes[indexSelecoes].dados[indexSelecionado] as Pacote;
            const raridades = ["Comum", "Incomum", "Raro",    "Ultra Raro", "Lendário"];
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
                    {pacoteSelecionado.chancesCartas.map((chance, index) => (
                        <p key={index} className="text-[clamp(16px,1.2vw,24px)]" style={{ color: corTipo(raridades[index]) }}>
                            {raridades[index]}: {(chance*100).toFixed(0)}%
                        </p>
                    ))}
                    <p className="text-[clamp(18px,1.5vw,29px)]">
                        Chances da Última Carta:
                    </p>
                    {pacoteSelecionado.chancesUltimaCarta.map((chance, index) => (
                        <p key={index} className="text-[clamp(16px,1.2vw,24px)]" style={{ color: corTipo(raridades[index]) }}>
                            {raridades[index]}: {(chance*100).toFixed(0)}%
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

            if (exibicoes.length > 0) {

                return (exibicoes.map
                            ((item, index) => (
                                <div 
                                    key={item.idLojaItem}
                                    onClick={() => { setIndexSelecionado(index); }}
                                    className="loja-hover w-full max-w-[209px] aspect-[209/301.4] border-[5px] border-[#686868] rounded-[33px] shadow-sm flex flex-col items-center justify-center"
                                    style={{ backgroundColor: corTipo(item.carta_tipo) }}
                                >
                                    <p className="text-white text-[clamp(24px,1.98vw,38px)] text-center ">{item.carta_nome}</p>
                                    <p className="text_dinheiro text-[clamp(24px,1.98vw,38px)] text-center ">{ Math.floor(item.carta_precoPadrao * (1 - item.desconto)) }G</p>
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
                                    className="loja-hover w-full max-w-[209px] aspect-[209/301.4] border-[5px] rounded-[33px] shadow-sm flex items-center justify-center text-white text-[38px] text-center"
                                >
                                    {item.raridade}
                                </div>
                            ))
                        )

            }

            return ( <h1 className="absolute mt-[200px] text-[clamp(20px,3.125vw,45px)]">Sem pacotes disponíveis</h1> )
        }
        
        return ( <h1 className="absolute mt-[200px] text-[clamp(20px,3.125vw,45px)]">Função ainda em desenvolvimento</h1> )
    }

    async function gerenciarCompra() {
        if (indexSelecionado === -1) {
            alert("Por favor, selecione um item para comprar.")
            return
        }
        if (idUsuario === null) {
            alert("Por favor, faça login para realizar compras.")
            return
        }
        if (indexSelecoes !== 0 && indexSelecoes !== 2) {
            {/*Change*/}
            alert("A compra só pode ser realizada em Ofertas ou Cartas Avulsas.")
            return
        }
        const itemSelecionado = secoes[indexSelecoes].dados[indexSelecionado] as ItemLoja;
        const idItem = itemSelecionado.idLojaItem;

        try {
            const response = await fetch(`http://localhost:8081/Loja/comprar/${idUsuario}/${idItem}`, {
                method: "POST"
            });

            const resultado = await response.json();

            if (!response.ok) {
                alert(`Erro ao realizar compra: ${resultado.erro} mamou`);
                return;
            }

            setDinheiro(resultado.novoSaldo);

            {/*Change*/}
            alert(
                `${resultado.mensagem}\n` +
                `Preço pago: ${resultado.precoPago} moedas\n` +
                `Saldo atual: ${resultado.novoSaldo} moedas`
            );

            setIndexSelecionado(-1);
            await carregarItens(idUsuario);

        } catch (erro) {
            console.error("Erro ao realizar compra:", erro);
            alert("Não foi possível conectar à API.");
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

                            if (indexSelecionado === -1) {
                                alert("Por favor, selecione um item para ver os detalhes.");
                            }
                            else if ([0, 2].includes(indexSelecoes)) {
                                const idSelecionado = (secoes[indexSelecoes].dados[indexSelecionado] as ItemLoja).idCarta;
                                router.push(`/carta/${idSelecionado}/descricao`);
                            }

                        }}
                    />
                    {descricao()}
                </aside>

            </div>

        </main>
    )
}