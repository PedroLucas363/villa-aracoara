import type { SuiteId } from "../data/content";

export type BookingDraft = {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  suite: SuiteId | null;
};

export const GUEST_LIMITS = { adultsMin: 1, adultsMax: 6, childrenMax: 4 } as const;

export const EMPTY_DRAFT: BookingDraft = { checkIn: "", checkOut: "", adults: 2, children: 0, suite: null };

/** Data local em ISO (yyyy-mm-dd), sem passar por UTC. */
export function toISODate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayISO() {
  return toISODate(new Date());
}

export function addDaysISO(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  return toISODate(new Date(y, m - 1, d + days));
}

export function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const [y1, m1, d1] = checkIn.split("-").map(Number);
  const [y2, m2, d2] = checkOut.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
}

const FMT = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", weekday: "short" });

export function formatDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return FMT.format(new Date(y, m - 1, d)).replace(/\./g, "");
}

export type DateErrors = { checkIn?: string; checkOut?: string };

export function validateDates(draft: Pick<BookingDraft, "checkIn" | "checkOut">): DateErrors {
  const errors: DateErrors = {};
  const today = todayISO();
  if (!draft.checkIn) errors.checkIn = "Escolha a data de chegada.";
  else if (draft.checkIn < today) errors.checkIn = "A chegada não pode ser antes de hoje.";
  if (!draft.checkOut) errors.checkOut = "Escolha a data de saída.";
  else if (draft.checkIn && draft.checkOut <= draft.checkIn) errors.checkOut = "A saída precisa ser depois da chegada.";
  else if (draft.checkIn && nightsBetween(draft.checkIn, draft.checkOut) > 30)
    errors.checkOut = "Para estadias acima de 30 noites, fale direto com a pousada.";
  return errors;
}

export function guestsLabel(adults: number, children: number) {
  const a = `${adults} ${adults === 1 ? "adulto" : "adultos"}`;
  if (!children) return a;
  return `${a}, ${children} ${children === 1 ? "criança" : "crianças"}`;
}
