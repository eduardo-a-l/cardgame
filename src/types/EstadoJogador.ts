import { Carta } from "@/types/Carta";

export interface EstadoJogador {
    idUsuario: number;
    nome: string;

    mao: Carta[];
    deck: Carta[];

    personagemAtivo: Carta | null;
    hpAtivo: number;

    personagensDerrotados: number;

    buffDano: EfeitoTemporario;

    buffDefesa: EfeitoTemporario;

    turnosSemAcao: number;
    ignorarDefesa: boolean;

    bonusChanceCrit: number;
    refletirDano: boolean;
    podeJogarSuporte: boolean;
    erraProximoGolpe: boolean;

    duracaoFocusLens: number;
    duracaoSmokescreen: number;

    itensAtivos: ItensAtivos;

    hpColetadoOrb: number;

    ignorarDefesaProx: boolean;
    bonusCritProx: boolean;

    primeiroTurno: boolean;
}

export interface ItensAtivos {
    sharpClaws: boolean;
    rigidShell: boolean;
    lifeDrainingFlower: boolean;
    devouringOrb: boolean;
}

export interface EfeitoTemporario {
    valor: number;
    duracao: number;
}