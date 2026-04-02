import type { SpolkaId } from "@/features/shared/model/spolki.types";
import type { Projekt } from "./projekty.types";
import { mockProjekty } from "./projekty.mock";

const projektyById = new Map(mockProjekty.map((p) => [p.id, p]));

export function getProjekty(spolkaFilter?: SpolkaId | "all"): Projekt[] {
  if (!spolkaFilter || spolkaFilter === "all" || spolkaFilter === "wisegroup") {
    return mockProjekty;
  }
  return mockProjekty.filter((p) => p.spolka === spolkaFilter);
}

export function getProjektById(id: string): Projekt | undefined {
  return projektyById.get(id);
}

export function getProjektyDlaPodmiotu(podmiotId: string, spolkaFilter?: SpolkaId): Projekt[] {
  return mockProjekty.filter((p) => {
    if (p.podmiotId !== podmiotId) return false;
    if (spolkaFilter && p.spolka !== spolkaFilter) return false;
    return true;
  });
}

export function getProjektyDlaWykonawcy(wykonawcaId: string): Projekt[] {
  return mockProjekty.filter((p) => p.wykonawcaIds.includes(wykonawcaId));
}

export function getProjektyDlaUslugi(uslugaId: string): Projekt[] {
  return mockProjekty.filter((p) => p.uslugaIds.includes(uslugaId));
}

export function getAktywneProjekty(): Projekt[] {
  return mockProjekty.filter((p) => p.status === "aktywny");
}
