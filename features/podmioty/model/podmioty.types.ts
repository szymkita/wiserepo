import { z } from "zod";

export const statusPodmiotu = ["lead", "klient", "byly_klient"] as const;

export const STATUS_PODMIOTU_LABELS: Record<(typeof statusPodmiotu)[number], string> = {
  lead: "Lead",
  klient: "Klient",
  byly_klient: "Były klient",
};

export const osobaKontaktowaSchema = z.object({
  id: z.string(),
  podmiotId: z.string(),
  imie: z.string().min(1, "Imię jest wymagane"),
  nazwisko: z.string().min(1, "Nazwisko jest wymagane"),
  email: z.string().email("Nieprawidłowy email").optional().or(z.literal("")),
  telefon: z.string().optional(),
  stanowisko: z.string().optional(),
});

export type OsobaKontaktowa = z.infer<typeof osobaKontaktowaSchema>;

export const osobaKontaktowaFormSchema = osobaKontaktowaSchema.omit({
  id: true,
});
export type OsobaKontaktowaFormValues = z.infer<
  typeof osobaKontaktowaFormSchema
>;

export const wspolnyKlientSchema = z.object({
  spolka: z.string(),
  status: z.string(),
  dataOd: z.string(),
});

export type WspolnyKlient = z.infer<typeof wspolnyKlientSchema>;

export const podmiotSchema = z.object({
  id: z.string(),
  nip: z.string().min(10, "NIP musi mieć 10 cyfr").max(10),
  nazwa: z.string().min(1, "Nazwa jest wymagana"),
  adres: z.string().optional(),
  miasto: z.string().optional(),
  branza: z.string().optional(),
  status: z.enum(statusPodmiotu),
  spolka: z.enum(["sellwise", "adwise", "hirewise", "letsautomate", "finerto"]),
  wspolneZSpolkami: z.array(wspolnyKlientSchema),
});

export type Podmiot = z.infer<typeof podmiotSchema>;

export interface PodmiotWithRelations extends Podmiot {
  osobyKontaktowe: OsobaKontaktowa[];
  zgloszenCount: number;
  projektCount: number;
}
