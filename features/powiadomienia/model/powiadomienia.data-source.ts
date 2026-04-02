import type { Powiadomienie } from "./powiadomienia.types";
import { mockPowiadomienia } from "./powiadomienia.mock";

export function getPowiadomienia(spolka: string): Powiadomienie[] {
  return mockPowiadomienia
    .filter((p) => p.spolka === spolka)
    .sort((a, b) => b.data.localeCompare(a.data));
}

export function getNieprzeczytaneCount(spolka: string): number {
  return mockPowiadomienia.filter((p) => p.spolka === spolka && !p.przeczytane).length;
}
