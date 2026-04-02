import { z } from "zod";

export const typUslugi = ["jednorazowa", "abonamentowa"] as const;

export const uslugaSchema = z.object({
  id: z.string(),
  nazwa: z.string().min(1, "Nazwa usługi jest wymagana"),
  spolka: z.enum(["sellwise", "adwise", "hirewise", "letsautomate", "finerto"]),
  typ: z.enum(typUslugi),
  opis: z.string().optional(),
});

export type Usluga = z.infer<typeof uslugaSchema>;

export const uslugaFormSchema = uslugaSchema.omit({ id: true });
export type UslugaFormValues = z.infer<typeof uslugaFormSchema>;

export const TYP_USLUGI_LABELS: Record<(typeof typUslugi)[number], string> = {
  jednorazowa: "Jednorazowa",
  abonamentowa: "Abonamentowa",
};

export interface AktywnaUsluga {
  uslugaId: string;
  projektId: string;
  podmiotId: string;
}
