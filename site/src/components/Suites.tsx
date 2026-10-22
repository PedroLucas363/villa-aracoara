import { motion, useReducedMotion } from "motion/react";
import { imgSrc, imgSrcSet, SUITES, SUITE_ID, type ImageName, type Suite } from "../data/content";
import { useOpenGallery } from "./Lightbox";
import { EASE, EASE_IN_OUT, FadeUp, LineReveal, type RevealDirection } from "./motion";

const CLIP_FROM: Record<RevealDirection, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  center: "inset(20% 20% 20% 20%)",
};

/** Bento editorial: cada suíte com proporção própria, intercalada com detalhes e uma nota. */
export function Suites() {
  return (
    <section id="suites" aria-labelledby="suites-titulo" className="on-light bg-cal text-tinta">
      <div className="gutter mx-auto max-w-[1600px] pb-24 pt-16 md:pb-36 md:pt-28">
        <div className="mb-14 grid gap-8 md:mb-20 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <FadeUp>
              <p className="eyebrow mb-8 flex items-center gap-4 text-tinta-suave">
                <span className="block h-px w-10 bg-current" aria-hidden="true" />
                As suítes
              </p>
            </FadeUp>
            <LineReveal
              className="display text-[clamp(2.6rem,6.6vw,6.2rem)]"
              lines={[
                <span id="suites-titulo">Sol, Lua,</span>,
                <>
                  Mar <em className="italic">e</em> Céu
                </>,
              ]}
            />
          </div>
          <FadeUp delay={0.2} className="max-w-md text-[1.05rem] text-tinta-suave lg:col-span-4 lg:col-start-9 lg:pb-3">
            Quatro suítes, cada uma com uma peça que dá o tom ao quarto: um macramê feito à mão, a madeira entalhada ou o
            forro do andar de cima. Toque em uma suíte para ver as fotos.
          </FadeUp>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-12 lg:[grid-auto-rows:clamp(150px,12.5vw,230px)]">
          <SuiteCard
            suite={SUITES[SUITE_ID.SOL]}
            direction="up"
            className="col-span-2 aspect-[4/5] sm:aspect-[16/11] lg:col-[1/8] lg:row-[1/4] lg:aspect-auto"
            sizes="(min-width: 1024px) 58vw, 100vw"
          />
          <SuiteCard
            suite={SUITES[SUITE_ID.LUA]}
            direction="left"
            delay={0.1}
            className="col-span-2 aspect-[4/5] sm:aspect-[16/11] lg:col-[8/13] lg:row-[1/3] lg:aspect-auto"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
          <DetailTile
            suite={SUITES[SUITE_ID.LUA]}
            image="lua-fases"
            caption="Fases da lua em madeira"
            direction="center"
            className="aspect-square lg:col-[8/10] lg:row-[3/4] lg:aspect-auto"
          />
          <NoteTile className="aspect-square lg:col-[10/13] lg:row-[3/4] lg:aspect-auto" />
          <SuiteCard
            suite={SUITES[SUITE_ID.MAR]}
            direction="right"
            className="col-span-2 aspect-[4/5] sm:aspect-[16/11] lg:col-[1/6] lg:row-[4/7] lg:aspect-auto"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
          <SuiteCard
            suite={SUITES[SUITE_ID.CEU]}
            direction="down"
            delay={0.1}
            className="col-span-2 aspect-[4/5] sm:aspect-[16/11] lg:col-[6/13] lg:row-[4/6] lg:aspect-auto"
            sizes="(min-width: 1024px) 58vw, 100vw"
          />
          <DetailTile
            suite={SUITES[SUITE_ID.CEU]}
            image="ceu-janela"
            caption="A janela da Suíte Céu"
            direction="up"
            className="aspect-square lg:col-[6/9] lg:row-[6/7] lg:aspect-auto"
          />
          <DetailTile
            suite={SUITES[SUITE_ID.MAR]}
            image="mar-onda"
            caption="O macramê da Suíte Mar"
            direction="left"
            delay={0.1}
            className="aspect-square lg:col-[9/13] lg:row-[6/7] lg:aspect-auto"
          />
        </div>
      </div>
    </section>
  );
}

function RevealFrame({
  direction,
  delay = 0,
  className,
  children,
}: {
  direction: RevealDirection;
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  // observa o wrapper (sem clip-path) e propaga o estado para a máscara e a foto por variants
  return (
    <motion.div className={className} initial={reduce ? false : "hide"} whileInView="show" viewport={{ once: true, amount: 0.15 }}>
      <motion.div
        className="absolute inset-0"
        variants={{
          hide: { clipPath: CLIP_FROM[direction] },
          show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.4, ease: EASE_IN_OUT, delay } },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function CardImage({ name, alt, sizes }: { name: ImageName; alt: string; sizes: string }) {
  return (
    <div className="zoom-img absolute inset-0">
      <motion.img
        src={imgSrc(name)}
        srcSet={imgSrcSet(name)}
        sizes={sizes}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        variants={{ hide: { scale: 1.18 }, show: { scale: 1, transition: { duration: 1.9, ease: EASE } } }}
      />
    </div>
  );
}

function SuiteCard({
  suite,
  direction,
  delay,
  className,
  sizes,
}: {
  suite: Suite;
  direction: RevealDirection;
  delay?: number;
  className: string;
  sizes: string;
}) {
  const openGallery = useOpenGallery();
  const cover = suite.photos[0];
  return (
    <RevealFrame direction={direction} delay={delay} className={`relative min-w-0 overflow-hidden ${className}`}>
      <button
        type="button"
        data-cursor="Ver fotos"
        onClick={() => openGallery(suite.name, suite.photos)}
        className="zoom-host group absolute inset-0 block h-full w-full overflow-hidden text-left text-cal"
        aria-label={`${suite.name}: ${suite.summary} Abrir galeria com ${suite.photos.length} fotos.`}
      >
        <CardImage name={cover.name} alt="" sizes={sizes} />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,26,21,0.35)_0%,transparent_30%,transparent_45%,rgba(13,26,21,0.85)_100%)] transition-opacity duration-700 group-hover:opacity-90" />

        <span className="absolute left-4 top-4 flex items-center gap-2.5 md:left-6 md:top-6">
          <span className="block h-2.5 w-2.5 rounded-full ring-1 ring-cal/60" style={{ background: suite.color }} />
          <span className="eyebrow text-[0.64rem] text-cal/90">{suite.element}</span>
        </span>
        <span className="eyebrow absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-noite/35 px-3 py-1.5 text-[0.66rem] backdrop-blur-sm transition-colors duration-500 group-hover:bg-cal group-hover:text-noite md:right-6 md:top-6">
          {suite.photos.length} fotos
        </span>

        <span className="absolute inset-x-4 bottom-4 flex flex-col gap-3 md:inset-x-6 md:bottom-6">
          <span className="display block text-[clamp(2.2rem,4.4vw,4.2rem)] leading-none transition-transform duration-700 ease-[var(--ease-luxo)] [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:group-hover:translate-y-0">
            {suite.name.replace("Suíte ", "")}
          </span>
          <span
            className="block h-px w-full origin-left scale-x-[0.18] transition-transform duration-1000 ease-[var(--ease-luxo)] group-hover:scale-x-100"
            style={{ background: "currentColor" }}
            aria-hidden="true"
          />
          <span className="grid max-w-md text-[0.95rem] leading-snug text-cal/85 transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-luxo)] [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:grid-rows-[1fr] [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:grid-rows-[1fr] [@media(hover:hover)]:group-focus-visible:opacity-100">
            <span className="overflow-hidden">
              {suite.summary} {suite.detail}
            </span>
          </span>
        </span>
      </button>
    </RevealFrame>
  );
}

function DetailTile({
  suite,
  image,
  caption,
  direction,
  delay,
  className,
}: {
  suite: Suite;
  image: ImageName;
  caption: string;
  direction: RevealDirection;
  delay?: number;
  className: string;
}) {
  const openGallery = useOpenGallery();
  const index = Math.max(0, suite.photos.findIndex((p) => p.name === image));
  return (
    <RevealFrame direction={direction} delay={delay} className={`relative min-w-0 overflow-hidden ${className}`}>
      <button
        type="button"
        data-cursor="Ampliar"
        onClick={() => openGallery(suite.name, suite.photos, index)}
        className="zoom-host group absolute inset-0 block overflow-hidden text-left text-cal"
        aria-label={`${caption}. Abrir galeria da ${suite.name}.`}
      >
        <CardImage name={image} alt="" sizes="(min-width: 1024px) 22vw, 50vw" />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(13,26,21,0.75)_100%)]" />
        <span className="absolute inset-x-3 bottom-3 text-[0.82rem] leading-tight md:inset-x-4 md:bottom-4 md:text-sm">{caption}</span>
      </button>
    </RevealFrame>
  );
}

function NoteTile({ className }: { className: string }) {
  return (
    <FadeUp
      blur={false}
      className={`flex min-w-0 flex-col justify-between gap-4 bg-jatoba p-4 text-cal md:p-6 ${className}`}
    >
      <p className="eyebrow text-[0.66rem] text-cal/65">Em todas as suítes</p>
      <ul className="flex flex-col gap-1.5 text-[0.85rem] leading-snug md:text-[0.95rem]">
        <li>Ar-condicionado</li>
        <li>Banheiro privativo</li>
        <li>Enxoval branco</li>
        <li>Café da manhã na varanda</li>
      </ul>
    </FadeUp>
  );
}
