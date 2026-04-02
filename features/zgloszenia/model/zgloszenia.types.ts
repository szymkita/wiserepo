import { z } from "zod";
import type { SpolkaOperacyjna } from "@/features/shared/model/spolki.types";

export const zrodloZgloszenia = [
  "formularz",
  "formularz_wisegroup",
  "telefon",
  "email",
  "polecenie",
  "hubspot",
  "pipedrive",
] as const;

export const statusZgloszenia = [
  "nowe",
  "spam",
  "odrzucone",
  "w_sprzedazy",
  "jest_klientem",
  "przegrane",
] as const;

export const notatkaSchema = z.object({
  id: z.string(),
  data: z.string(),
  autor: z.string(),
  tresc: z.string(),
});

export type Notatka = z.infer<typeof notatkaSchema>;

export const zgloszenieSchema = z.object({
  id: z.string(),
  numer: z.string(),
  data: z.string(),
  podmiotId: z.string().nullable(),
  osobaKontaktowaId: z.string().nullable(),
  zrodlo: z.enum(zrodloZgloszenia),
  spolka: z.enum(["sellwise", "adwise", "hirewise", "letsautomate", "finerto", "wisegroup"]).nullable(),
  handlowiecId: z.string().nullable(),
  status: z.enum(statusZgloszenia),
  notatki: z.array(notatkaSchema).optional(),
  polecenieId: z.string().nullable(),
  nip: z.string().nullable(),
  powod_odrzucenia: z.string().nullable(),
});

export type Zgloszenie = z.infer<typeof zgloszenieSchema>;

export const zgloszenieFormSchema = z.object({
  email: z.string().email("Nieprawidłowy email").optional().or(z.literal("")),
  telefon: z.string().optional(),
  wiadomosc: z.string().optional(),
  zrodlo: z.enum(["telefon", "email"]),
  handlowiecId: z.string().min(1, "Wybierz handlowca"),
});

export type ZgloszenieFormValues = z.infer<typeof zgloszenieFormSchema>;

export const ZRODLO_LABELS: Record<(typeof zrodloZgloszenia)[number], string> = {
  formularz: "Formularz",
  formularz_wisegroup: "Formularz WiseGroup",
  telefon: "Telefon",
  email: "Email",
  polecenie: "Polecenie",
  hubspot: "HubSpot",
  pipedrive: "Pipedrive",
};

export const STATUS_LABELS: Record<(typeof statusZgloszenia)[number], string> = {
  nowe: "Nowe",
  spam: "Spam",
  odrzucone: "Odrzucone",
  w_sprzedazy: "W sprzedaży",
  jest_klientem: "Jest klientem",
  przegrane: "Przegrane",
};
