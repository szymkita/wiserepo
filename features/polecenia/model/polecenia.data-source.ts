import type { SpolkaId } from "@/features/shared/model/spolki.types";
import type { Polecenie } from "./polecenia.types";
import { mockPolecenia } from "./polecenia.mock";

const poleceniaById = new Map(mockPolecenia.map((p) => [p.id, p]));
const TERMINAL_STATUSES = new Set(["wygrana", "odrzucone"]);

export function getPolecenia(spolkaFilter?: SpolkaId | "all"): Polecenie[] {
  if (!spolkaFilter || spolkaFilter === "all" || spolkaFilter === "wisegroup") {
    return mockPolecenia;
  }
  return mockPolecenia.filter(
    (p) => p.spolkaZrodlowa === spolkaFilter || p.spolkaDocelowa === spolkaFilter
  );
}

export function getPolecenieById(id: string): Polecenie | undefined {
  return poleceniaById.get(id);
}

export function getPoleceniaDlaKlienta(klientId: string): Polecenie[] {
  return mockPolecenia.filter((p) => p.klientId === klientId);
}

export function getPoleceniaDlaPracownika(pracownikId: string): Polecenie[] {
  return mockPolecenia.filter((p) => p.polecajacyId === pracownikId);
}

export function getPoleceniaStats() {
  let aktywneCount = 0;
  let przekierowaniaCount = 0;
  let wygraneTotal = 0;
  let wygraneAktywne = 0;
  let wygranePrzekierowania = 0;
  let wToku = 0;

  for (const p of mockPolecenia) {
    const isAktywne = p.typ === "aktywne";
    const isPrzekierowanie = p.typ === "przekierowanie";
    const isWygrana = p.status === "wygrana";

    if (isAktywne) aktywneCount++;
    if (isPrzekierowanie) przekierowaniaCount++;
    if (isWygrana) wygraneTotal++;
    if (isAktywne && isWygrana) wygraneAktywne++;
    if (isPrzekierowanie && isWygrana) wygranePrzekierowania++;
    if (!TERMINAL_STATUSES.has(p.status)) wToku++;
  }

  const total = mockPolecenia.length;

  return {
    total,
    aktywneCount,
    przekierowaniaCount,
    conversionRate: total > 0 ? Math.round((wygraneTotal / total) * 100) : 0,
    conversionAktywne: aktywneCount > 0 ? Math.round((wygraneAktywne / aktywneCount) * 100) : 0,
    conversionPrzekierowania: przekierowaniaCount > 0 ? Math.round((wygranePrzekierowania / przekierowaniaCount) * 100) : 0,
    wToku,
  };
}
