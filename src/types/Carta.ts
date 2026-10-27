
export interface Carta 
{
    idCarta?: number;
    nome?: string;
    tipo?: string;
    raridade?: string;
    precoPadrao?: number;
    vida?: number;
    acao1?: string;
    acao2?: string;
}

export interface InventarioBaralho {
    idInventario: number;
    idUsuario: number;
    idCarta: number;
    Carta: Carta;
}

export interface Baralho {
    idBaralho: number;
    nome: string;
    idUsuario: number;
    Inventarios: InventarioBaralho[];
}