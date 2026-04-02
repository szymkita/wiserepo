import type { SpolkaId } from "@/features/shared/model/spolki.types";
import type { Zgloszenie } from "./zgloszenia.types";
import { mockZgloszenia } from "./zgloszenia.mock";

const zgloszeniaById = new Map(mockZgloszenia.map((z) => [z.id, z]));

export function getZgloszenia(spolkaFilter?: SpolkaId | "all"): Zgloszenie[] {
  if (!spolkaFilter || spolkaFilter === "all" || spolkaFilter === "wisegroup") {
    return mockZgloszenia;
  }
  return mockZgloszenia.filter((z) => z.spolka === spolkaFilter);
}

export function getZgloszenieById(id: string): Zgloszenie | undefined {
  return zgloszeniaById.get(id);
}

export function getZgloszeniaDlaPodmiotu(podmiotId: string, spolkaFilter?: SpolkaId): Zgloszenie[] {
  return mockZgloszenia.filter((z) => {
    if (z.podmiotId !== podmiotId) return false;
    if (spolkaFilter && z.spolka !== spolkaFilter) return false;
    return true;
  });
}

export function getZgloszeniaDlaHandlowca(handlowiecId: string): Zgloszenie[] {
  return mockZgloszenia.filter((z) => z.handlowiecId === handlowiecId);
}

export function getZgloszeniaDlaPolecenia(polecenieId: string): Zgloszenie[] {
  return mockZgloszenia.filter((z) => z.polecenieId === polecenieId);
}

export function getZgloszeniaWSprzedazy(): Zgloszenie[] {
  return mockZgloszenia.filter((z) => z.status === "w_sprzedazy");
}

export function getNoweZgloszeniaTenMiesiac(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  let count = 0;
  for (const z of mockZgloszenia) {
    const d = new Date(z.data);
    if (d.getFullYear() === year && d.getMonth() === month) {
      count++;
    }
  }
  return count;
}

export type PodmiotHistoriaTyp =
  | "jest_klientem"
  | "w_sprzedazy"
  | "przegrane"
  | "odrzucone"
  | null;

export interface PodmiotHistoria {
  typ: PodmiotHistoriaTyp;
  inne: Zgloszenie[];
}

export function getHistoriaPodmiotu(zgloszenie: Zgloszenie): PodmiotHistoria {
  const empty: PodmiotHistoria = { typ: null, inne: [] };

  // Find other zgłoszenia for the same podmiot (by podmiotId or NIP)
  const inne = mockZgloszenia.filter((z) => {
    if (z.id === zgloszenie.id) return false;
    if (zgloszenie.podmiotId && z.podmiotId === zgloszenie.podmiotId) return true;
    if (zgloszenie.nip && z.nip === zgloszenie.nip) return true;
    return false;
  });

  if (inne.length === 0) return empty;

  // Priority: jest_klientem > w_sprzedazy > przegrane > odrzucone
  if (inne.some((z) => z.status === "jest_klientem")) {
    return { typ: "jest_klientem", inne };
  }
  if (inne.some((z) => z.status === "w_sprzedazy")) {
    return { typ: "w_sprzedazy", inne };
  }
  if (inne.some((z) => z.status === "przegrane")) {
    return { typ: "przegrane", inne };
  }
  if (inne.some((z) => z.status === "odrzucone")) {
    return { typ: "odrzucone", inne };
  }

  return empty;
}
