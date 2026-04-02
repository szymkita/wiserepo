import type { SpolkaId } from "@/features/shared/model/spolki.types";
import type { Usluga, AktywnaUsluga } from "./uslugi.types";
import { mockUslugi } from "./uslugi.mock";
import { mockProjekty } from "@/features/projekty/model/projekty.mock";

const uslugiById = new Map(mockUslugi.map((u) => [u.id, u]));

export function getUslugi(spolkaFilter?: SpolkaId | "all"): Usluga[] {
  if (!spolkaFilter || spolkaFilter === "all" || spolkaFilter === "wisegroup") {
    return mockUslugi;
  }
  return mockUslugi.filter((u) => u.spolka === spolkaFilter);
}

export function getUslugaById(id: string): Usluga | undefined {
  return uslugiById.get(id);
}

export function getAktywneUslugi(spolkaFilter?: SpolkaId | "all"): AktywnaUsluga[] {
  const result: AktywnaUsluga[] = [];
  for (const projekt of mockProjekty) {
    if (projekt.status !== "aktywny") continue;
    if (spolkaFilter && spolkaFilter !== "all" && spolkaFilter !== "wisegroup" && projekt.spolka !== spolkaFilter) {
      continue;
    }
    for (const uslugaId of projekt.uslugaIds) {
      result.push({
        uslugaId,
        projektId: projekt.id,
        podmiotId: projekt.podmiotId,
      });
    }
  }
  return result;
}

export function getUslugiDlaSpolki(spolka: string): Usluga[] {
  return mockUslugi.filter((u) => u.spolka === spolka);
}
