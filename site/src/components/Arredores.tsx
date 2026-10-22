import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { imgSrc, imgSrcSet, type ImageName } from "../data/content";
import { useMediaQuery } from "../lib/scroll";
import { FadeUp, LineReveal } from "./motion";

const VISUAL = { WIND: "wind", PHOTO: "photo", TYPE: "type", WATER: "water" } as const;
type Visual = (typeof VISUAL)[keyof typeof VISUAL];

type Place = { id: string; title: string; kicker: string; text: string; visual: Visual; image?: ImageName; alt?: string };

const PLACES: Place[] = [
  {
    id: "vento",
    title: "Vento",
    kicker: "Kitesurf no Preá",
    text: "O Preá é um dos destinos de kitesurf mais procurados do mundo, com vento forte e constante, principalmente no segundo semestre. Escolas e aluguel de equipamento ficam na própria praia.",
    visual: VISUAL.WIND,
  },
  {
    id: "dunas",
    title: "Dunas",
    kicker: "De quadriciclo ou buggy",
    text: "Passeios pela areia e pela beira-mar até Jericoacoara, com paradas nos mirantes.",
    visual: VISUAL.PHOTO,
    image: "quadriciclo",
    alt: "Quadriciclo vermelho nas dunas do Preá, sob céu com nuvens",
  },
  {
    id: "jeri",
    title: "Jericoacoara",
    kicker: "A vila vizinha",
    text: "A Pedra Furada, a Duna do Pôr do Sol e as ruas de areia da vila ficam a uma curta viagem pela praia.",
    visual: VISUAL.TYPE,
  },
  {
    id: "lagoas",
    title: "Lagoas",
    kicker: "Paraíso e Lagoa Azul",
    text: "Água doce, morna e transparente, com redes armadas dentro da lagoa.",
    visual: VISUAL.WATER,
  },
  {
    id: "volta",
    title: "De volta",
    kicker: "À noite, na varanda",
    text: "Depois do passeio, a rede da varanda e o barulho das folhas do coqueiro.",
    visual: VISUAL.PHOTO,
    image: "mar-rede-2",
    alt: "Rede de varanda com franjas entre folhas de coqueiro",
  },
];

export function Arredores() {
  const reduce = useReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  return wide && !reduce ? <PinnedTrack /> : <SwipeTrack />;
}

function Heading() {
  return (
    <div className="flex flex-col gap-8">
      <FadeUp>
        <p className="eyebrow flex items-center gap-4 text-cal/65">
          <span className="block h-px w-10 bg-current" aria-hidden="true" />
          Arredores
        </p>
      </FadeUp>
      <LineReveal
        className="display text-[clamp(2.6rem,5.4vw,5.2rem)] text-cal"
        lines={[<span id="arredores-titulo">O Preá</span>, <em className="italic text-piscina">e além</em>]}
      />
      <FadeUp delay={0.15} className="max-w-sm text-cal/75">
        A pousada fica na Praia do Preá, em Cruz, perto do Aeroporto de Jericoacoara. Dali saem os passeios pela região.
      </FadeUp>
    </div>
  );
}

/** Desktop: a seção fica presa e a rolagem vertical move a trilha na horizontal. */
function PinnedTrack() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useLayoutEffect(() => {
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      ref={section}
      id="arredores"
      aria-labelledby="arredores-titulo"
      className="relative bg-noite"
      style={{ height: `calc(100svh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <motion.div ref={track} className="flex w-max items-stretch gap-6 pl-[max(72px,env(safe-area-inset-left))] pr-[12vw]" style={{ x }}>
          <div className="flex w-[34vw] shrink-0 flex-col justify-center pr-[4vw]">
            <Heading />
          </div>
          {PLACES.map((p, i) => (
            <PlacePanel key={p.id} place={p} index={i} progress={scrollYProgress} className="h-[68svh] w-[30vw] min-w-[340px]" />
          ))}
        </motion.div>
        <div className="gutter absolute inset-x-0 bottom-8">
          <div className="mx-auto h-px max-w-[1600px] bg-cal/15">
            <motion.div className="h-full origin-left bg-piscina" style={{ scaleX: bar }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Celular, tablet e movimento reduzido: trilha com rolagem lateral nativa e encaixe. */
function SwipeTrack() {
  return (
    <section id="arredores" aria-labelledby="arredores-titulo" className="bg-noite py-24 md:py-32">
      <div className="gutter mx-auto max-w-[1600px]">
        <Heading />
      </div>
      <div
        className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 pl-[max(16px,env(safe-area-inset-left))] pr-[max(16px,env(safe-area-inset-right))] [scrollbar-width:thin] md:pl-10"
        role="region"
        aria-label="Passeios na região"
        tabIndex={0}
      >
        {PLACES.map((p, i) => (
          <PlacePanel key={p.id} place={p} index={i} className="h-[30rem] w-[82vw] max-w-[420px] shrink-0 snap-start" />
        ))}
      </div>
    </section>
  );
}

function PlacePanel({
  place,
  index,
  progress,
  className,
}: {
  place: Place;
  index: number;
  progress?: MotionValue<number>;
  className: string;
}) {
  const still = useMotionValue(0);
  const shift = useTransform(progress ?? still, [0, 1], ["-8%", "8%"]);
  return (
    <article className={`relative flex flex-col overflow-hidden bg-noite-2 text-cal ${className}`} aria-labelledby={`lugar-${place.id}`}>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <PanelVisual place={place} shift={progress ? shift : undefined} />
        <span className="eyebrow absolute left-5 top-5 text-[0.66rem] text-cal/70">{place.kicker}</span>
      </div>
      <div className="flex flex-col gap-3 p-5 md:p-6">
        <h3 id={`lugar-${place.id}`} className="display text-[2rem] leading-none">
          {place.title}
        </h3>
        <p className="text-[0.95rem] leading-snug text-cal/75">{place.text}</p>
      </div>
      <span className="sr-only">Destino {index + 1} de {PLACES.length}</span>
    </article>
  );
}

function PanelVisual({ place, shift }: { place: Place; shift?: MotionValue<string> }) {
  switch (place.visual) {
    case VISUAL.PHOTO:
      return (
        <motion.img
          src={imgSrc(place.image!, 640)}
          srcSet={imgSrcSet(place.image!)}
          sizes="(min-width: 1024px) 30vw, 82vw"
          alt={place.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full scale-[1.18] object-cover"
          style={shift ? { x: shift } : undefined}
        />
      );
    case VISUAL.WIND:
      return <WindLines />;
    case VISUAL.WATER:
      return (
        <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(90%_70%_at_50%_60%,#7fd3cb_0%,#2f9a96_45%,#14504f_100%)]" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="ripple absolute left-1/2 top-[58%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cal/50"
              style={{ animationDelay: `${i * 1.3}s` }}
            />
          ))}
        </div>
      );
    case VISUAL.TYPE:
      return (
        <div className="absolute inset-0 flex items-end bg-[linear-gradient(180deg,#f1b47a_0%,#d9774c_45%,#5b3220_100%)] p-5" aria-hidden="true">
          <span className="sun absolute left-1/2 top-[30%] h-28 w-28 -translate-x-1/2 rounded-full bg-[#ffe2b8]" />
          <motion.span className="display relative text-[clamp(4rem,7vw,7rem)] italic leading-[0.8] text-noite/85" style={shift ? { x: shift } : undefined}>
            Jeri
          </motion.span>
        </div>
      );
  }
}

/** Linhas de vento desenhadas em SVG, com traço animado. */
function WindLines() {
  const paths = [
    "M-20 60 C 80 30, 160 90, 260 60 S 420 30, 520 70",
    "M-20 120 C 60 100, 180 150, 280 115 S 440 90, 520 130",
    "M-20 180 C 100 160, 200 210, 300 175 S 450 150, 520 190",
    "M-20 240 C 70 220, 190 270, 290 235 S 430 210, 520 250",
  ];
  return (
    <div className="absolute inset-0 bg-[linear-gradient(160deg,#173229_0%,#0f221c_100%)]" aria-hidden="true">
      <svg viewBox="0 0 500 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="#8fd6cc"
            strokeOpacity={0.35 + i * 0.12}
            strokeWidth={1.2}
            strokeLinecap="round"
            className="wind-line"
            style={{ animationDelay: `${i * -1.1}s` }}
          />
        ))}
      </svg>
      <svg viewBox="0 0 120 120" className="kite absolute right-[18%] top-[16%] h-20 w-20">
        <path d="M10 70 Q 60 0 110 70" fill="none" stroke="#eeede6" strokeWidth="9" strokeLinecap="round" />
        <path d="M14 72 L 60 118 M106 72 L 60 118" stroke="#eeede6" strokeOpacity="0.5" strokeWidth="1" />
      </svg>
    </div>
  );
}
