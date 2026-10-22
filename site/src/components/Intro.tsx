import { FadeUp, ImageReveal, ScrollWords } from "./motion";

const FACTS = [
  { value: "4", label: "suítes com ar-condicionado e banheiro privativo" },
  { value: "Piscina", label: "externa, entre coqueiros, aberta o ano todo" },
  { value: "Preá", label: "a poucos minutos a pé da praia" },
] as const;

/** Apresentação da casa: frase guiada pela rolagem e duas fotos em profundidades diferentes. */
export function Intro() {
  return (
    <section aria-labelledby="intro-titulo" className="on-light relative bg-cal text-tinta">
      <div className="gutter mx-auto grid max-w-[1600px] gap-16 py-24 md:py-36 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7 lg:pr-8">
          <FadeUp>
            <h2 id="intro-titulo" className="eyebrow mb-10 flex items-center gap-4 text-tinta-suave">
              <span className="block h-px w-10 bg-current" aria-hidden="true" />A pousada
            </h2>
          </FadeUp>
          <ScrollWords
            className="display text-[clamp(1.9rem,4.1vw,3.6rem)] leading-[1.12] tracking-[-0.015em]"
            text="Paredes de cal, venezianas de madeira escura e redes nas varandas. A Villa Aracoara é uma casa pequena, recebida de perto pelos anfitriões, onde o dia começa com café na varanda e termina com o vento morno do Preá."
          />
          <dl className="mt-16 grid gap-8 border-t border-tinta/15 pt-10 sm:grid-cols-3">
            {FACTS.map((f, i) => (
              <FadeUp key={f.label} delay={i * 0.1} blur={false} className="flex flex-col gap-2">
                <dt className="sr-only">{f.label}</dt>
                <dd className="display text-[2.6rem] leading-none text-tinta">{f.value}</dd>
                <dd className="max-w-[22ch] text-[0.95rem] text-tinta-suave">{f.label}</dd>
              </FadeUp>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-5">
          <ImageReveal
            name="casa-reflexo"
            alt="A casa branca da pousada refletida na piscina, com pergolado de palha"
            direction="up"
            parallax={7}
            sizes="(min-width: 1024px) 34vw, 90vw"
            className="aspect-[3/4] w-[82%] max-w-full rounded-[2px]"
          />
          <ImageReveal
            name="lounge"
            alt="Sala aberta com sofá de fibra e luz da tarde entrando pela varanda"
            direction="left"
            parallax={14}
            delay={0.25}
            sizes="(min-width: 1024px) 18vw, 50vw"
            className="absolute -bottom-10 right-0 aspect-[3/4] w-[48%] max-w-full shadow-[0_40px_80px_-40px_rgba(13,26,21,0.55)] ring-8 ring-cal md:-bottom-16"
          />
          <FadeUp delay={0.4} className="mt-6 max-w-[16rem] text-sm text-tinta-suave md:mt-8">
            A piscina reflete a casa no fim da tarde, quando o sol baixa atrás dos coqueiros.
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
