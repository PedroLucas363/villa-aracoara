import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ADDRESS, NAV } from "../data/content";
import { useScrollTo } from "../lib/scroll";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const scrollTo = useScrollTo();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["35%", "0%"]);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(href);
  };

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-cal/10 bg-noite">
      <div className="gutter mx-auto max-w-[1600px] pt-20" style={{ paddingBottom: "max(32px, env(safe-area-inset-bottom))" }}>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow text-cal/55">Endereço</p>
            <p className="mt-4 max-w-xs text-lg text-cal/90">{ADDRESS}</p>
            <p className="mt-4 max-w-xs text-cal/60">Vizinha de Jericoacoara, perto do Aeroporto de Jericoacoara.</p>
          </div>
          <nav aria-label="Rodapé" className="md:col-span-3">
            <p className="eyebrow text-cal/55">Navegar</p>
            <ul className="mt-4 flex flex-col gap-2">
              {[...NAV, { href: "#reserva", label: "Reserva" }].map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={go(item.href)} className="text-cal/85 transition-colors hover:text-piscina">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4">
            <p className="eyebrow text-cal/55">Sobre esta página</p>
            <p className="mt-4 max-w-sm text-sm text-cal/60">
              Protótipo de landing page da Villa Aracoara. O simulador de reserva é demonstrativo e nenhum dado é enviado.
            </p>
            <a href="#topo" onClick={go("#topo")} className="eyebrow mt-6 inline-flex items-center gap-3 text-cal/80 transition-colors hover:text-cal">
              Voltar ao topo
              <svg viewBox="0 0 20 22" className="h-3.5 w-3" aria-hidden="true">
                <path d="M10 21V2M2 10l8-8 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-16 overflow-hidden" aria-hidden="true">
          <motion.p className="display whitespace-nowrap text-center text-[clamp(2.6rem,13.2vw,15rem)] leading-[0.85] text-cal" style={{ y }}>
            Villa <em className="italic text-piscina">Aracoara</em>
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
