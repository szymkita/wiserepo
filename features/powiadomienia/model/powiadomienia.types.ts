export type TypPowiadomienia = "match" | "polecenie" | "zmiana_statusu";

export interface Powiadomienie {
  id: string;
  typ: TypPowiadomienia;
  tresc: string;
  data: string;
  przeczytane: boolean;
  spolka: string;
  /** link do powiązanego ekranu */
  href: string;
}

export const TYP_LABELS: Record<TypPowiadomienia, string> = {
  match: "Wspólny klient",
  polecenie: "Polecenie",
  zmiana_statusu: "Zmiana statusu",
};
