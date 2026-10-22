import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

const HEADER_OFFSET = -72;

const LenisContext = createContext<Lenis | null>(null);

/** Rolagem suave com Lenis; desativada quando o visitante prefere movimento reduzido. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduce) return;
    const instance = new Lenis({ autoRaf: true, lerp: 0.085, wheelMultiplier: 0.95 });
    setLenis(instance);
    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, [reduce]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  return useContext(LenisContext);
}

/** Leva até uma seção e move o foco para ela, para quem navega por teclado continuar dali. */
export function useScrollTo() {
  const lenis = useLenis();
  const reduce = useReducedMotion();

  return useCallback(
    (hash: string) => {
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      const focusTarget = () => {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      };
      if (lenis) {
        lenis.scrollTo(target, { offset: HEADER_OFFSET, duration: 1.6, onComplete: focusTarget });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET;
        window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
        focusTarget();
      }
    },
    [lenis, reduce]
  );
}

/** Pausa a rolagem da página (lightbox, menu) sem perder a posição. */
export function useScrollLock(locked: boolean) {
  const lenis = useLenis();
  useEffect(() => {
    if (!locked) return;
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = prev;
    };
  }, [locked, lenis]);
}

/** Verdadeiro em dispositivos com ponteiro preciso e hover (mouse/trackpad). */
export function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return fine;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}
