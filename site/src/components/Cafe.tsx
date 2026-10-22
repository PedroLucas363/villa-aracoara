import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CAFE_PHOTOS } from "../data/content";
import { useMediaQuery } from "../lib/scroll";
import { useOpenGallery } from "./Lightbox";
import { EASE, FadeUp, ImageReveal, LineReveal } from "./motion";

const MENU = ["Pão de casca grossa", "Frutas cortadas na hora", "Bolo caseiro", "Queijos e frios", "Sucos e café"] as const;

/** Café da manhã: composição em camadas, cada foto com velocidade de rolagem diferente. */
export function Cafe() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const small = useMediaQuery("(max-width: 1023px)");
  const openGallery = useOpenGallery();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const still = reduce || small;
  const ySlow = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [60, -60]);
  const yFast = useTransform(scrollYProgress, [0, 1], still ? [0, 0] : [180, -160]);
  const wordX = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["8%", "-22%"]);

  const photo = (i: number) => ({
    type: "button" as const,
    "data-cursor": "Ampliar",
    onClick: () => openGallery("Café da manhã", CAFE_PHOTOS, i),
    "aria-label": `Ampliar: ${CAFE_PHOTOS[i].alt}`,
  });

  return (
    <section ref={ref} id="cafe" aria-labelledby="cafe-titulo" className="on-light relative overflow-hidden bg-cal text-tinta">
      {/* palavra gigante que desliza na horizontal com a rolagem */}
      <motion.p
        aria-hidden="true"
        className="display pointer-events-none absolute left-0 top-10 whitespace-nowrap text-[clamp(7rem,22vw,22rem)] italic leading-none text-tinta/[0.05] md:top-16"
        style={{ x: wordX }}
      >
        bom dia, bom dia
      </motion.p>

      <div className="gutter relative mx-auto grid max-w-[1600px] gap-14 py-24 md:py-40 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4 lg:pt-24">
          <FadeUp>
            <p className="eyebrow mb-8 flex items-center gap-4 text-tinta-suave">
              <span className="block h-px w-10 bg-current" aria-hidden="true" />O café da manhã
            </p>
          </FadeUp>
          <LineReveal
            className="display text-[clamp(2.4rem,5vw,4.6rem)]"
            lines={[<span id="cafe-titulo">Mesa posta</span>, <em className="italic">na varanda</em>]}
          />
          <FadeUp delay={0.15} className="mt-8 max-w-sm text-tinta-suave">
            Servido de frente para a piscina, com o que a cozinha prepara no dia. É um dos pontos mais elogiados por quem
            se hospeda aqui.
          </FadeUp>
          <ul className="mt-10 flex flex-wrap gap-2">
            {MENU.map((item, i) => (
              <motion.li
                key={item}
                className="rounded-full border border-tinta/20 px-4 py-2 text-sm"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.06 }}
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="relative grid grid-cols-6 gap-3 md:gap-4 lg:col-span-8">
          <motion.button {...photo(0)} className="zoom-host relative col-span-6 block aspect-[4/3] overflow-hidden md:col-span-4 md:col-start-2" style={{ y: ySlow }}>
            <ImageReveal name="cafe-varanda" alt="" direction="up" parallax={6} sizes="(min-width: 1024px) 45vw, 100vw" className="absolute inset-0" />
          </motion.button>
          <motion.button
            {...photo(1)}
            className="zoom-host relative col-span-3 block aspect-square overflow-hidden ring-[10px] ring-cal md:col-span-2 md:col-start-1 md:-mt-40"
            style={{ y: yFast }}
          >
            <ImageReveal name="cafe-mesa" alt="" direction="left" delay={0.15} sizes="(min-width: 1024px) 20vw, 50vw" className="absolute inset-0" />
          </motion.button>
          <motion.button
            {...photo(2)}
            className="zoom-host relative col-span-3 block aspect-[4/5] overflow-hidden md:col-span-2 md:col-start-5 md:-mt-24"
            style={{ y: ySlow }}
          >
            <ImageReveal name="cafe-buffet" alt="" direction="down" delay={0.25} sizes="(min-width: 1024px) 20vw, 50vw" className="absolute inset-0" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
