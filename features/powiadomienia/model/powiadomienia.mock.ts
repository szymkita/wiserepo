import type { Powiadomienie } from "./powiadomienia.types";

export const mockPowiadomienia: Powiadomienie[] = [
  // Matche
  {
    id: "pow-1",
    typ: "match",
    tresc: "Firma SmartHR Polska (NIP 7799881122) jest też w Let's Automate (status: w sprzedaży)",
    data: "2025-03-15",
    przeczytane: false,
    spolka: "sellwise",
    href: "/widok-wspolny/7799881122",
  },
  {
    id: "pow-2",
    typ: "match",
    tresc: "Firma TechVenture (NIP 1234567890) jest też w HireWise (status: w sprzedaży)",
    data: "2025-01-20",
    przeczytane: false,
    spolka: "sellwise",
    href: "/widok-wspolny/1234567890",
  },
  {
    id: "pow-3",
    typ: "match",
    tresc: "Firma DataStream (NIP 3322114455) jest też w SellWise (status: klient)",
    data: "2025-02-18",
    przeczytane: true,
    spolka: "letsautomate",
    href: "/widok-wspolny/3322114455",
  },

  // Polecenia
  {
    id: "pow-4",
    typ: "polecenie",
    tresc: "Nowe polecenie od SellWise: firma TechVenture — automatyzacja CRM",
    data: "2024-10-15",
    przeczytane: true,
    spolka: "letsautomate",
    href: "/polecenia",
  },
  {
    id: "pow-5",
    typ: "polecenie",
    tresc: "Nowe polecenie od Finerto: firma GreenEnergy — potrzebuje marketingu",
    data: "2025-02-20",
    przeczytane: false,
    spolka: "adwise",
    href: "/polecenia",
  },

  // Zmiany statusów
  {
    id: "pow-6",
    typ: "zmiana_statusu",
    tresc: "Firma TechVenture została klientem — możesz utworzyć projekt",
    data: "2024-06-15",
    przeczytane: true,
    spolka: "sellwise",
    href: "/podmioty/pod-1",
  },
  {
    id: "pow-7",
    typ: "zmiana_statusu",
    tresc: "Firma ProBuild została klientem — możesz utworzyć projekt",
    data: "2024-09-01",
    przeczytane: true,
    spolka: "sellwise",
    href: "/podmioty/pod-3",
  },
  {
    id: "pow-8",
    typ: "zmiana_statusu",
    tresc: "Firma SmartHR Polska — nowe zgłoszenie od Let's Automate (w sprzedaży)",
    data: "2025-03-15",
    przeczytane: false,
    spolka: "sellwise",
    href: "/zgloszenia",
  },
];
