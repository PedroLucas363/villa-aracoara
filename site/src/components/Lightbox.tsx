import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { imgSrc, type Photo } from "../data/content";
import { useScrollLock } from "../lib/scroll";
import { EASE } from "./motion";

type Gallery = { title: string; photos: Photo[]; index: number };

const GalleryContext = createContext<(title: string, photos: Photo[], index?: number) => void>(() => {});

export function useOpenGallery() {
  return useContext(GalleryContext);
}

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const open = useCallback((title: string, photos: Photo[], index = 0) => {
    opener.current = document.activeElement as HTMLElement | null;
    setGallery({ title, photos, index });
  }, []);

  const close = useCallback(() => {
    setGallery(null);
    // devolve o foco ao card que abriu a galeria
    requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  }, []);

  return (
    <GalleryContext.Provider value={open}>
      {children}
      <AnimatePresence>
        {gallery && <Lightbox key="lightbox" gallery={gallery} setGallery={setGallery} onClose={close} />}
      </AnimatePresence>
    </GalleryContext.Provider>
  );
}

function Lightbox({
  gallery,
  setGallery,
  onClose,
}: {
  gallery: Gallery;
  setGallery: (g: Gallery) => void;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [dir, setDir] = useState(0);
  const { photos, index, title } = gallery;
  const photo = photos[index];
  useScrollLock(true);

  const go = useCallback(
    (step: number) => {
      setDir(step);
      setGallery({ ...gallery, index: (index + step + photos.length) % photos.length });
    },
    [gallery, index, photos.length, setGallery]
  );

  useEffect(() => {
    closeBtn.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialog.current) {
        // mantém o foco dentro do diálogo
        const items = dialog.current.querySelectorAll<HTMLElement>("button");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // pré-carrega as vizinhas para a troca ser instantânea
  useEffect(() => {
    [1, -1].forEach((s) => {
      const img = new Image();
      img.src = imgSrc(photos[(index + s + photos.length) % photos.length].name, 1440);
    });
  }, [index, photos]);

  const multiple = photos.length > 1;

  return (
    <motion.div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={`Galeria: ${title}`}
      className="fixed inset-0 z-[70] flex flex-col bg-noite/95 text-cal backdrop-blur-md"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.1 } }}
      transition={{ duration: 0.45 }}
    >
      <div className="gutter flex items-center justify-between gap-4 py-4">
        <p className="eyebrow min-w-0 truncate">
          {title} <span className="ml-3 tabular-nums text-cal/55">{String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
        </p>
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          className="eyebrow group inline-flex items-center gap-3 rounded-full border border-cal/25 px-4 py-2.5 transition-colors hover:bg-cal hover:text-noite"
        >
          Fechar
          <span aria-hidden="true" className="relative h-3 w-3 transition-transform duration-500 group-hover:rotate-90">
            <span className="absolute left-0 top-1/2 h-px w-3 rotate-45 bg-current" />
            <span className="absolute left-0 top-1/2 h-px w-3 -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      {/* clique fora da foto fecha */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.img
            key={photo.name}
            src={imgSrc(photo.name, 1440)}
            alt={photo.alt}
            custom={dir}
            className="max-h-full max-w-full select-none object-contain shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)]"
            draggable={false}
            drag={multiple ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) go(1);
              else if (info.offset.x > 70) go(-1);
            }}
            variants={{
              enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * 80, scale: d === 0 ? 0.92 : 1 }),
              center: { opacity: 1, x: 0, scale: 1 },
              exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * -80, scale: d === 0 ? 0.95 : 1 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.65, ease: EASE }}
          />
        </AnimatePresence>

        {multiple && (
          <>
            <NavButton side="left" onClick={() => go(-1)} />
            <NavButton side="right" onClick={() => go(1)} />
          </>
        )}
      </div>

      <div className="gutter flex flex-col gap-3 py-4">
        <p className="mx-auto max-w-2xl text-center text-sm text-cal/70" aria-live="polite">
          {photo.alt}
        </p>
        {multiple && (
          <div className="mx-auto flex max-w-full gap-2 overflow-x-auto pb-1" role="group" aria-label="Miniaturas">
            {photos.map((p, i) => (
              <button
                key={p.name}
                type="button"
                aria-label={`Foto ${i + 1}: ${p.alt}`}
                aria-current={i === index}
                onClick={() => {
                  setDir(i > index ? 1 : -1);
                  setGallery({ ...gallery, index: i });
                }}
                className={`relative h-12 w-12 shrink-0 overflow-hidden transition-[opacity,transform] duration-300 md:h-14 md:w-14 ${
                  i === index ? "opacity-100 ring-1 ring-cal ring-offset-2 ring-offset-noite" : "opacity-45 hover:opacity-90"
                }`}
              >
                <img src={imgSrc(p.name, 640)} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Foto anterior" : "Próxima foto"}
      className={`group absolute top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-cal/25 bg-noite/40 backdrop-blur transition-colors hover:bg-cal hover:text-noite sm:flex ${
        side === "left" ? "left-4 md:left-8" : "right-4 md:right-8"
      }`}
    >
      <svg
        viewBox="0 0 22 20"
        className={`h-4 w-5 transition-transform duration-300 ${side === "left" ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
        aria-hidden="true"
      >
        <path d="M1 10h19M12 2l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  );
}
