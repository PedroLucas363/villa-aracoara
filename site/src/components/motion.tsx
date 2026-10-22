import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { imgSrc, imgSrcSet, type ImageName } from "../data/content";
import { useMediaQuery } from "../lib/scroll";

export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

const VIEWPORT = { once: true, amount: 0.25 } as const;

/** Título dividido em linhas explícitas; cada linha sobe de dentro de uma máscara. */
export function LineReveal({
  lines,
  className,
  delay = 0,
  as = "h2",
  animateOnMount = false,
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
  animateOnMount?: boolean;
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const trigger = animateOnMount ? { animate: "show" } : { whileInView: "show", viewport: VIEWPORT };
  return (
    <Tag className={className} initial={reduce ? false : "hide"} {...trigger}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <motion.span
            className="block"
            variants={{
              hide: { y: "108%", rotate: 2.5 },
              show: { y: "0%", rotate: 0, transition: { duration: 1.25, ease: EASE, delay: delay + i * 0.11 } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/** Entrada de bloco com deslocamento, opacidade e um leve desfoque. */
export function FadeUp({
  children,
  className,
  delay = 0,
  y = 28,
  blur = true,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y, filter: blur ? "blur(6px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={VIEWPORT}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

const CLIP_FROM = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  center: "inset(18% 22% 18% 22%)",
} as const;

export type RevealDirection = keyof typeof CLIP_FROM;

/** Foto revelada por máscara (clip-path) com a imagem assentando de uma escala maior. */
export function ImageReveal({
  name,
  alt,
  direction = "up",
  className,
  imgClassName = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  delay = 0,
  parallax = 0,
  priority = false,
}: {
  name: ImageName;
  alt: string;
  direction?: RevealDirection;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  delay?: number;
  /** deslocamento vertical máximo da foto dentro da moldura, em % */
  parallax?: number;
  priority?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const small = useMediaQuery("(max-width: 767px)");
  const strength = reduce ? 0 : small ? parallax * 0.4 : parallax;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-strength}%`, `${strength}%`]);

  const position = className?.includes("absolute") ? "" : "relative";

  // O IntersectionObserver ignora alvos totalmente recortados por clip-path,
  // então quem observa é o wrapper sem recorte; máscara e foto recebem o estado por variants.
  return (
    <motion.div
      ref={ref}
      className={`${position} ${className ?? ""}`}
      initial={reduce ? false : "hide"}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden"
        variants={{
          hide: { clipPath: CLIP_FROM[direction] },
          show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.5, ease: EASE_IN_OUT, delay } },
        }}
      >
        {/* três camadas de transform independentes: parallax (scroll), zoom de hover (CSS) e assentamento (entrada) */}
        <motion.div className="absolute inset-0" style={{ y, scale: strength ? 1 + (strength * 2.2) / 100 : 1 }}>
          <div className="zoom-img h-full w-full">
            <motion.img
              src={imgSrc(name)}
              srcSet={imgSrcSet(name)}
              sizes={sizes}
              alt={alt}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              className={`h-full w-full object-cover ${imgClassName}`}
              variants={{
                hide: { scale: 1.22 },
                show: { scale: 1, transition: { duration: 2, ease: EASE, delay } },
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** Texto cuja opacidade de cada palavra acompanha a rolagem (leitura guiada). */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} still={!!reduce}>
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  still,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  still: boolean;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <>
      <motion.span style={{ opacity: still ? 1 : opacity }}>{children}</motion.span>{" "}
    </>
  );
}
