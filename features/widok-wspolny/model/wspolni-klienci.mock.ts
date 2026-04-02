import type { WspolnyKlient } from "./wspolni-klienci.types";

export const mockWspolniKlienciRaw: WspolnyKlient[] = [
  {
    nip: "1234567890",
    nazwaFirmy: "TechVenture Sp. z o.o.",
    miasto: "Warszawa",
    mojaSpolka: {
      spolka: "sellwise",
      status: "klient",
      aktywneProjektyCount: 1,
      dataOd: "2024-06-15",
    },
    inneSpolki: [
      {
        spolka: "letsautomate",
        status: "klient",
        zgloszenia: [
          { numer: "ZGL-2024-003", data: "2024-10-15", status: "jest klientem", zrodlo: "polecenie" },
        ],
        osobyKontaktowe: [
          { imie: "Anna", nazwisko: "Maj", stanowisko: "CTO", email: "a.maj@techventure.pl" },
        ],
        projekty: [
          {
            nazwa: "Automatyzacja CRM HubSpot",
            zakres: "Automatyzacja workflow w HubSpot, integracja z ERP",
            wykonawcy: ["Tomasz Dąbrowski"],
            uslugi: [{ nazwa: "Wdrożenie automatyzacji", typ: "jednorazowa" }],
            status: "aktywny",
            dataOd: "2024-11-01",
          },
          {
            nazwa: "Integracja systemów ERP",
            zakres: "Integracja SAP z systemem magazynowym i CRM",
            wykonawcy: ["Tomasz Dąbrowski", "Marta Kowalczyk"],
            uslugi: [{ nazwa: "Integracja systemów", typ: "jednorazowa" }],
            status: "aktywny",
            dataOd: "2025-02-01",
          },
        ],
        dataOd: "2024-11-01",
      },
      {
        spolka: "hirewise",
        status: "w sprzedaży",
        zgloszenia: [
          { numer: "ZGL-2025-002", data: "2025-01-20", status: "w sprzedaży", zrodlo: "polecenie" },
        ],
        osobyKontaktowe: [],
        projekty: [],
        dataOd: "2025-01-20",
      },
    ],
    matchTimeline: [
      { spolka: "letsautomate", data: "2024-10-15" },
      { spolka: "hirewise", data: "2025-01-20" },
    ],
  },
  {
    nip: "9876543210",
    nazwaFirmy: "ProBuild S.A.",
    miasto: "Kraków",
    mojaSpolka: {
      spolka: "sellwise",
      status: "klient",
      aktywneProjektyCount: 1,
      dataOd: "2024-09-01",
    },
    inneSpolki: [
      {
        spolka: "finerto",
        status: "w sprzedaży",
        zgloszenia: [
          { numer: "ZGL-2025-011", data: "2025-02-13", status: "w sprzedaży", zrodlo: "polecenie" },
        ],
        osobyKontaktowe: [
          { imie: "Tomasz", nazwisko: "Sikora", stanowisko: "Prezes Zarządu", email: "t.sikora@probuild.pl" },
        ],
        projekty: [],
        dataOd: "2025-02-13",
      },
    ],
    matchTimeline: [
      { spolka: "finerto", data: "2025-02-13" },
    ],
  },
  {
    nip: "5544332211",
    nazwaFirmy: "GreenEnergy Solutions S.A.",
    miasto: "Gdańsk",
    mojaSpolka: {
      spolka: "adwise",
      status: "klient",
      aktywneProjektyCount: 1,
      dataOd: "2025-01-10",
    },
    inneSpolki: [
      {
        spolka: "finerto",
        status: "w sprzedaży",
        zgloszenia: [
          { numer: "ZGL-2025-012", data: "2025-02-20", status: "w sprzedaży", zrodlo: "polecenie" },
        ],
        osobyKontaktowe: [
          { imie: "Paweł", nazwisko: "Kaczmarek", stanowisko: "VP Sales", email: "p.kaczmarek@greenenergy.pl" },
        ],
        projekty: [],
        dataOd: "2025-02-20",
      },
    ],
    matchTimeline: [
      { spolka: "finerto", data: "2025-02-20" },
    ],
  },
  {
    nip: "3322114455",
    nazwaFirmy: "DataStream Sp. z o.o.",
    miasto: "Wrocław",
    mojaSpolka: {
      spolka: "letsautomate",
      status: "klient",
      aktywneProjektyCount: 0,
      dataOd: "2024-11-01",
    },
    inneSpolki: [
      {
        spolka: "hirewise",
        status: "w sprzedaży",
        zgloszenia: [
          { numer: "ZGL-2025-002", data: "2025-01-20", status: "w sprzedaży", zrodlo: "polecenie" },
        ],
        osobyKontaktowe: [],
        projekty: [],
        dataOd: "2025-01-20",
      },
      {
        spolka: "sellwise",
        status: "klient",
        zgloszenia: [
          { numer: "ZGL-2025-010", data: "2025-02-18", status: "jest klientem", zrodlo: "polecenie" },
        ],
        osobyKontaktowe: [
          { imie: "Natalia", nazwisko: "Szymańska", stanowisko: "Head of Data", email: "n.szymanska@datastream.pl" },
        ],
        projekty: [
          {
            nazwa: "Konsultacje sprzedażowe",
            wykonawcy: ["Jan Kowalski"],
            uslugi: [{ nazwa: "Doradztwo sprzedażowe", typ: "abonamentowa" }],
            status: "aktywny",
            dataOd: "2025-02-18",
          },
        ],
        dataOd: "2025-02-18",
      },
    ],
    matchTimeline: [
      { spolka: "hirewise", data: "2025-01-20" },
      { spolka: "sellwise", data: "2025-02-18" },
    ],
  },
  {
    nip: "1122334455",
    nazwaFirmy: "NovaTrade Sp. z o.o.",
    miasto: "Poznań",
    mojaSpolka: {
      spolka: "finerto",
      status: "klient",
      aktywneProjektyCount: 1,
      dataOd: "2025-02-01",
    },
    inneSpolki: [
      {
        spolka: "sellwise",
        status: "w sprzedaży",
        zgloszenia: [
          { numer: "ZGL-2025-006", data: "2025-02-12", status: "w sprzedaży", zrodlo: "polecenie" },
        ],
        osobyKontaktowe: [
          { imie: "Łukasz", nazwisko: "Duda", stanowisko: "Dyrektor Handlowy" },
        ],
        projekty: [],
        dataOd: "2025-02-12",
      },
    ],
    matchTimeline: [
      { spolka: "sellwise", data: "2025-02-12" },
    ],
  },
  {
    nip: "7799881122",
    nazwaFirmy: "SmartHR Polska Sp. z o.o.",
    miasto: "Warszawa",
    mojaSpolka: {
      spolka: "sellwise",
      status: "lead",
      aktywneProjektyCount: 0,
      dataOd: "2025-03-15",
    },
    inneSpolki: [
      {
        spolka: "letsautomate",
        status: "w sprzedaży",
        zgloszenia: [
          { numer: "ZGL-2025-016", data: "2025-03-10", status: "w sprzedaży", zrodlo: "pipedrive" },
        ],
        osobyKontaktowe: [],
        projekty: [],
        dataOd: "2025-03-10",
      },
    ],
    matchTimeline: [
      { spolka: "letsautomate", data: "2025-03-15" },
    ],
  },
];
