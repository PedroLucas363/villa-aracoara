import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { imgSrc, imgSrcSet } from "../data/content";
import {
  addDaysISO,
  GUEST_LIMITS,
  todayISO,
  validateDates,
  type BookingDraft,
  type DateErrors,
} from "../lib/booking";
import { useScrollTo } from "../lib/scroll";
import { Arrow, Magnetic } from "./interactions";
import { EASE, EASE_IN_OUT, LineReveal } from "./motion";

/** Momentos da coreografia de entrada, em segundos. */
const T = { image: 0, title: 0.55, details: 1.15, bar: 1.45, cue: 2.1 } as const;

export function Hero({ draft, onContinue }: { draft: BookingDraft; onContinue: (d: BookingDraft) => void }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const scrollTo = useScrollTo();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "22%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, reduce ? 1 : 0]);
  const veil = useTransform(scrollYProgress, [0, 1], [0, 0.55]);

  const enter = (delay: number, y = 22) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.1, ease: EASE, delay },
        };

  return (
    <section ref={ref} id="topo" className="relative h-[100svh] min-h-[660px] overflow-hidden bg-noite" aria-label="Apresentação">
      {/* 1. revelação da foto por máscara + 2. zoom-out lento */}
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { clipPath: "inset(16% 12% 16% 12% round 28px)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
        transition={{ duration: 1.7, ease: EASE_IN_OUT, delay: T.image }}
      >
        <motion.div className="grain absolute inset-0" style={{ y: imageY, scale: imageScale }}>
          <motion.img
            src={imgSrc("lua-varanda", 1920)}
            srcSet={imgSrcSet("lua-varanda")}
            sizes="100vw"
            alt="Folhas de coqueiro sobre a piscina turquesa, vistas da varanda de madeira da Suíte Lua"
            fetchPriority="high"
            className="h-full w-full object-cover object-[50%_78%]"
            initial={reduce ? false : { scale: 1.08 * 1.12 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 2.8, ease: EASE, delay: T.image }}
            style={{ transformOrigin: "50% 78%" }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,26,21,0.55)_0%,rgba(13,26,21,0.05)_28%,rgba(13,26,21,0.15)_55%,rgba(13,26,21,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_100%,rgba(13,26,21,0.75),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,26,21,0.6)_0%,rgba(13,26,21,0.25)_45%,transparent_70%)]" />
        <motion.div className="absolute inset-0 bg-noite" style={{ opacity: veil }} />
      </motion.div>

      <motion.p
        className="eyebrow absolute right-[max(16px,env(safe-area-inset-right))] top-[45%] hidden origin-right -rotate-90 text-cal/70 md:block lg:right-[max(40px,env(safe-area-inset-right))]"
        {...enter(T.details, 0)}
      >
        Varanda da Suíte Lua
      </motion.p>

      <motion.div
        className="gutter relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end pb-8 pt-28 md:pb-10"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="grid items-end gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div>
            <motion.p className="eyebrow mb-6 flex items-center gap-4 text-cal/85" {...enter(T.title - 0.15, 12)}>
              <motion.span
                className="block h-px w-10 origin-left bg-piscina"
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: EASE, delay: T.title }}
              />
              Praia do Preá · Ceará
            </motion.p>
            {/* 3. título por linhas, com stagger */}
            <LineReveal
              as="h1"
              animateOnMount
              delay={T.title}
              className="display text-[clamp(3.1rem,10.5vw,9.6rem)] text-cal"
              lines={[
                "Entre coqueiros",
                <>
                  e o <em className="italic text-piscina">vento</em>
                </>,
                "do Preá",
              ]}
            />
          </div>

          {/* 4. subtítulo, localização e CTA em sequência */}
          <div className="flex max-w-md flex-col gap-7 lg:pb-4">
            <motion.p className="text-[1.05rem] leading-relaxed text-cal/85 md:text-lg" {...enter(T.details)}>
              Quatro suítes, piscina entre palmeiras e café da manhã servido na varanda. Uma pousada pequena, vizinha de
              Jericoacoara.
            </motion.p>
            <motion.div className="flex flex-wrap items-center gap-3" {...enter(T.details + 0.12)}>
              <Magnetic>
                <a
                  href="#reserva"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("#reserva");
                  }}
                  className="group eyebrow inline-flex items-center gap-3 rounded-full bg-cal px-7 py-4 text-noite transition-[background-color,transform] duration-300 hover:bg-piscina active:scale-[0.97]"
                >
                  Planejar estadia <Arrow />
                </a>
              </Magnetic>
              <a
                href="#suites"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#suites");
                }}
                className="eyebrow rounded-full border border-cal/35 px-6 py-4 text-cal transition-colors duration-300 hover:border-cal hover:bg-cal/10"
              >
                Ver as suítes
              </a>
            </motion.div>
          </div>
        </div>

        <motion.div className="mt-10 hidden md:block" {...enter(T.bar, 30)}>
          <QuickBooking draft={draft} onContinue={onContinue} />
        </motion.div>
      </motion.div>

      {/* 6. indicador de rolagem */}
      <motion.div
        className="pointer-events-none absolute bottom-0 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: T.cue }}
        aria-hidden="true"
      >
        <span className="h-10 w-px overflow-hidden bg-cal/15">
          <span className="scroll-line block h-full w-full bg-cal" />
        </span>
      </motion.div>
    </section>
  );
}

/** Seletor rápido em vidro: valida datas e leva ao formulário completo de reserva. */
function QuickBooking({ draft, onContinue }: { draft: BookingDraft; onContinue: (d: BookingDraft) => void }) {
  const [local, setLocal] = useState(draft);
  const [errors, setErrors] = useState<DateErrors>({});
  const today = todayISO();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateDates(local);
    setErrors(found);
    if (!found.checkIn && !found.checkOut) onContinue(local);
  };

  const field =
    "group/f relative flex min-w-0 flex-1 flex-col gap-1 rounded-full px-6 py-3 transition-colors duration-300 hover:bg-cal/[0.06] focus-within:bg-cal/[0.09]";
  const input =
    "w-full min-w-0 bg-transparent text-[0.98rem] text-cal outline-none [color-scheme:dark] placeholder:text-cal/50";

  return (
    <form onSubmit={submit} noValidate aria-label="Simular reserva" className="relative">
      <div className="glass flex items-stretch gap-1 rounded-full p-1.5 pl-2">
        <label className={field}>
          <span className="eyebrow text-[0.66rem] text-cal/60">Chegada</span>
          <input
            id="hero-checkin"
            aria-label="Chegada"
            type="date"
            min={today}
            value={local.checkIn}
            aria-invalid={!!errors.checkIn}
            aria-describedby={errors.checkIn ? "hero-erro" : undefined}
            onChange={(e) => {
              const checkIn = e.target.value;
              setLocal((d) => ({
                ...d,
                checkIn,
                checkOut: d.checkOut && d.checkOut > checkIn ? d.checkOut : checkIn ? addDaysISO(checkIn, 3) : d.checkOut,
              }));
              setErrors({});
            }}
            className={input}
          />
        </label>
        <span className="my-3 w-px bg-cal/15" aria-hidden="true" />
        <label className={field}>
          <span className="eyebrow text-[0.66rem] text-cal/60">Saída</span>
          <input
            id="hero-checkout"
            aria-label="Saída"
            type="date"
            min={local.checkIn ? addDaysISO(local.checkIn, 1) : today}
            value={local.checkOut}
            aria-invalid={!!errors.checkOut}
            aria-describedby={errors.checkOut ? "hero-erro" : undefined}
            onChange={(e) => {
              setLocal((d) => ({ ...d, checkOut: e.target.value }));
              setErrors({});
            }}
            className={input}
          />
        </label>
        <span className="my-3 w-px bg-cal/15" aria-hidden="true" />
        <label className={field}>
          <span className="eyebrow text-[0.66rem] text-cal/60">Adultos</span>
          <select
            id="hero-adults"
            aria-label="Adultos"
            value={local.adults}
            onChange={(e) => setLocal((d) => ({ ...d, adults: Number(e.target.value) }))}
            className={`${input} cursor-pointer appearance-none`}
          >
            {Array.from({ length: GUEST_LIMITS.adultsMax }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n} className="bg-noite">
                {n} {n === 1 ? "adulto" : "adultos"}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="group eyebrow inline-flex shrink-0 items-center gap-3 rounded-full bg-piscina px-7 text-noite transition-[background-color,transform] duration-300 hover:bg-cal active:scale-[0.97]"
        >
          Continuar <Arrow />
        </button>
      </div>
      <p id="hero-erro" role="status" className="absolute left-8 top-full mt-2 text-sm text-[#ffb59a]">
        {errors.checkIn ?? errors.checkOut ?? ""}
      </p>
    </form>
  );
}
