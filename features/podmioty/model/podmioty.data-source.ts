import type { Podmiot, OsobaKontaktowa, PodmiotWithRelations } from "./podmioty.types";
import { mockPodmioty, mockOsobyKontaktowe } from "./podmioty.mock";
import { mockZgloszenia } from "@/features/zgloszenia/model/zgloszenia.mock";
import { mockProjekty } from "@/features/projekty/model/projekty.mock";

const podmiotyById = new Map(mockPodmioty.map((p) => [p.id, p]));
const podmiotyByNip = new Map(mockPodmioty.map((p) => [p.nip, p]));
const osobyById = new Map(mockOsobyKontaktowe.map((o) => [o.id, o]));

export function getPodmioty(): Podmiot[] {
  return mockPodmioty;
}

export function getPodmiotById(id: string): Podmiot | undefined {
  return podmiotyById.get(id);
}

export function getPodmiotByNip(nip: string): Podmiot | undefined {
  return podmiotyByNip.get(nip);
}

export function getPodmiotyByStatus(status: string): Podmiot[] {
  return mockPodmioty.filter((p) => p.status === status);
}

export function getPodmiotyBySpolka(spolka: string): Podmiot[] {
  return mockPodmioty.filter((p) => p.spolka === spolka);
}

export function getOsobyKontaktowe(podmiotId: string): OsobaKontaktowa[] {
  return mockOsobyKontaktowe.filter((o) => o.podmiotId === podmiotId);
}

export function getOsobaKontaktowaById(id: string): OsobaKontaktowa | undefined {
  return osobyById.get(id);
}

export function getAllOsobyKontaktowe(): OsobaKontaktowa[] {
  return mockOsobyKontaktowe;
}

export function getPodmiotyWithRelations(spolkaFilter?: string): PodmiotWithRelations[] {
  return mockPodmioty.map((p) => ({
    ...p,
    osobyKontaktowe: getOsobyKontaktowe(p.id),
    zgloszenCount: mockZgloszenia.filter((z) => z.podmiotId === p.id && (!spolkaFilter || z.spolka === spolkaFilter)).length,
    projektCount: mockProjekty.filter((pr) => pr.podmiotId === p.id && (!spolkaFilter || pr.spolka === spolkaFilter)).length,
  }));
}

export function getPodmiotyKlienciCount(): number {
  return mockPodmioty.filter((p) => p.status === "klient").length;
}

export function getPodmiotyCrossSellCount(): number {
  return mockPodmioty.filter((p) => p.wspolneZSpolkami.length > 0).length;
}
