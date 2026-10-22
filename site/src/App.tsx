import { useState } from "react";
import { Arredores } from "./components/Arredores";
import { Cafe } from "./components/Cafe";
import { Casa } from "./components/Casa";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { CursorLabel } from "./components/interactions";
import { Intro } from "./components/Intro";
import { GalleryProvider } from "./components/Lightbox";
import { Reserva, STEP, type StepId } from "./components/Reserva";
import { Suites } from "./components/Suites";
import { SunsetWindow } from "./components/SunsetWindow";
import { EMPTY_DRAFT, type BookingDraft } from "./lib/booking";
import { SmoothScroll, useScrollTo } from "./lib/scroll";

export default function App() {
  return (
    <SmoothScroll>
      <GalleryProvider>
        <Page />
      </GalleryProvider>
    </SmoothScroll>
  );
}

function Page() {
  const [draft, setDraft] = useState<BookingDraft>(EMPTY_DRAFT);
  const [startStep, setStartStep] = useState<{ step: StepId; at: number } | null>(null);
  const scrollTo = useScrollTo();

  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero
          draft={draft}
          onContinue={(d) => {
            setDraft(d);
            setStartStep({ step: STEP.GUESTS, at: Date.now() });
            scrollTo("#reserva");
          }}
        />
        <Intro />
        <Suites />
        <SunsetWindow />
        <Casa />
        <Cafe />
        <Arredores />
        <Reserva draft={draft} setDraft={setDraft} startStep={startStep} />
      </main>
      <Footer />
      <CursorLabel />
    </>
  );
}
