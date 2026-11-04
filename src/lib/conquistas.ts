export type DificuldadeConquista = "Fácil" | "Médio" | "Difícil" | "Difícil+";

export interface Conquista {
    codigo: string;
    nome: string;
    descricao: string;
    dificuldade: DificuldadeConquista;
    icone: string;
}

export interface ConquistaDesbloqueada extends Conquista {
    dataDesbloqueio: string;
    idUsuario?: number;
    nomeUsuario?: string;
}

export const conquistas: Conquista[] = [
    {
        codigo: "porUmFio",
        nome: "Por um Fio",
        descricao: "Sobreviva a uma batalha com menos de 10 HP.",
        dificuldade: "Médio",
        icone: "porumfio"
    },
    {
        codigo: "desperdicio",
        nome: "Desperdício",
        descricao: "Recupere mais vida do que a necessária.",
        dificuldade: "Fácil",
        icone: "desperdicio"
    },
    {
        codigo: "paredeDeFerro",
        nome: "Parede de Ferro",
        descricao: "Anule completamente o dano de um ataque inimigo.",
        dificuldade: "Médio",
        icone: "parededeferro"
    },
    {
        codigo: "superacaoDeVida",
        nome: "Superação de Vida",
        descricao: "Derrote um personagem com mais vida que o seu, estando ambos com a vida máxima.",
        dificuldade: "Difícil",
        icone: "superacaodevida"
    },
    {
        codigo: "contraAsProbabilidades",
        nome: "Contra as Probabilidades",
        descricao: "Acerte um ataque mesmo tendo mais de 50% de chance de errar.",
        dificuldade: "Médio",
        icone: "contraasprobabilidades"
    },
    {
        codigo: "saqueador",
        nome: "Saqueador",
        descricao: "Roube mais de dois efeitos do oponente em um único turno.",
        dificuldade: "Difícil",
        icone: "saqueador"
    },
    {
        codigo: "oPrimeiroPasso",
        nome: "O Primeiro Passo",
        descricao: "Vença sua primeira batalha.",
        dificuldade: "Fácil",
        icone: "oprimeiropasso"
    },
    {
        codigo: "noEmbalo",
        nome: "No Embalo",
        descricao: "Vença duas batalhas consecutivas.",
        dificuldade: "Fácil",
        icone: "noembalo"
    },
    {
        codigo: "aGrandeVirada",
        nome: "A Grande Virada",
        descricao: "Vença uma batalha quando o oponente precisava derrotar apenas mais um personagem seu.",
        dificuldade: "Médio",
        icone: "agrandevirada"
    },
    {
        codigo: "segundoFolego",
        nome: "Segundo Fôlego",
        descricao: "Recupere toda a vida depois de perder mais da metade dela.",
        dificuldade: "Médio",
        icone: "segundofolego"
    },
    {
        codigo: "copia",
        nome: "Cópia",
        descricao: "Use a mesma carta utilizada pelo oponente.",
        dificuldade: "Médio",
        icone: "copia"
    },
    {
        codigo: "solo",
        nome: "Solo",
        descricao: "Vença uma batalha utilizando apenas um personagem.",
        dificuldade: "Difícil",
        icone: "solo"
    },
    {
        codigo: "overkill",
        nome: "Overkill",
        descricao: "Cause mais dano do que o necessário para derrotar um personagem.",
        dificuldade: "Fácil",
        icone: "overkill"
    },
    {
        codigo: "feiticoContraOFeiticeiro",
        nome: "Feitiço contra Feiticeiro",
        descricao: "Reflita um ataque do oponente.",
        dificuldade: "Médio",
        icone: "feiticocontraofeiticeiro"
    },
    {
        codigo: "minhasRegrasMeuJogo",
        nome: "Minhas Regras, Meu Jogo",
        descricao: "Troque o campo logo depois de o oponente trocar o dele.",
        dificuldade: "Fácil",
        icone: "minhasregrasmeujogo"
    },
    {
        codigo: "colecionadorDeStatus",
        nome: "Colecionador de Status",
        descricao: "Tenha todos os efeitos possíveis ativos simultaneamente.",
        dificuldade: "Difícil+",
        icone: "colecionadordestatus"
    },
    {
        codigo: "intocavel",
        nome: "Intocável",
        descricao: "Derrote um personagem inimigo sem receber dano.",
        dificuldade: "Difícil+",
        icone: "intocavel"
    },
    {
        codigo: "caminhoDaMaestria",
        nome: "Caminho da Maestria",
        descricao: "Vença dez batalhas.",
        dificuldade: "Médio",
        icone: "caminhodamaestria"
    },
    {
        codigo: "autonomo",
        nome: "Autônomo",
        descricao: "Vença uma batalha sem utilizar cartas de suporte.",
        dificuldade: "Difícil",
        icone: "autonomo"
    },
    {
        codigo: "autoSabotagem",
        nome: "Autossabotagem",
        descricao: "Vença uma batalha depois de utilizar o Devouring Orb três vezes e todas explodirem.",
        dificuldade: "Difícil+",
        icone: "autosabotagem"
    },
    {
        codigo: "espionagem",
        nome: "Espionagem",
        descricao: "Utilize Researcher's Help três vezes na mesma batalha.",
        dificuldade: "Médio",
        icone: "espionagem"
    },
    {
        codigo: "atravesDaNevoa",
        nome: "Através da Névoa",
        descricao: "Evite o efeito de Smokescreen ou Foggy Valley com Focus Lens ativo.",
        dificuldade: "Difícil",
        icone: "atravesdanevoa"
    },
    {
        codigo: "sobACoroa",
        nome: "Sob a Coroa",
        descricao: "Utilize King's Blessing e Queen's Blessing na mesma batalha.",
        dificuldade: "Fácil",
        icone: "sobacoroa"
    },
    {
        codigo: "turnoPerfeito",
        nome: "Turno Perfeito",
        descricao: "Cause dano, recupere vida e aplique um efeito em um único turno.",
        dificuldade: "Médio",
        icone: "turnoperfeito"
    },
    {
        codigo: "precisaoCirurgica",
        nome: "Precisão Cirúrgica",
        descricao: "Derrote um personagem com um ataque de Assassin enquanto ele estiver com a vida máxima.",
        dificuldade: "Médio",
        icone: "precisaocirurgica"
    },
    {
        codigo: "contraAtaquePerfeito",
        nome: "Contra-ataque Perfeito",
        descricao: "Com Dragon Knight, reflita dano suficiente para derrotar o inimigo.",
        dificuldade: "Difícil",
        icone: "contraataqueperfeito"
    },
    {
        codigo: "espadachimSupremo",
        nome: "Espadachim Supremo",
        descricao: "Com Sword Legend, ignore completamente a redução de dano e cause dano adicional no mesmo ataque.",
        dificuldade: "Difícil",
        icone: "espadachimsupremo"
    },
    {
        codigo: "aFlorDaVida",
        nome: "A Flor da Vida",
        descricao: "Recupere pelo menos 20 HP através de Life Draining Flower em uma batalha.",
        dificuldade: "Médio",
        icone: "aflordavida"
    },
    {
        codigo: "campoPerfeito",
        nome: "Campo Perfeito",
        descricao: "Ataque com o bônus de dano enquanto Fiery Field estiver ativo.",
        dificuldade: "Médio",
        icone: "campoperfeito"
    },
    {
        codigo: "refugio",
        nome: "Refúgio",
        descricao: "Recupere vida através de Forest Glade enquanto estiver abaixo de 50% da vida máxima.",
        dificuldade: "Fácil",
        icone: "refugio"
    },
    {
        codigo: "calmaAntesDaTempestade",
        nome: "Calma Antes da Tempestade",
        descricao: "Sobreviva a um ataque que normalmente derrotaria seu personagem graças a Tidal Seas.",
        dificuldade: "Médio",
        icone: "calmaantesdatempestade"
    },
    {
        codigo: "imunidade",
        nome: "Imunidade",
        descricao: "Mantenha Focus Lens ativo enquanto Foggy Valley e Smokescreen afetam a batalha.",
        dificuldade: "Médio",
        icone: "imunidade"
    },
    {
        codigo: "ataqueNoEscuro",
        nome: "Ataque no Escuro",
        descricao: "Acerte um ataque enquanto Foggy Valley e Smokescreen estiverem ativos.",
        dificuldade: "Difícil",
        icone: "ataquenoescuro"
    },
    {
        codigo: "regeneracaoAbsoluta",
        nome: "Regeneração Absoluta",
        descricao: "Utilize uma ação de cura enquanto Forest Glade e Life Draining Flower estiverem ativos.",
        dificuldade: "Médio",
        icone: "regeneracaoabsoluta"
    },
    {
        codigo: "guerraDeTerritorios",
        nome: "Guerra de Territórios",
        descricao: "Troque o campo pelo menos três vezes na mesma batalha.",
        dificuldade: "Fácil",
        icone: "guerradeterritorios"
    },
    {
        codigo: "nadaMePara",
        nome: "Nada Me Para",
        descricao: "Vença uma batalha depois de errar um ataque por Rocky Hills e outro por Foggy Valley.",
        dificuldade: "Difícil",
        icone: "nadamepara"
    },
    {
        codigo: "primeiraCompra",
        nome: "Primeira Compra",
        descricao: "Compre seu primeiro item na loja.",
        dificuldade: "Fácil",
        icone: "primeiracompra"
    },
    {
        codigo: "mercador",
        nome: "Mercador",
        descricao: "Venda uma carta pela primeira vez.",
        dificuldade: "Fácil",
        icone: "mercador"
    },
    {
        codigo: "pequenaFortuna",
        nome: "Pequena Fortuna",
        descricao: "Tenha 500 moedas.",
        dificuldade: "Médio",
        icone: "pequenafortuna"
    },
    {
        codigo: "fortuna",
        nome: "Fortuna",
        descricao: "Tenha 1000 moedas.",
        dificuldade: "Difícil",
        icone: "fortuna"
    },
    {
        codigo: "acumulador",
        nome: "Acumulador",
        descricao: "Tenha três cópias da mesma carta no inventário.",
        dificuldade: "Fácil",
        icone: "acumulador"
    },
    {
        codigo: "preparadoParaABatalha",
        nome: "Preparado para a Batalha",
        descricao: "Crie seu primeiro baralho.",
        dificuldade: "Fácil",
        icone: "preparadoparaabatalha"
    },
    {
        codigo: "deckCompleto",
        nome: "Deck Completo",
        descricao: "Monte um baralho com o número máximo de cartas.",
        dificuldade: "Médio",
        icone: "deckcompleto"
    },
    {
        codigo: "variedade",
        nome: "Variedade",
        descricao: "Tenha Personagem, Campo e Suporte no mesmo baralho.",
        dificuldade: "Fácil",
        icone: "variedade"
    },
    {
        codigo: "derrubandoALenda",
        nome: "Derrubando a Lenda",
        descricao: "Derrote Sword Legend utilizando Sword Apprentice.",
        dificuldade: "Difícil+",
        icone: "derrubandoalenda"
    }
];

const CHAVE_CONQUISTAS = "conquistas";

function obterChave(idUsuario: number): string {
    return `${CHAVE_CONQUISTAS}_${idUsuario}`;
}

export function obterConquistasLocais(
    idUsuario: number
): ConquistaDesbloqueada[] {
    if (typeof window === "undefined") return [];

    try {
        const dados = localStorage.getItem(obterChave(idUsuario));

        if (!dados) return [];

        return JSON.parse(dados) as ConquistaDesbloqueada[];
    } catch {
        return [];
    }
}

export function desbloquearConquista(
    idUsuario: number,
    codigo: string
): boolean {
    if (typeof window === "undefined" || !idUsuario) return false;

    const conquista = conquistas.find(
        item => item.codigo === codigo
    );

    if (!conquista) return false;

    const desbloqueadas = obterConquistasLocais(idUsuario);

    if (desbloqueadas.some(item => item.codigo === codigo)) {
        return false;
    }

    let nomeUsuario: string | undefined;

    try {
        const usuarioSalvo = localStorage.getItem("usuario");
        const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

        if (
            usuario?.idUsuario === idUsuario &&
            typeof usuario.nomeUsuario === "string"
        ) {
            nomeUsuario = usuario.nomeUsuario;
        }
    } catch {
        // Ignora dados de usuário inválidos no localStorage.
    }

    const novaConquista: ConquistaDesbloqueada = {
        ...conquista,
        dataDesbloqueio: new Date().toISOString(),
        idUsuario,
        ...(nomeUsuario ? { nomeUsuario } : {})
    };

    const atualizadas = [...desbloqueadas, novaConquista];

    localStorage.setItem(
        obterChave(idUsuario),
        JSON.stringify(atualizadas)
    );

    window.dispatchEvent(
        new CustomEvent("conquistaDesbloqueada", {
            detail: novaConquista
        })
    );

    return true;
}

export function verificarConquista(
    idUsuario: number,
    codigo: string
): boolean {
    return obterConquistasLocais(idUsuario).some(
        item => item.codigo === codigo
    );
}
