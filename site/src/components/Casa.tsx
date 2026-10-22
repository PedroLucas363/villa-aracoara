import { CASA_PHOTOS, type ImageName } from "../data/content";
import { useOpenGallery } from "./Lightbox";
import { FadeUp, ImageReveal, LineReveal, type RevealDirection } from "./motion";

const AMENITIES = [
  { title: "Piscina", text: "Externa, entre coqueiros, aberta o ano todo, com deck e espreguiçadeiras." },
  { title: "Jardim e terraço", text: "Gramado ao sol e sombra de pergolado de palha." },
  { title: "Bar", text: "Para um drinque gelado quando o sol começa a baixar." },
  { title: "Varandas", text: "Com redes, voltadas para o coqueiral e para a piscina." },
] as const;

type Tile = { name: ImageName; className: string; direction: RevealDirection; parallax?: number };

const TILES: Tile[] = [
  { name: "piscina", className: "col-span-2 aspect-[3/4] md:col-span-1 md:row-span-2 md:aspect-auto", direction: "up", parallax: 6 },
  { name: "deck", className: "aspect-[3/4]", direction: "left" },
  { name: "lounge", className: "aspect-[3/4]", direction: "down" },
  { name: "casa-piscina", className: "col-span-2 aspect-[16/10] md:col-span-2 md:aspect-auto", direction: "right", parallax: 8 },
];

/** A casa e as áreas comuns: fotos em bento com as comodidades confirmadas entre elas. */
export function Casa() {
  const openGallery = useOpenGallery();
  const open = (name: ImageName) =>
    openGallery("A casa", CASA_PHOTOS, Math.max(0, CASA_PHOTOS.findIndex((p) => p.name === name)));

  return (
    <section id="casa" aria-labelledby="casa-titulo" className="on-light bg-cal-2 text-tinta">
      <div className="gutter mx-auto max-w-[1600px] py-24 md:py-36">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <FadeUp>
              <p className="eyebrow mb-8 flex items-center gap-4 text-tinta-suave">
                <span className="block h-px w-10 bg-current" aria-hidden="true" />A casa
              </p>
            </FadeUp>
            <LineReveal
              className="display text-[clamp(2.4rem,5vw,4.6rem)]"
              lines={[<span id="casa-titulo">Sombra, água</span>, <em className="italic">e silêncio</em>]}
            />
            <FadeUp delay={0.15} className="mt-8 max-w-sm text-tinta-suave">
              Casa branca de dois andares, com pergolados de palha, piso de cerâmica e madeira escura. A área comum se abre
              inteira para a piscina.
            </FadeUp>
            <dl className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {AMENITIES.map((a, i) => (
                <FadeUp key={a.title} delay={0.1 + i * 0.07} blur={false} className="border-t border-tinta/15 pt-4">
                  <dt className="display text-[1.5rem] leading-tight">{a.title}</dt>
                  <dd className="mt-1 text-[0.95rem] text-tinta-suave">{a.text}</dd>
                </FadeUp>
              ))}
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:[grid-auto-rows:clamp(180px,19vw,330px)] md:gap-4 lg:col-span-8">
            {TILES.map((t, i) => {
              const photo = CASA_PHOTOS.find((p) => p.name === t.name)!;
              return (
                <button
                  key={t.name}
                  type="button"
                  data-cursor="Ampliar"
                  onClick={() => open(t.name)}
                  aria-label={`Ampliar: ${photo.alt}`}
                  className={`zoom-host group relative block min-w-0 overflow-hidden ${t.className}`}
                >
                  <ImageReveal
                    name={t.name}
                    alt=""
                    direction={t.direction}
                    delay={i * 0.08}
                    parallax={t.parallax}
                    sizes="(min-width: 768px) 28vw, 50vw"
                    className="absolute inset-0"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-noite/0 transition-colors duration-700 group-hover:bg-noite/10" />
                </button>
              );
            })}
            <FadeUp
              blur={false}
              className="col-span-2 flex flex-col justify-between gap-6 bg-noite p-6 text-cal md:col-span-1 md:p-8"
            >
              <p className="eyebrow text-[0.66rem] text-piscina">Recebidos pelos anfitriões</p>
              <p className="display text-[1.55rem] leading-snug md:text-[1.8rem]">
                Os hóspedes costumam lembrar da acolhida, do café e da piscina.
              </p>
            </FadeUp>
            <button
              type="button"
              data-cursor="Ampliar"
              onClick={() => open("casa-coqueiros")}
              aria-label="Ampliar: a casa vista da rua, entre dois coqueiros"
              className="zoom-host group relative col-span-2 block aspect-[16/10] min-w-0 overflow-hidden md:col-span-2 md:aspect-auto"
            >
              <ImageReveal name="casa-coqueiros" alt="" direction="up" parallax={10} sizes="(min-width: 768px) 56vw, 100vw" className="absolute inset-0" />
              <span className="eyebrow absolute bottom-4 left-4 rounded-full bg-cal/85 px-3 py-1.5 text-[0.66rem] text-noite backdrop-blur">
                Ver as {CASA_PHOTOS.length} fotos da casa
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
