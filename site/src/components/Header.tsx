import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { NAV } from "../data/content";
import { useScrollLock, useScrollTo } from "../lib/scroll";
import { EASE } from "./motion";

/**
 * Sobre o hero o header é transparente e integrado à foto; ao rolar vira uma barra de vidro compacta,
 * some ao descer e volta ao subir (ou quando recebe foco do teclado).
 */
export function Header() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const scrollTo = useScrollTo();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const last = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    setSolid(y > 60);
    const delta = y - last.current;
    if (Math.abs(delta) > 6) setHidden(delta > 0 && y > window.innerHeight * 0.9);
    last.current = y;
  });

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollTo(href);
  };

  return (
    <>
      <a
        href="#conteudo"
        onClick={go("#conteudo")}
        className="eyebrow fixed left-4 top-4 z-[90] -translate-y-24 rounded-full bg-cal px-4 py-2 text-noite focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
        initial={reduce ? false : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: hidden && !menuOpen ? "-110%" : 0 }}
        transition={{
          opacity: { duration: 1.2, ease: EASE, delay: 1.1 },
          y: { duration: hidden ? 0.5 : 0.9, ease: EASE },
        }}
        onFocusCapture={() => setHidden(false)}
      >
        <div
          className={`gutter transition-[padding] duration-700 ease-[var(--ease-luxo)] ${solid ? "py-2.5" : "py-5 md:py-7"}`}
        >
          <div
            className={`mx-auto flex max-w-[1600px] items-center justify-between gap-6 rounded-full transition-all duration-700 ease-[var(--ease-luxo)] ${
              solid ? "glass px-4 py-2 md:px-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]" : "border border-transparent px-0 py-0"
            }`}
          >
            <a href="#topo" onClick={go("#topo")} className="group flex items-baseline gap-2 text-cal" aria-label="Villa Aracoara, voltar ao início">
              <span className="display text-[1.45rem] leading-none md:text-[1.65rem]">
                Villa <em className="italic">Aracoara</em>
              </span>
            </a>

            <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={go(item.href)}
                  className="eyebrow group relative py-2 text-cal/85 transition-colors hover:text-cal"
                >
                  {item.label}
                  <span className="absolute inset-x-0 bottom-1 h-px origin-right scale-x-0 bg-current transition-transform duration-500 ease-[var(--ease-luxo)] group-hover:origin-left group-hover:scale-x-100" />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="#reserva"
                onClick={go("#reserva")}
                className="eyebrow hidden rounded-full bg-cal px-5 py-2.5 text-noite transition-[background-color,transform] duration-300 hover:bg-piscina active:scale-[0.97] sm:inline-flex"
              >
                Reservar
              </a>
              <button
                type="button"
                className="eyebrow inline-flex items-center gap-2 rounded-full border border-cal/30 px-4 py-2.5 text-cal lg:hidden"
                aria-expanded={menuOpen}
                aria-controls="menu-mobile"
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span className="relative block h-2.5 w-4" aria-hidden="true">
                  <span className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-500 ${menuOpen ? "translate-y-[5px] rotate-45" : ""}`} />
                  <span className={`absolute bottom-0 left-0 h-px w-4 bg-current transition-transform duration-500 ${menuOpen ? "-translate-y-[4px] -rotate-45" : ""}`} />
                </span>
                {menuOpen ? "Fechar" : "Menu"}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={go} />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (href: string) => (e: React.MouseEvent) => void;
}) {
  useScrollLock(open);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const items = [...NAV, { href: "#reserva", label: "Reservar" }];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-mobile"
          className="gutter fixed inset-0 z-40 flex flex-col justify-end bg-noite pb-[max(40px,env(safe-area-inset-bottom))] pt-28 lg:hidden"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
        >
          <nav aria-label="Menu" className="flex flex-col gap-1">
            {items.map((item, i) => (
              <span key={item.href} className="line-mask">
                <motion.a
                  ref={i === 0 ? firstLink : undefined}
                  href={item.href}
                  onClick={onNavigate(item.href)}
                  className="display block py-1 text-[clamp(2.6rem,12vw,4.5rem)] text-cal"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.06 }}
                >
                  {item.label}
                </motion.a>
              </span>
            ))}
          </nav>
          <motion.p
            className="eyebrow mt-10 text-cal/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.7 } }}
            exit={{ opacity: 0 }}
          >
            Praia do Preá · Ceará
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
