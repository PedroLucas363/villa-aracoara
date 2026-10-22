import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useFinePointer } from "../lib/scroll";

const MAGNET_LIMIT = 10;

/** CTA com atração magnética discreta; só em ponteiro preciso e sem movimento reduzido. */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.6 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.6 });
  const active = fine && !reduce;

  return (
    <motion.div
      ref={ref}
      className={`inline-flex ${className ?? ""}`}
      style={active ? { x, y } : undefined}
      onPointerMove={(e) => {
        if (!active || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.35;
        x.set(Math.max(-MAGNET_LIMIT, Math.min(MAGNET_LIMIT, dx)));
        y.set(Math.max(-MAGNET_LIMIT, Math.min(MAGNET_LIMIT, dy)));
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Seta que se desloca no hover do botão pai (`group`). */
export function Arrow({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-block h-[1em] w-[1.1em] overflow-hidden ${className}`} aria-hidden="true">
      <svg viewBox="0 0 22 20" className="absolute inset-0 h-full w-full transition-transform duration-500 ease-[var(--ease-luxo)] group-hover:translate-x-[120%]">
        <path d="M1 10h19M12 2l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg viewBox="0 0 22 20" className="absolute inset-0 h-full w-full -translate-x-[120%] transition-transform duration-500 ease-[var(--ease-luxo)] group-hover:translate-x-0">
        <path d="M1 10h19M12 2l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

/**
 * Rótulo que acompanha o ponteiro sobre fotos clicáveis (`data-cursor="Ver fotos"`).
 * O cursor nativo continua visível; o rótulo só indica a ação e nunca recebe cliques.
 */
export function CursorLabel() {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 50, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 900, damping: 50, mass: 0.3 });

  useEffect(() => {
    if (!fine) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const host = (e.target as Element | null)?.closest?.("[data-cursor]");
      setLabel(host ? host.getAttribute("data-cursor") : null);
    };
    const leave = () => setLabel(null);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80]"
      style={{ x: reduce ? x : sx, y: reduce ? y : sy }}
    >
      <AnimatePresence>
        {label && (
          <motion.div
            key="cursor"
            className="eyebrow -ml-11 -mt-11 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-cal text-center text-[0.66rem] leading-tight text-noite shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.3, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
