import { ComponentProps } from "react";
import Image from "next/image";

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
import IconeCopia from "@/assets/conquistas/copia.svg";
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

import PixelAlchemist from "@/assets/pixel_arts/alchemist.png";
import PixelAssassin from "@/assets/pixel_arts/assassin.png";
import PixelAttackInjection from "@/assets/pixel_arts/attack-injection.png";
import PixelDefenseInjection from "@/assets/pixel_arts/defense-injection.png";
import PixelDevouringOrb from "@/assets/pixel_arts/devouring-orb.png";
import PixelDragonKnight from "@/assets/pixel_arts/dragon-knight.png";
import PixelFieryField from "@/assets/pixel_arts/fiery-field.png";
import PixelFocusLens from "@/assets/pixel_arts/focus-lens.png";
import PixelFoggyValley from "@/assets/pixel_arts/foggy-valley.png";
import PixelForestGlade from "@/assets/pixel_arts/forest-glade.png";
import PixelHealInjection from "@/assets/pixel_arts/heal-injection.png";
import PixelKingsBlessing from "@/assets/pixel_arts/kings-blessing.png";
import PixelLifeDrainingFlower from "@/assets/pixel_arts/life-draining-flower.png";
import PixelMagicApprentice from "@/assets/pixel_arts/magic-apprentice.png";
import PixelMagicMaster from "@/assets/pixel_arts/magic-master.png";
import PixelQueensBlessing from "@/assets/pixel_arts/queens-blessing.png";
import PixelReaper from "@/assets/pixel_arts/reaper.png";
import PixelResearchersHelp from "@/assets/pixel_arts/researchers-help.png";
import PixelRigidShell from "@/assets/pixel_arts/rigid-shell.png";
import PixelRockyHills from "@/assets/pixel_arts/rocky-hills.png";
import PixelSharpClaws from "@/assets/pixel_arts/sharp-claws.png";
import PixelSmokescreen from "@/assets/pixel_arts/smokescreen.png";
import PixelSwordApprentice from "@/assets/pixel_arts/sword-apprentice.jpeg";
import PixelSwordLegend from "@/assets/pixel_arts/sword-legend.png";
import PixelSwordMaster from "@/assets/pixel_arts/sword-master.png";
import PixelThief from "@/assets/pixel_arts/thief.png";
import PixelTidalSeas from "@/assets/pixel_arts/tidal-seas.png";
import PixelToxicSwamp from "@/assets/pixel_arts/toxic-swamp.png";

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

  aflordavida: IconeAFlorDaVida,
  agrandevirada: IconeAGrandeVirada,
  acumulador: IconeAcumulador,
  ataquenoescuro: IconeAtaqueNoEscuro,
  atravesdanevoa: IconeAtravesDaNevoa,
  autosabotagem: IconeAutoSabotagem,
  autonomo: IconeAutonomo,
  calmaantesdatempestade: IconeCalmaAntesDaTempestade,
  caminhodamaestria: IconeCaminhoDaMaestria,
  campoperfeito: IconeCampoPerfeito,
  colecionadordestatus: IconeColecionadorDeStatus,
  contraasprobabilidades: IconeContraAsProbabilidades,
  contraataqueperfeito: IconeContraAtaquePerfeito,
  copia: IconeCopia,
  deckcompleto: IconeDeckCompleto,
  derrubandoalenda: IconeDerrubandoALenda,
  desperdicio: IconeDesperdicio,
  espadachimsupremo: IconeEspadachimSupremo,
  espionagem: IconeEspionagem,
  feiticocontraofeiticeiro: IconeFeiticoContraOFeiticeiro,
  fortuna: IconeFortuna,
  guerradeterritorios: IconeGuerraDeTerritorios,
  imunidade: IconeImunidade,
  intocavel: IconeIntocavel,
  mercador: IconeMercador,
  minhasregrasmeujogo: IconeMinhasRegrasMeuJogo,
  nadamepara: IconeNadaMePara,
  noembalo: IconeNoEmbalo,
  oprimeiropasso: IconeOPrimeiroPasso,
  overkill: IconeOverkill,
  parededeferro: IconeParedeDeFerro,
  pequenafortuna: IconePequenaFortuna,
  porumfio: IconePorUmFio,
  precisaocirurgica: IconePrecisaoCirurgica,
  preparadoparaabatalha: IconePreparadoParaABatalha,
  primeiracompra: IconePrimeiraCompra,
  refugio: IconeRefugio,
  regeneracaoabsoluta: IconeRegeneracaoAbsoluta,
  saqueador: IconeSaqueador,
  segundofolego: IconeSegundoFolego,
  sobacoroa: IconeSobACoroa,
  solo: IconeSolo,
  superacaodevida: IconeSuperacaoDeVida,
  turnoperfeito: IconeTurnoPerfeito,
  variedade: IconeVariedade,
} as const;

export type NomeIcone = keyof typeof icones;

const pixelArts = {
    alchemist: PixelAlchemist,
    assassin: PixelAssassin,
    attackInjection: PixelAttackInjection,
    defenseInjection: PixelDefenseInjection,
    devouringOrb: PixelDevouringOrb,
    dragonKnight: PixelDragonKnight,
    fieryField: PixelFieryField,
    focusLens: PixelFocusLens,
    foggyValley: PixelFoggyValley,
    forestGlade: PixelForestGlade,
    healInjection: PixelHealInjection,
    kingsBlessing: PixelKingsBlessing,
    lifeDrainingFlower: PixelLifeDrainingFlower,
    magicApprentice: PixelMagicApprentice,
    magicMaster: PixelMagicMaster,
    queensBlessing: PixelQueensBlessing,
    reaper: PixelReaper,
    researchersHelp: PixelResearchersHelp,
    rigidShell: PixelRigidShell,
    rockyHills: PixelRockyHills,
    sharpClaws: PixelSharpClaws,
    smokescreen: PixelSmokescreen,
    swordApprentice: PixelSwordApprentice,
    swordLegend: PixelSwordLegend,
    swordMaster: PixelSwordMaster,
    thief: PixelThief,
    tidalSeas: PixelTidalSeas,
    toxicSwamp: PixelToxicSwamp
} as const;

export type NomePixelArt = keyof typeof pixelArts;

interface IconeProps extends ComponentProps<"svg"> {
  nome: NomeIcone;
  tamanho?: number | string;
}

interface PixelArtProps extends Omit<ComponentProps<typeof Image>, "src" | "alt" | "width" | "height"> {
    nome: NomePixelArt;
    tamanho?: number | string;
}

export function Icone({
  nome,
  tamanho = 24,
  className = "",
  ...props
}: IconeProps) {
  const IconeSelecionado = icones[nome];

  if (!IconeSelecionado) {
    console.warn(`[Icone] Ícone não encontrado para a chave: "${nome}"`);
    return null;
  }

  return (
    <IconeSelecionado
      className={className}
      width={tamanho}
      height={tamanho}
      {...props}
    />
  );
}

export function PixelArt({
    nome,
    tamanho = 100,
    className = "",
    style,
    ...props
}: PixelArtProps) {
    const ImagemSelecionada = pixelArts[nome];

    return (
        <Image
            src={ImagemSelecionada}
            alt={nome}
            width={ImagemSelecionada.width}
            height={ImagemSelecionada.height}
            className={className}
            unoptimized
            style={{
                width: tamanho,
                height: tamanho,
                imageRendering: "pixelated",
                ...style
            }}
            {...props}
        />
    );
}

export function acharNomePixelArt(nome: string): NomePixelArt {
    const nomeFormatado = nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .trim()
        .split(/\s+/)
        .map((palavra, indice) =>
            indice === 0
                ? palavra
                : palavra.charAt(0).toUpperCase() + palavra.slice(1)
        )
        .join("");

    if (!Object.prototype.hasOwnProperty.call(pixelArts, nomeFormatado)) {
        throw new Error(`Pixel Art não encontrado para: "${nome}"`);
    }

    return nomeFormatado as NomePixelArt;
}