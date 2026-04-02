import { z } from "zod";

export const charakterProjektu = ["staly", "jednorazowy", "planowany"] as const;
export const statusProjektu = ["aktywny", "zakonczony"] as const;

export const projektSchema = z.object({
  id: z.string(),
  nazwa: z.string().min(1, "Nazwa projektu jest wymagana"),
  podmiotId: z.string(),
  spolka: z.enum(["sellwise", "adwise", "hirewise", "letsautomate", "finerto"]),
  charakter: z.enum(charakterProjektu),
  status: z.enum(statusProjektu),
  opiekunId: z.string(),
  wykonawcaIds: z.array(z.string()),
  osobyKontaktoweIds: z.array(z.string()),
  uslugaIds: z.array(z.string()),
  zakres: z.string().optional(),
  dataOd: z.string(),
  dataDo: z.string().nullable(),
});

export type Projekt = z.infer<typeof projektSchema>;

export const projektFormSchema = z.object({
  nazwa: z.string().min(1, "Nazwa projektu jest wymagana"),
  charakter: z.enum(charakterProjektu),
  podmiotId: z.string().min(1, "Wybierz firmę"),
  opiekunId: z.string().min(1, "Wybierz opiekuna"),
  uslugaIds: z.array(z.string()),
  wykonawcaIds: z.array(z.string()),
  osobyKontaktoweIds: z.array(z.string()),
  zakres: z.string().optional(),
  dataOd: z.string().min(1, "Data rozpoczęcia jest wymagana"),
  dataDo: z.string().optional(),
});

export type ProjektFormValues = z.infer<typeof projektFormSchema>;

export const CHARAKTER_LABELS: Record<(typeof charakterProjektu)[number], string> = {
  staly: "Stały",
  jednorazowy: "Jednorazowy",
  planowany: "Planowany",
};

export const STATUS_PROJEKTU_LABELS: Record<(typeof statusProjektu)[number], string> = {
  aktywny: "Aktywny",
  zakonczony: "Zakończony",
};
