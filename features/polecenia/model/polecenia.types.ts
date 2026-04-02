import { z } from "zod";

export const typPolecenia = ["aktywne", "przekierowanie"] as const;
export const statusPolecenia = [
  "zgloszenie_utworzone",
  "zakwalifikowane",
  "przeslane_do_crm",
  "wygrana",
  "odrzucone",
] as const;

export const polecenieSchema = z.object({
  id: z.string(),
  data: z.string(),
  typ: z.enum(typPolecenia),
  polecajacyId: z.string(),
  spolkaZrodlowa: z.enum(["sellwise", "adwise", "hirewise", "letsautomate", "finerto"]),
  spolkaDocelowa: z.enum(["sellwise", "adwise", "hirewise", "letsautomate", "finerto"]),
  podmiotId: z.string(),
  klientId: z.string().nullable(),
  opis: z.string().min(1, "Opis potrzeby jest wymagany"),
  zrodloZgloszenieId: z.string().nullable(),
  zgloszenieDoceloweId: z.string(),
  status: z.enum(statusPolecenia),
  prowizjaNalezna: z.boolean(),
});

export type Polecenie = z.infer<typeof polecenieSchema>;

export const polecenieFormSchema = z.object({
  typ: z.enum(typPolecenia),
  spolkaDocelowa: z.enum(["sellwise", "adwise", "hirewise", "letsautomate", "finerto"]),
  podmiotId: z.string().min(1, "Wybierz podmiot"),
  opis: z.string().min(1, "Opis potrzeby jest wymagany"),
  zrodloZgloszenieId: z.string().optional(),
  prowizjaNalezna: z.boolean(),
});

export type PolecenieFormValues = z.infer<typeof polecenieFormSchema>;

export const TYP_POLECENIA_LABELS: Record<(typeof typPolecenia)[number], string> = {
  aktywne: "Aktywne",
  przekierowanie: "Przekierowanie",
};

export const STATUS_POLECENIA_LABELS: Record<(typeof statusPolecenia)[number], string> = {
  zgloszenie_utworzone: "Zgłoszenie utworzone",
  zakwalifikowane: "Zakwalifikowane",
  przeslane_do_crm: "Przesłane do CRM",
  wygrana: "Wygrana",
  odrzucone: "Odrzucone",
};
