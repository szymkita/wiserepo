export const SPOLKI = [
  "sellwise",
  "adwise",
  "hirewise",
  "letsautomate",
  "finerto",
  "wisegroup",
] as const;

export type SpolkaId = (typeof SPOLKI)[number];

export type CrmSystem = "livespace" | "pipedrive" | "hubspot" | "";

export interface SpolkaConfig {
  id: SpolkaId;
  name: string;
  shortName: string;
  color: string;
  crm: CrmSystem;
  description: string;
}

export const SPOLKA_CONFIG: Record<SpolkaId, SpolkaConfig> = {
  sellwise: {
    id: "sellwise",
    name: "SellWise",
    shortName: "SW",
    color: "#3B82F6",
    crm: "livespace",
    description: "Doradztwo w mądrym wzroście",
  },
  adwise: {
    id: "adwise",
    name: "AdWise",
    shortName: "AW",
    color: "#F59E0B",
    crm: "livespace",
    description: "Agencja marketingu B2B",
  },
  hirewise: {
    id: "hirewise",
    name: "HireWise",
    shortName: "HW",
    color: "#10B981",
    crm: "livespace",
    description: "Agencja HR skupiona na kompetencjach",
  },
  letsautomate: {
    id: "letsautomate",
    name: "Let's Automate",
    shortName: "LA",
    color: "#6fd180",
    crm: "pipedrive",
    description: "Wdrożenia automatyzacji procesów i AI",
  },
  finerto: {
    id: "finerto",
    name: "Finerto",
    shortName: "FN",
    color: "#8B5CF6",
    crm: "hubspot",
    description: "Prawo, podatki i finanse",
  },
  wisegroup: {
    id: "wisegroup",
    name: "WiseGroup",
    shortName: "WG",
    color: "#111827",
    crm: "",
    description: "Łączymy siły dla mądrego wzrostu",
  },
};

export const SPOLKI_BEZ_WISEGROUP = SPOLKI.filter(
  (s) => s !== "wisegroup"
) as readonly Exclude<SpolkaId, "wisegroup">[];

export type SpolkaOperacyjna = Exclude<SpolkaId, "wisegroup">;

export type ViewMode = "moj-system" | "widok-wspolny";

export function getSpolkaConfig(id: SpolkaId): SpolkaConfig {
  return SPOLKA_CONFIG[id];
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
