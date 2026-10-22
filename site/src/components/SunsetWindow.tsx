import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { imgSrc, imgSrcSet } from "../data/content";
import { useMediaQuery } from "../lib/scroll";

/**
 * Sequência presa à rolagem: as venezianas da Suíte Céu se abrem, a janela cresce até ocupar a tela
 * e o pôr do sol assume a cena.
 */
export function SunsetWindow() {
  const reduce = useReducedMotion();
  if (reduce) return <StaticSunset />;
  return <AnimatedSunset />;
}

function AnimatedSunset() {
  const ref = useRef<HTMLElement>(null);
  const small = useMediaQuery("(max-width: 767px)");
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const opening = small ? { t: 30, x: 12 } : { t: 25, x: 33 };
  const clipPath = useTransform(p, [0.3, 0.82], [
    `inset(${opening.t}% ${opening.x}% ${opening.t}% ${opening.x}%)`,
    "inset(0% 0% 0% 0%)",
  ]);
  const imgScale = useTransform(p, [0, 0.9], [1.45, 1]);
  const leftDoor = useTransform(p, [0.04, 0.32], [0, -112]);
  const rightDoor = useTransform(p, [0.04, 0.32], [0, 112]);
  const doorsOpacity = useTransform(p, [0.24, 0.34], [1, 0]);
  const introOpacity = useTransform(p, [0, 0.2, 0.34], [1, 1, 0]);
  const introY = useTransform(p, [0, 0.34], [0, -40]);
  const outroOpacity = useTransform(p, [0.72, 0.88], [0, 1]);
  const outroY = useTransform(p, [0.72, 0.9], [40, 0]);

  return (
    <section ref={ref} aria-labelledby="janela-titulo" className="relative h-[240vh] bg-[#140d09] md:h-[280vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,#3a2216_0%,#1b110b_60%,#0f0a07_100%)]" />

        <motion.div className="grain absolute inset-0" style={{ clipPath }}>
          <motion.img
            src={imgSrc("ceu-por-do-sol", 1080)}
            srcSet={imgSrcSet("ceu-por-do-sol")}
            sizes="100vw"
            alt="Pôr do sol sobre o coqueiral, emoldurado pela janela da Suíte Céu"
            loading="lazy"
            className="h-full w-full object-cover object-[50%_42%]"
            style={{ scale: imgScale }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(15,10,7,0.75)_100%)]" />
        </motion.div>

        {/* venezianas: cobrem a abertura inicial e giram para fora */}
        <motion.div
          aria-hidden="true"
          className="absolute [perspective:1400px]"
          style={{
            top: `${opening.t}%`,
            bottom: `${opening.t}%`,
            left: `${opening.x}%`,
            right: `${opening.x}%`,
            opacity: doorsOpacity,
          }}
        >
          <motion.div className="louvers absolute inset-y-0 left-0 w-1/2 origin-left" style={{ rotateY: leftDoor }} />
          <motion.div className="louvers absolute inset-y-0 right-0 w-1/2 origin-right" style={{ rotateY: rightDoor }} />
        </motion.div>

        <motion.div
          className="gutter absolute inset-x-0 top-[9%] text-center md:top-[8%]"
          style={{ opacity: introOpacity, y: introY }}
        >
          <p className="eyebrow text-[#e7c9a6]/80">Suíte Céu · andar de cima</p>
          <h2 id="janela-titulo" className="display mx-auto mt-4 max-w-3xl text-[clamp(1.8rem,4vw,3.4rem)] text-cal">
            Abra a janela
          </h2>
        </motion.div>
        <motion.p
          className="eyebrow gutter absolute inset-x-0 bottom-[9%] text-center text-cal/60 md:bottom-[8%]"
          style={{ opacity: introOpacity }}
        >
          Continue rolando
        </motion.p>

        <motion.div
          className="gutter absolute inset-x-0 bottom-[10%] mx-auto max-w-[1600px]"
          style={{ opacity: outroOpacity, y: outroY }}
        >
          <p className="display max-w-4xl text-[clamp(2.2rem,6vw,5.6rem)] leading-[1] text-cal">
            O dia termina <em className="italic">sobre o coqueiral</em>
          </p>
          <p className="mt-6 max-w-md text-cal/80">
            Da janela de veneziana da Suíte Céu, o sol se põe atrás das palmeiras e o céu muda de cor a cada minuto.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function StaticSunset() {
  return (
    <section aria-labelledby="janela-titulo" className="relative overflow-hidden bg-[#140d09]">
      <img
        src={imgSrc("ceu-por-do-sol", 1080)}
        srcSet={imgSrcSet("ceu-por-do-sol")}
        sizes="100vw"
        alt="Pôr do sol sobre o coqueiral, emoldurado pela janela da Suíte Céu"
        loading="lazy"
        className="h-[80svh] w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(15,10,7,0.8)_100%)]" />
      <div className="gutter absolute inset-x-0 bottom-[10%] mx-auto max-w-[1600px]">
        <p className="eyebrow text-[#e7c9a6]/80">Suíte Céu · andar de cima</p>
        <h2 id="janela-titulo" className="display mt-4 max-w-4xl text-[clamp(2.2rem,6vw,5.6rem)] leading-[1] text-cal">
          O dia termina <em className="italic">sobre o coqueiral</em>
        </h2>
      </div>
    </section>
  );
}
