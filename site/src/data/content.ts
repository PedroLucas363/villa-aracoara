import images from "./images.json";

export type ImageName = keyof typeof images;

export type Photo = { name: ImageName; alt: string };

const BASE = import.meta.env.BASE_URL;

export function imgSrc(name: ImageName, maxWidth = 1280) {
  const { sizes } = images[name];
  const w = sizes.find((s) => s >= maxWidth) ?? sizes[sizes.length - 1];
  return `${BASE}img/${name}-${w}.webp`;
}

export function imgSrcSet(name: ImageName) {
  return images[name].sizes.map((w) => `${BASE}img/${name}-${w}.webp ${w}w`).join(", ");
}

export function imgRatio(name: ImageName) {
  const { w, h } = images[name];
  return w / h;
}

export const SUITE_ID = {
  SOL: "sol",
  LUA: "lua",
  MAR: "mar",
  CEU: "ceu",
} as const;

export type SuiteId = (typeof SUITE_ID)[keyof typeof SUITE_ID];

export type Suite = {
  id: SuiteId;
  name: string;
  element: string;
  color: string;
  summary: string;
  detail: string;
  cover: ImageName;
  photos: Photo[];
};

export const SUITES: Record<SuiteId, Suite> = {
  [SUITE_ID.SOL]: {
    id: SUITE_ID.SOL,
    name: "Suíte Sol",
    element: "O macramê terracota",
    color: "var(--color-sol)",
    summary: "Ampla, com cama de casal e camas de solteiro, para quem viaja em família ou entre amigos.",
    detail: "A varanda dá para a piscina e para o jardim, entre os coqueiros.",
    cover: "sol-2",
    photos: [
      { name: "sol-2", alt: "Suíte Sol com cama de casal, cama de solteiro e macramê terracota na parede" },
      { name: "sol-macrame", alt: "Detalhe do macramê em tons de terracota sobre a cabeceira" },
      { name: "sol-3", alt: "Camas arrumadas com almofadas de crochê e painel de palha" },
      { name: "sol-vista", alt: "Vista da varanda da Suíte Sol para a piscina entre coqueiros" },
      { name: "sol-varanda", alt: "Portas de madeira abertas para a varanda com guarda-corpo de madeira" },
      { name: "sol-4", alt: "Cama com vista para a janela e os coqueiros" },
      { name: "sol-banho", alt: "Banheiro com espelho de macramê, pia de cerâmica e plantas" },
      { name: "sol-1", alt: "Suíte Sol vista do canto, com escultura de folhas em madeira" },
    ],
  },
  [SUITE_ID.LUA]: {
    id: SUITE_ID.LUA,
    name: "Suíte Lua",
    element: "As fases da lua em madeira",
    color: "var(--color-lua)",
    summary: "As fases da lua entalhadas em madeira escura formam a cabeceira da cama de casal.",
    detail: "Da varanda com rede, a vista desce pelas folhas do coqueiro até a piscina.",
    cover: "lua-2",
    photos: [
      { name: "lua-2", alt: "Suíte Lua com cabeceira das fases da lua e porta aberta para a varanda com rede" },
      { name: "lua-varanda", alt: "Folhas de coqueiro sobre a piscina vistas da varanda da Suíte Lua" },
      { name: "lua-3", alt: "Cama de casal com luminária de madeira acesa" },
      { name: "lua-fases", alt: "Detalhe da cabeceira com as fases da lua em madeira" },
      { name: "lua-4", alt: "Mesa de madeira, frigobar e porta para a varanda" },
      { name: "lua-banho", alt: "Banheiro com espelho redondo de macramê e escada de toalhas" },
    ],
  },
  [SUITE_ID.MAR]: {
    id: SUITE_ID.MAR,
    name: "Suíte Mar",
    element: "O macramê em degradê de azul",
    color: "var(--color-mar)",
    summary: "Um macramê em degradê de azul desce sobre a cama como uma onda, com colcha índigo.",
    detail: "Na varanda, uma rede com franjas fica pendurada entre as folhas dos coqueiros.",
    cover: "mar-3",
    photos: [
      { name: "mar-3", alt: "Suíte Mar com macramê azul, colcha índigo e porta aberta para a varanda com rede" },
      { name: "mar-1", alt: "Cama com colcha índigo e almofadas azuis sob o macramê" },
      { name: "mar-onda", alt: "Detalhe do macramê em degradê de azul e branco sobre a cama" },
      { name: "mar-rede-2", alt: "Rede de varanda com franjas entre folhas de coqueiro" },
      { name: "mar-rede", alt: "Rede na varanda vista de dentro da suíte" },
      { name: "mar-2", alt: "Suíte Mar com televisão, mesa de madeira e portas para a varanda" },
      { name: "mar-banho", alt: "Banheiro com pia de cerâmica, espelho de macramê e plantas" },
    ],
  },
  [SUITE_ID.CEU]: {
    id: SUITE_ID.CEU,
    name: "Suíte Céu",
    element: "O forro de madeira",
    color: "var(--color-ceu)",
    summary: "No andar de cima, sob o forro de madeira com vigas aparentes e manta verde sobre a cama.",
    detail: "As janelas de veneziana se abrem para o coqueiral, para o mar e para o pôr do sol.",
    cover: "ceu-3",
    photos: [
      { name: "ceu-3", alt: "Suíte Céu com forro de madeira, vigas escuras e manta verde sobre a cama" },
      { name: "ceu-janela", alt: "Janela de veneziana aberta para coqueiros e o mar" },
      { name: "ceu-por-do-sol", alt: "Pôr do sol emoldurado pela janela da Suíte Céu" },
      { name: "ceu-2", alt: "Cama com manta verde e janela para os coqueiros" },
      { name: "ceu-4", alt: "Escrivaninha de madeira sob a janela" },
      { name: "ceu-5", alt: "Suíte Céu vista do canto, com banco de madeira junto à janela" },
      { name: "ceu-1", alt: "Suíte Céu com prateleiras de madeira e janela" },
    ],
  },
};

export const SUITE_LIST = Object.values(SUITES);

export const CASA_PHOTOS: Photo[] = [
  { name: "piscina", alt: "Piscina de água azul com espreguiçadeiras e coqueiros" },
  { name: "casa-reflexo", alt: "A casa refletida na piscina, com pergolado de palha e varandas" },
  { name: "lounge", alt: "Sala aberta com sofá de fibra, almofadas e luz entrando pela varanda" },
  { name: "deck", alt: "Deck da piscina com espreguiçadeiras ao entardecer" },
  { name: "casa-piscina", alt: "Fachada branca da pousada com piscina e coqueiros" },
  { name: "casa-jardim", alt: "Jardim gramado ao lado da casa, com pergolado de madeira" },
  { name: "casa-coqueiros", alt: "A casa vista da rua, entre dois coqueiros" },
];

export const CAFE_PHOTOS: Photo[] = [
  { name: "cafe-varanda", alt: "Mesa do café da manhã na varanda, com a piscina ao fundo" },
  { name: "cafe-mesa", alt: "Mesa posta com bolo, pão de casca grossa, frutas e flores" },
  { name: "cafe-buffet", alt: "Bancada do café com frutas cortadas, pães, queijos e geleias" },
];

export const NAV = [
  { href: "#suites", label: "Suítes" },
  { href: "#casa", label: "A casa" },
  { href: "#cafe", label: "Café" },
  { href: "#arredores", label: "Arredores" },
] as const;

export const ADDRESS = "Rua Maria das Graças, s/n · Praia do Preá · Cruz, Ceará";
