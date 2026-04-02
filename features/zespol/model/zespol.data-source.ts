import type { SpolkaOperacyjna } from "@/features/shared/model/spolki.types";
import type { Pracownik } from "./zespol.types";
import { mockPracownicy } from "./zespol.mock";

const pracownicyById = new Map(mockPracownicy.map((p) => [p.id, p]));

export function getPracownicy(): Pracownik[] {
  return mockPracownicy;
}

export function getPracownikById(id: string): Pracownik | undefined {
  return pracownicyById.get(id);
}

export function getPracownicyBySpolka(spolka: SpolkaOperacyjna): Pracownik[] {
  return mockPracownicy.filter((p) => p.spolka === spolka);
}

export function getHandlowcy(spolka?: SpolkaOperacyjna): Pracownik[] {
  return mockPracownicy.filter(
    (p) => p.role.includes("handlowiec") && (!spolka || p.spolka === spolka)
  );
}

export function getWykonawcy(spolka?: SpolkaOperacyjna): Pracownik[] {
  return mockPracownicy.filter(
    (p) => p.role.includes("wykonawca") && (!spolka || p.spolka === spolka)
  );
}

export function getPracownikFullName(id: string): string {
  const p = pracownicyById.get(id);
  return p ? `${p.imie} ${p.nazwisko}` : "—";
}
