import { z } from "zod";
import type { SpolkaOperacyjna } from "@/features/shared/model/spolki.types";

export const pracownikRolaSchema = z.enum(["handlowiec", "wykonawca", "wisegroup-hub"]);
export type PracownikRola = z.infer<typeof pracownikRolaSchema>;

export const PRACOWNIK_ROLA_LABELS: Record<PracownikRola, string> = {
  handlowiec: "Handlowiec",
  wykonawca: "Wykonawca",
  "wisegroup-hub": "WiseGroup Hub",
};

export const pracownikSchema = z.object({
  id: z.string(),
  imie: z.string().min(1, "Imię jest wymagane"),
  nazwisko: z.string().min(1, "Nazwisko jest wymagane"),
  email: z.string().email("Nieprawidłowy email"),
  telefon: z.string().min(1, "Telefon jest wymagany"),
  spolka: z.enum(["sellwise", "adwise", "hirewise", "letsautomate", "finerto"]),
  role: z.array(pracownikRolaSchema).min(1, "Wybierz co najmniej jedną rolę"),
  stanowisko: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export type Pracownik = z.infer<typeof pracownikSchema>;

export const pracownikFormSchema = pracownikSchema.omit({ id: true });
export type PracownikFormValues = z.infer<typeof pracownikFormSchema>;

export interface PracownikWithRelations extends Pracownik {
  spolkaName: string;
}
