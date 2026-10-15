import { ComponentProps } from "react";

import IconeLeaderboard from "@/assets/icons/leaderboard.svg";
import IconeUsuario from "@/assets/icons/user.svg";
import IconeConfiguracoes from "@/assets/icons/settings.svg";
import IconeJogar from "@/assets/icons/play.svg";
import IconeInventario from "@/assets/icons/package.svg";
import IconeBaralho from "@/assets/icons/deck.svg";
import IconeLoja from "@/assets/icons/shop.svg";
import IconeVoltar from "@/assets/icons/back.svg";
import IconeNovo from "@/assets/icons/plus.svg";
import IconeParaBaixo from "@/assets/icons/down.svg";
import IconeLanca from "@/assets/icons/lanca.svg";
import IconeEspada from "@/assets/icons/espada.svg";
import IconeCadeado from "@/assets/icons/cadeado.svg";

import IconeAFlorDaVida from "@/assets/conquistas/a-flor-da-vida.svg";
import IconeAGrandeVirada from "@/assets/conquistas/a-grande-virada.svg";
import IconeAcumulador from "@/assets/conquistas/acumulador.svg";
import IconeAtaqueNoEscuro from "@/assets/conquistas/ataque-no-escuro.svg";
import IconeAtravesDaNevoa from "@/assets/conquistas/atraves-da-nevoa.svg";
import IconeAutoSabotagem from "@/assets/conquistas/auto-sabotagem.svg";
import IconeAutonomo from "@/assets/conquistas/autonomo.svg";
import IconeCalmaAntesDaTempestade from "@/assets/conquistas/calma-antes-da-tempestade.svg";
import IconeCaminhoDaMaestria from "@/assets/conquistas/caminho-da-maestria.svg";
import IconeCampoPerfeito from "@/assets/conquistas/campo-perfeito.svg";
import IconeColecionadorDeStatus from "@/assets/conquistas/colecionador-de-status.svg";
import IconeContraAsProbabilidades from "@/assets/conquistas/contra-as-probabilidades.svg";
import IconeContraAtaquePerfeito from "@/assets/conquistas/contra-ataque-perfeito.svg";
import IconeCopia from "@/assets/conquistas/Copia.svg";
import IconeDeckCompleto from "@/assets/conquistas/deck-completo.svg";
import IconeDerrubandoALenda from "@/assets/conquistas/derrubando-a-lenda.svg";
import IconeDesperdicio from "@/assets/conquistas/desperdicio.svg";
import IconeEspadachimSupremo from "@/assets/conquistas/espadachim-supremo.svg";
import IconeEspionagem from "@/assets/conquistas/espionagem.svg";
import IconeFeiticoContraOFeiticeiro from "@/assets/conquistas/feitico-contra-o-feiticeiro.svg";
import IconeFortuna from "@/assets/conquistas/fortuna.svg";
import IconeGuerraDeTerritorios from "@/assets/conquistas/guerra-de-territorios.svg";
import IconeImunidade from "@/assets/conquistas/imunidade.svg";
import IconeIntocavel from "@/assets/conquistas/intocavel.svg";
import IconeMercador from "@/assets/conquistas/mercador.svg";
import IconeMinhasRegrasMeuJogo from "@/assets/conquistas/minhas-regras-meu-jogo.svg";
import IconeNadaMePara from "@/assets/conquistas/nada-me-para.svg";
import IconeNoEmbalo from "@/assets/conquistas/no-embalo.svg";
import IconeOPrimeiroPasso from "@/assets/conquistas/o-primeiro-passo.svg";
import IconeOverkill from "@/assets/conquistas/overkill.svg";
import IconeParedeDeFerro from "@/assets/conquistas/parede-de-ferro.svg";
import IconePequenaFortuna from "@/assets/conquistas/pequena-fortuna.svg";
import IconePorUmFio from "@/assets/conquistas/por-um-fio.svg";
import IconePrecisaoCirurgica from "@/assets/conquistas/precisao-cirurgica.svg";
import IconePreparadoParaABatalha from "@/assets/conquistas/preparado-para-a-batalha.svg";
import IconePrimeiraCompra from "@/assets/conquistas/primeira-compra.svg";
import IconeRefugio from "@/assets/conquistas/refugio.svg";
import IconeRegeneracaoAbsoluta from "@/assets/conquistas/regeneracao-absoluta.svg";
import IconeSaqueador from "@/assets/conquistas/saqueador.svg";
import IconeSegundoFolego from "@/assets/conquistas/segundo-folego.svg";
import IconeSobACoroa from "@/assets/conquistas/sob-a-coroa.svg";
import IconeSolo from "@/assets/conquistas/solo.svg";
import IconeSuperacaoDeVida from "@/assets/conquistas/superacao-de-vida.svg";
import IconeTurnoPerfeito from "@/assets/conquistas/turno-perfeito.svg";
import IconeVariedade from "@/assets/conquistas/variedade.svg";

const icones = {
  leaderboard: IconeLeaderboard,
  usuario: IconeUsuario,
  configuracoes: IconeConfiguracoes,
  jogar: IconeJogar,
  inventario: IconeInventario,
  baralho: IconeBaralho,
  loja: IconeLoja,
  voltar: IconeVoltar,
  novo: IconeNovo,
  paraBaixo: IconeParaBaixo,
  espada: IconeEspada,
  lança: IconeLanca,
  cadeado: IconeCadeado,

  aFlorDaVida: IconeAFlorDaVida,
  aGrandeVirada: IconeAGrandeVirada,
  acumulador: IconeAcumulador,
  ataqueNoEscuro: IconeAtaqueNoEscuro,
  atravesDaNevoa: IconeAtravesDaNevoa,
  autoSabotagem: IconeAutoSabotagem,
  autonomo: IconeAutonomo,
  calmaAntesDaTempestade: IconeCalmaAntesDaTempestade,
  caminhoDaMaestria: IconeCaminhoDaMaestria,
  campoPerfeito: IconeCampoPerfeito,
  colecionadorDeStatus: IconeColecionadorDeStatus,
  contraAsProbabilidades: IconeContraAsProbabilidades,
  contraAtaquePerfeito: IconeContraAtaquePerfeito,
  copia: IconeCopia,
  deckCompleto: IconeDeckCompleto,
  derrubandoALenda: IconeDerrubandoALenda,
  desperdicio: IconeDesperdicio,
  espadachimSupremo: IconeEspadachimSupremo,
  espionagem: IconeEspionagem,
  feiticoContraOFeiticeiro: IconeFeiticoContraOFeiticeiro,
  fortuna: IconeFortuna,
  guerraDeTerritorios: IconeGuerraDeTerritorios,
  imunidade: IconeImunidade,
  intocavel: IconeIntocavel,
  mercador: IconeMercador,
  minhasRegrasMeuJogo: IconeMinhasRegrasMeuJogo,
  nadaMePara: IconeNadaMePara,
  noEmbalo: IconeNoEmbalo,
  oPrimeiroPasso: IconeOPrimeiroPasso,
  overkill: IconeOverkill,
  paredeDeFerro: IconeParedeDeFerro,
  pequenaFortuna: IconePequenaFortuna,
  porUmFio: IconePorUmFio,
  precisaoCirurgica: IconePrecisaoCirurgica,
  preparadoParaABatalha: IconePreparadoParaABatalha,
  primeiraCompra: IconePrimeiraCompra,
  refugio: IconeRefugio,
  regeneracaoAbsoluta: IconeRegeneracaoAbsoluta,
  saqueador: IconeSaqueador,
  segundoFolego: IconeSegundoFolego,
  sobACoroa: IconeSobACoroa,
  solo: IconeSolo,
  superacaoDeVida: IconeSuperacaoDeVida,
  turnoPerfeito: IconeTurnoPerfeito,
  variedade: IconeVariedade,
} as const;

export type NomeIcone = keyof typeof icones;

interface IconeProps extends ComponentProps<"svg"> {
  nome: NomeIcone;
  tamanho?: number | string;
}

export function Icone({
  nome,
  tamanho = 24,
  className = "",
  ...props
}: IconeProps) {
  const IconeSelecionado = icones[nome];

  return (
    <IconeSelecionado
      className={className}
      width={tamanho}
      height={tamanho}
      {...props}
    />
  );
}
