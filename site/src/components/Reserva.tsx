import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useState } from "react";
import { imgSrc, SUITE_LIST, type SuiteId } from "../data/content";
import {
  addDaysISO,
  formatDate,
  GUEST_LIMITS,
  guestsLabel,
  nightsBetween,
  todayISO,
  validateDates,
  type BookingDraft,
  type DateErrors,
} from "../lib/booking";
import { Arrow, Magnetic } from "./interactions";
import { EASE, FadeUp, LineReveal } from "./motion";

export const STEP = { DATES: 0, GUESTS: 1, REVIEW: 2, DONE: 3 } as const;
export type StepId = (typeof STEP)[keyof typeof STEP];

const STEP_LABELS = ["Datas", "Hóspedes e suíte", "Revisão"] as const;

/**
 * Simulador de reserva em etapas. É demonstrativo: não consulta disponibilidade,
 * não envia dados e deixa isso claro em todas as etapas.
 */
export function Reserva({
  draft,
  setDraft,
  startStep,
}: {
  draft: BookingDraft;
  setDraft: (d: BookingDraft) => void;
  startStep: { step: StepId; at: number } | null;
}) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<StepId>(STEP.DATES);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<DateErrors>({});
  const nights = nightsBetween(draft.checkIn, draft.checkOut);

  // o seletor rápido do hero pode mandar o visitante direto para a etapa de hóspedes
  useEffect(() => {
    if (startStep) {
      setDir(1);
      setStep(startStep.step);
    }
  }, [startStep]);

  const goTo = (next: StepId) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const nextFromDates = () => {
    const found = validateDates(draft);
    setErrors(found);
    if (!found.checkIn && !found.checkOut) goTo(STEP.GUESTS);
  };

  return (
    <section id="reserva" aria-labelledby="reserva-titulo" className="relative overflow-hidden bg-noite">
      <div className="absolute inset-0" aria-hidden="true">
        <img src={imgSrc("piscina", 640)} alt="" loading="lazy" className="h-full w-full scale-110 object-cover opacity-40 blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--color-noite)_0%,rgba(13,26,21,0.7)_40%,var(--color-noite)_100%)]" />
      </div>

      <div className="gutter relative mx-auto grid max-w-[1600px] gap-14 py-24 md:py-36 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <FadeUp>
            <p className="eyebrow mb-8 flex items-center gap-4 text-cal/65">
              <span className="block h-px w-10 bg-current" aria-hidden="true" />
              Reserva
            </p>
          </FadeUp>
          <LineReveal
            className="display text-[clamp(2.6rem,5.6vw,5.4rem)] text-cal"
            lines={[<span id="reserva-titulo">Planeje</span>, <em className="italic text-piscina">sua estadia</em>]}
          />
          <FadeUp delay={0.15} className="mt-8 max-w-md text-cal/75">
            Escolha as datas, o número de hóspedes e a suíte que prefere. O resumo mostra como ficaria o pedido.
          </FadeUp>
          <FadeUp delay={0.25} className="mt-10 flex max-w-md gap-4 border-l-2 border-piscina/70 pl-5 text-sm text-cal/80">
            <p>
              <strong className="font-medium text-cal">Simulação.</strong> Este formulário é uma demonstração do site: ele
              não consulta disponibilidade, não envia seus dados e não confirma reservas.
            </p>
          </FadeUp>
        </div>

        <FadeUp delay={0.1} blur={false} className="lg:col-span-6 lg:col-start-7">
          <div className="glass rounded-[28px] p-5 shadow-[0_60px_120px_-60px_rgba(0,0,0,0.8)] md:p-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <Stepper step={step} />
              <span className="eyebrow shrink-0 rounded-full border border-piscina/40 px-3 py-1.5 text-[0.64rem] text-piscina">Demonstração</span>
            </div>

            <div className="relative min-h-[23rem]">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={{
                    in: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * 40, filter: "blur(4px)" }),
                    center: { opacity: 1, x: 0, filter: "blur(0px)" },
                    out: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * -40, filter: "blur(4px)" }),
                  }}
                  initial="in"
                  animate="center"
                  exit="out"
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  {step === STEP.DATES && (
                    <DatesStep draft={draft} setDraft={setDraft} errors={errors} setErrors={setErrors} onNext={nextFromDates} />
                  )}
                  {step === STEP.GUESTS && (
                    <GuestsStep draft={draft} setDraft={setDraft} onBack={() => goTo(STEP.DATES)} onNext={() => goTo(STEP.REVIEW)} />
                  )}
                  {step === STEP.REVIEW && (
                    <ReviewStep draft={draft} nights={nights} onBack={() => goTo(STEP.GUESTS)} onConfirm={() => goTo(STEP.DONE)} />
                  )}
                  {step === STEP.DONE && <DoneStep draft={draft} nights={nights} onRestart={() => goTo(STEP.DATES)} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function Stepper({ step }: { step: StepId }) {
  return (
    <ol className="flex min-w-0 items-center gap-2" aria-label="Etapas">
      {STEP_LABELS.map((label, i) => {
        const done = step > i;
        const current = step === i;
        return (
          <li key={label} className="flex min-w-0 items-center gap-2" aria-current={current ? "step" : undefined}>
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[0.72rem] tabular-nums transition-all duration-500 ${
                done ? "border-piscina bg-piscina text-noite" : current ? "border-cal text-cal" : "border-cal/25 text-cal/45"
              }`}
            >
              {done ? (
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span className={current ? "eyebrow hidden whitespace-nowrap text-[0.66rem] text-cal sm:block" : "sr-only"}>{label}</span>
            {i < STEP_LABELS.length - 1 && (
              <span className="relative hidden h-px w-6 bg-cal/20 md:block" aria-hidden="true">
                <span className={`absolute inset-0 origin-left bg-piscina transition-transform duration-700 ${done ? "scale-x-100" : "scale-x-0"}`} />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

const fieldBox =
  "group/f flex flex-col gap-1.5 rounded-2xl border px-4 py-3 transition-[border-color,background-color,box-shadow] duration-300 focus-within:bg-cal/[0.06]";

function fieldState(error?: string, filled?: boolean) {
  if (error) return "border-[#ffb59a]/80 shadow-[0_0_0_3px_rgba(255,181,154,0.15)]";
  if (filled) return "border-piscina/55 focus-within:border-piscina";
  return "border-cal/20 focus-within:border-cal/70";
}

function FilledMark({ show }: { show: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      className="flex h-4 w-4 items-center justify-center rounded-full bg-piscina text-noite"
      initial={false}
      animate={{ scale: show ? 1 : 0, opacity: show ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      <svg viewBox="0 0 16 16" className="h-2.5 w-2.5">
        <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    </motion.span>
  );
}

function DatesStep({
  draft,
  setDraft,
  errors,
  setErrors,
  onNext,
}: {
  draft: BookingDraft;
  setDraft: (d: BookingDraft) => void;
  errors: DateErrors;
  setErrors: (e: DateErrors) => void;
  onNext: () => void;
}) {
  const today = todayISO();
  const nights = nightsBetween(draft.checkIn, draft.checkOut);
  const valid = !Object.keys(validateDates(draft)).length;

  // valida ao vivo depois da primeira tentativa, para o feedback acompanhar a correção
  const update = (patch: Partial<BookingDraft>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    if (errors.checkIn || errors.checkOut) setErrors(validateDates(next));
  };

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="flex flex-col gap-6"
    >
      <h3 className="display text-[1.9rem] leading-tight text-cal">Quando você vem?</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <DateField
          id="reserva-checkin"
          label="Chegada"
          value={draft.checkIn}
          min={today}
          error={errors.checkIn}
          onChange={(v) =>
            update({ checkIn: v, checkOut: draft.checkOut && draft.checkOut > v ? draft.checkOut : v ? addDaysISO(v, 3) : draft.checkOut })
          }
        />
        <DateField
          id="reserva-checkout"
          label="Saída"
          value={draft.checkOut}
          min={draft.checkIn ? addDaysISO(draft.checkIn, 1) : today}
          error={errors.checkOut}
          onChange={(v) => update({ checkOut: v })}
        />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Sugestões de duração">
        {[2, 3, 5, 7].map((n) => {
          const active = nights === n;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={active}
              onClick={() => {
                const start = draft.checkIn && draft.checkIn >= today ? draft.checkIn : addDaysISO(today, 14);
                update({ checkIn: start, checkOut: addDaysISO(start, n) });
              }}
              className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 active:scale-[0.96] ${
                active ? "border-piscina bg-piscina text-noite" : "border-cal/20 text-cal/80 hover:border-cal/60 hover:text-cal"
              }`}
            >
              {n} noites
            </button>
          );
        })}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-cal/10 pt-6">
        <p className="text-sm text-cal/70" aria-live="polite">
          {valid && nights > 0 ? (
            <>
              <span className="display text-xl text-cal">{nights}</span> {nights === 1 ? "noite" : "noites"} · {formatDate(draft.checkIn)} a{" "}
              {formatDate(draft.checkOut)}
            </>
          ) : (
            "Escolha as duas datas para continuar."
          )}
        </p>
        <PrimaryButton type="submit">Continuar</PrimaryButton>
      </div>
    </form>
  );
}

function DateField({
  id,
  label,
  value,
  min,
  error,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  min: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  const errorId = `${id}-erro`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={`${fieldBox} ${fieldState(error, !!value)}`}>
        <span className="flex items-center justify-between">
          <span className="eyebrow text-[0.66rem] text-cal/60">{label}</span>
          <FilledMark show={!!value && !error} />
        </span>
        <input
          id={id}
          type="date"
          min={min}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="w-full min-w-0 bg-transparent text-[1.05rem] text-cal outline-none [color-scheme:dark]"
        />
      </label>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={errorId}
            role="alert"
            className="text-sm text-[#ffb59a]"
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Counter({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const id = useId();
  const btn =
    "flex h-10 w-10 items-center justify-center rounded-full border border-cal/25 text-lg text-cal transition-all duration-300 hover:border-cal hover:bg-cal hover:text-noite active:scale-90 disabled:pointer-events-none disabled:opacity-30";
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-cal/15 px-4 py-3" role="group" aria-labelledby={id}>
      <div>
        <p id={id} className="text-cal">
          {label}
        </p>
        <p className="text-sm text-cal/55">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className={btn} disabled={value <= min} onClick={() => onChange(value - 1)} aria-label={`Menos ${label.toLowerCase()}`}>
          −
        </button>
        <span className="relative w-6 overflow-hidden text-center tabular-nums" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={value}
              className="block"
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </span>
        <button type="button" className={btn} disabled={value >= max} onClick={() => onChange(value + 1)} aria-label={`Mais ${label.toLowerCase()}`}>
          +
        </button>
      </div>
    </div>
  );
}

function GuestsStep({
  draft,
  setDraft,
  onBack,
  onNext,
}: {
  draft: BookingDraft;
  setDraft: (d: BookingDraft) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="flex flex-col gap-6"
    >
      <h3 className="display text-[1.9rem] leading-tight text-cal">Quem vem com você?</h3>
      <div className="grid gap-3">
        <Counter
          label="Adultos"
          hint="A partir de 13 anos"
          value={draft.adults}
          min={GUEST_LIMITS.adultsMin}
          max={GUEST_LIMITS.adultsMax}
          onChange={(adults) => setDraft({ ...draft, adults })}
        />
        <Counter
          label="Crianças"
          hint="Até 12 anos"
          value={draft.children}
          min={0}
          max={GUEST_LIMITS.childrenMax}
          onChange={(children) => setDraft({ ...draft, children })}
        />
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="eyebrow mb-3 text-[0.66rem] text-cal/60">Suíte preferida (opcional)</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SUITE_LIST.map((s) => (
            <SuiteOption key={s.id} id={s.id} name={s.name} color={s.color} checked={draft.suite === s.id} onSelect={(suite) => setDraft({ ...draft, suite })} />
          ))}
        </div>
      </fieldset>

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-cal/10 pt-6">
        <BackButton onClick={onBack} />
        <PrimaryButton type="submit">Revisar</PrimaryButton>
      </div>
    </form>
  );
}

function SuiteOption({
  id,
  name,
  color,
  checked,
  onSelect,
}: {
  id: SuiteId;
  name: string;
  color: string;
  checked: boolean;
  onSelect: (id: SuiteId | null) => void;
}) {
  return (
    <label
      className={`relative flex cursor-pointer items-center gap-2.5 rounded-2xl border px-3 py-3 text-sm transition-all duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-piscina active:scale-[0.97] ${
        checked ? "border-cal bg-cal text-noite" : "border-cal/20 text-cal/85 hover:border-cal/60"
      }`}
    >
      <input
        type="checkbox"
        id={`suite-${id}`}
        aria-label={name}
        className="sr-only"
        checked={checked}
        onChange={() => onSelect(checked ? null : id)}
      />
      <span className="h-3 w-3 shrink-0 rounded-full ring-1 ring-current/30" style={{ background: color }} aria-hidden="true" />
      {name.replace("Suíte ", "")}
    </label>
  );
}

function ReviewStep({
  draft,
  nights,
  onBack,
  onConfirm,
}: {
  draft: BookingDraft;
  nights: number;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const suite = SUITE_LIST.find((s) => s.id === draft.suite);
  const rows = [
    { label: "Chegada", value: formatDate(draft.checkIn) },
    { label: "Saída", value: formatDate(draft.checkOut) },
    { label: "Noites", value: String(nights) },
    { label: "Hóspedes", value: guestsLabel(draft.adults, draft.children) },
    { label: "Suíte", value: suite ? suite.name : "Sem preferência" },
  ];
  return (
    <div className="flex flex-col gap-6">
      <h3 className="display text-[1.9rem] leading-tight text-cal">Confira o pedido</h3>
      <dl className="divide-y divide-cal/10 border-y border-cal/10">
        {rows.map((r, i) => (
          <motion.div
            key={r.label}
            className="flex items-baseline justify-between gap-4 py-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.05 }}
          >
            <dt className="text-sm text-cal/60">{r.label}</dt>
            <dd className="text-right text-cal">{r.value}</dd>
          </motion.div>
        ))}
      </dl>
      <p className="text-sm text-cal/65">Valores e disponibilidade não são exibidos nesta demonstração.</p>
      <div className="mt-auto flex items-center justify-between gap-4 border-t border-cal/10 pt-6">
        <BackButton onClick={onBack} />
        <PrimaryButton type="button" onClick={onConfirm}>
          Concluir simulação
        </PrimaryButton>
      </div>
    </div>
  );
}

function DoneStep({ draft, nights, onRestart }: { draft: BookingDraft; nights: number; onRestart: () => void }) {
  return (
    <div className="flex flex-col items-start gap-6 py-4" role="status">
      <motion.span
        className="flex h-16 w-16 items-center justify-center rounded-full bg-piscina text-noite"
        initial={{ scale: 0, rotate: -40 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          />
        </svg>
      </motion.span>
      <h3 className="display text-[2rem] leading-tight text-cal">Simulação concluída</h3>
      <p className="max-w-md text-cal/80">
        Você montou um pedido de {nights} {nights === 1 ? "noite" : "noites"} para {guestsLabel(draft.adults, draft.children)}, de{" "}
        {formatDate(draft.checkIn)} a {formatDate(draft.checkOut)}.
      </p>
      <p className="max-w-md rounded-2xl border border-piscina/30 bg-piscina/10 p-4 text-sm text-cal/85">
        Nenhuma reserva foi feita e nenhum dado foi enviado. Quando o site estiver no ar, este passo encaminha o pedido para a
        pousada confirmar.
      </p>
      <button type="button" onClick={onRestart} className="eyebrow text-cal/70 underline decoration-cal/30 underline-offset-8 transition-colors hover:text-cal">
        Fazer outra simulação
      </button>
    </div>
  );
}

function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Magnetic>
      <button
        {...props}
        className="group eyebrow inline-flex items-center gap-3 rounded-full bg-cal px-6 py-3.5 text-noite transition-[background-color,transform] duration-300 hover:bg-piscina active:scale-[0.96]"
      >
        {children} <Arrow />
      </button>
    </Magnetic>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="eyebrow group inline-flex items-center gap-2 py-3 text-cal/70 transition-colors hover:text-cal">
      <svg viewBox="0 0 22 20" className="h-3 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true">
        <path d="M1 10h19M12 2l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      Voltar
    </button>
  );
}
