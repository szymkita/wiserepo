"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { PageHeader } from "@/features/shared/components/page-header";
import { StatusBadge } from "@/features/shared/components/status-badge";
import { SpolkaBadge } from "@/components/layout/spolka-badge";
import {
  InfoIcon,
  AlertTriangleIcon,
  ChevronRightIcon,
  Building2Icon,
  CalendarIcon,
  FileTextIcon,
  Loader2Icon,
  UserCheckIcon,
  InboxIcon,
} from "lucide-react";

/* ─── Etapy Livespace (po polsku) ─── */

const LS_STAGES = [
  "Nowy lead",
  "Kontakt",
  "Analiza potrzeb",
  "Oferta",
  "Klient",
  "Zamknięty",
  "Stracony",
] as const;
type LsStage = (typeof LS_STAGES)[number];

const STAGE_TO_STATUS: Record<LsStage, string> = {
  "Nowy lead": "nowe",
  Kontakt: "w_sprzedazy",
  "Analiza potrzeb": "w_sprzedazy",
  Oferta: "w_sprzedazy",
  Klient: "jest_klientem",
  Zamknięty: "jest_klientem",
  Stracony: "przegrane",
};

const STAGE_VARIANT: Record<
  LsStage,
  "default" | "info" | "success" | "destructive" | "muted"
> = {
  "Nowy lead": "default",
  Kontakt: "info",
  "Analiza potrzeb": "info",
  Oferta: "info",
  Klient: "success",
  Zamknięty: "muted",
  Stracony: "destructive",
};

/* ─── Deal type ─── */

type DealSource = "polecenie" | "formularz" | "telefon" | "email";
type Spolka = "sellwise" | "adwise" | "hirewise";

interface LsDeal {
  id: string;
  name: string;
  nip: string;
  email: string;
  stage: LsStage;
  notatkaWG: string;
  crossSell: { found: boolean; spolki: string[] };
  data: string;
  zglNumer: string;
  source: DealSource;
  spolka: Spolka;
  handlowiec: string;
}

/* ─── Mock deals — 7 scenariuszy ─── */

const INITIAL_DEALS: LsDeal[] = [
  {
    id: "ls-deal-3001",
    name: "TechVenture Sp. z o.o.",
    nip: "1234567890",
    email: "ceo@techventure.pl",
    stage: "Oferta",
    notatkaWG:
      "Firma zainteresowana audytem procesu sprzedaży i szkoleniami. Cross-sell: podmiot zgłosił się też do Let's Automate.",
    crossSell: { found: true, spolki: ["Let's Automate"] },
    data: "2024-05-10",
    zglNumer: "ZGL-2024-001",
    source: "formularz",
    spolka: "sellwise",
    handlowiec: "Jan Kowalski",
  },
  {
    id: "ls-deal-3002",
    name: "ProBuild S.A.",
    nip: "9876543210",
    email: "biuro@probuild.pl",
    stage: "Klient",
    notatkaWG:
      "Klient kupił wstępną konsultację sprzedażową. Karta klienta utworzona w WiseGroup. Trwa upsell na pełne szkolenie zespołu.",
    crossSell: { found: false, spolki: [] },
    data: "2024-08-20",
    zglNumer: "ZGL-2024-002",
    source: "telefon",
    spolka: "sellwise",
    handlowiec: "Marek Wiśniewski",
  },
  {
    id: "ls-deal-3003",
    name: "Nowa firma — brak NIP",
    nip: "—",
    email: "kontakt@nowafirma.pl",
    stage: "Nowy lead",
    notatkaWG:
      "Zgłoszenie z formularza — brak NIP. Wymaga uzupełnienia danych przed kwalifikacją.",
    crossSell: { found: false, spolki: [] },
    data: "2025-02-01",
    zglNumer: "ZGL-2025-003",
    source: "formularz",
    spolka: "sellwise",
    handlowiec: "Jan Kowalski",
  },
  {
    id: "ls-deal-3004",
    name: "NovaTrade Sp. z o.o.",
    nip: "1122334455",
    email: "handel@novatrade.pl",
    stage: "Analiza potrzeb",
    notatkaWG:
      "Polecenie od Finerto. NovaTrade potrzebuje strategii sprzedaży.",
    crossSell: { found: true, spolki: ["Finerto"] },
    data: "2025-02-12",
    zglNumer: "ZGL-2025-006",
    source: "polecenie",
    spolka: "sellwise",
    handlowiec: "Jan Kowalski",
  },
  {
    id: "ls-deal-3005",
    name: "GreenMedia Sp. z o.o.",
    nip: "5544332211",
    email: "marketing@greenmedia.pl",
    stage: "Zamknięty",
    notatkaWG:
      "Proces sprzedaży zakończony. Zgłoszenie zamknięte w WiseGroup. Klient obsługiwany w ramach projektu kampanii.",
    crossSell: { found: false, spolki: [] },
    data: "2024-12-01",
    zglNumer: "ZGL-2024-004",
    source: "email",
    spolka: "adwise",
    handlowiec: "Anna Nowak",
  },
  {
    id: "ls-deal-3006",
    name: "MicroTech Sp. z o.o.",
    nip: "6677889900",
    email: "hr@microtech.pl",
    stage: "Stracony",
    notatkaWG:
      "Firma zbyt mała — nie pasuje do profilu klientów. Odrzucone.",
    crossSell: { found: false, spolki: [] },
    data: "2025-02-10",
    zglNumer: "ZGL-2025-005",
    source: "formularz",
    spolka: "adwise",
    handlowiec: "Anna Nowak",
  },
  {
    id: "ls-deal-3007",
    name: "DataStream Sp. z o.o.",
    nip: "3322114455",
    email: "rekrutacja@datastream.pl",
    stage: "Kontakt",
    notatkaWG:
      "Polecenie od Let's Automate. Potrzebują rekrutacji data engineerów. Cross-sell: podmiot znany w Let's Automate.",
    crossSell: { found: true, spolki: ["Let's Automate"] },
    data: "2025-01-20",
    zglNumer: "ZGL-2025-002",
    source: "polecenie",
    spolka: "hirewise",
    handlowiec: "Katarzyna Zielińska",
  },
];

/* ─── Source labels ─── */

const SOURCE_LABELS: Record<DealSource, string> = {
  polecenie: "Polecenie",
  formularz: "Formularz",
  telefon: "Telefon",
  email: "Email",
};

const SOURCE_COLORS: Record<DealSource, string> = {
  polecenie:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  formularz:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  telefon:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  email: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

/* ─── Component ─── */

export default function SymulatorLivespacePage() {
  const [deals, setDeals] = useState<LsDeal[]>(INITIAL_DEALS);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const selectedDeal = deals.find((d) => d.id === selectedDealId) ?? null;

  const handleStageChange = async (dealId: string, newStage: LsStage) => {
    setUpdatingId(dealId);
    await new Promise((r) => setTimeout(r, 400));
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Livespace — Symulator (SellWise / AdWise / HireWise)"
        description="Symuluje widok CRM Livespace dla spółek SellWise, AdWise i HireWise. Szanse sprzedażowe pushowane z WiseGroup Hub."
      />

      {/* Info banner */}
      <div className="rounded-lg border border-blue-200/70 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20 p-4">
        <div className="flex items-start gap-3">
          <InfoIcon className="size-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Przepływ dwukierunkowy:</strong> System WiseGroup pushuje
            leady do Livespace gdy handlowiec kwalifikuje zgłoszenie. Zmiana
            etapu w Livespace synchronizuje status zgłoszenia w WiseGroup.
          </p>
        </div>
      </div>

      {/* Deal list */}
      {deals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <InboxIcon className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              Brak szans w Livespace
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              Szanse przekazane z WiseGroup ({deals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {deals.map((deal) => (
                <button
                  key={deal.id}
                  type="button"
                  className="w-full px-6 py-4 text-left hover:bg-muted/50 transition-colors flex items-center gap-4 group"
                  onClick={() => setSelectedDealId(deal.id)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{deal.name}</p>
                      {deal.crossSell.found && (
                        <AlertTriangleIcon className="size-3.5 text-amber-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="font-mono">NIP: {deal.nip}</span>
                      <span className="tabular-nums">{deal.data}</span>
                      <span className="font-mono text-[11px]">{deal.zglNumer}</span>
                      <span>{deal.handlowiec}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${SOURCE_COLORS[deal.source]}`}
                    >
                      {SOURCE_LABELS[deal.source]}
                    </span>
                    <SpolkaBadge spolka={deal.spolka} />
                    <StatusBadge
                      label={deal.stage}
                      variant={STAGE_VARIANT[deal.stage]}
                    />
                    <ChevronRightIcon className="size-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stage mapping card */}
      <Card className="border-dashed">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <InfoIcon className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-muted-foreground">
              <p className="font-medium text-foreground/70">
                Mapowanie etapów Livespace → WiseGroup
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 font-mono text-[11px]">
                {LS_STAGES.map((s) => (
                  <p key={s}>
                    <span className="text-foreground/60">{s}</span> →{" "}
                    {STAGE_TO_STATUS[s]}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Detail Sheet ─── */}
      <Sheet
        open={!!selectedDeal}
        onOpenChange={(open) => {
          if (!open) setSelectedDealId(null);
        }}
      >
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          {selectedDeal && (
            <>
              <SheetHeader>
                <SheetTitle className="text-base">
                  {selectedDeal.name}
                </SheetTitle>
                <SheetDescription className="font-mono text-xs">
                  {selectedDeal.id} · {selectedDeal.zglNumer}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 px-6 py-6">
                {/* Dane firmy */}
                <section className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Building2Icon className="size-3.5" />
                    Dane firmy
                  </h3>
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-3 text-sm">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[11px] text-muted-foreground mb-0.5">Nazwa</p>
                        <p className="font-medium text-sm">{selectedDeal.name}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground mb-0.5">Email</p>
                        <p className="text-sm">{selectedDeal.email}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground mb-0.5">NIP</p>
                        <p className="text-sm font-mono">
                          {selectedDeal.nip === "—" ? (
                            <span className="italic text-muted-foreground">Brak NIP</span>
                          ) : (
                            selectedDeal.nip
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-[11px] text-muted-foreground mb-0.5">Spółka</p>
                        <SpolkaBadge spolka={selectedDeal.spolka} />
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground mb-0.5">Handlowiec</p>
                        <p className="text-sm">{selectedDeal.handlowiec}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground mb-0.5">Data</p>
                        <p className="text-sm tabular-nums">{selectedDeal.data}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Źródło */}
                <section className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <FileTextIcon className="size-3.5" />
                    Źródło
                  </h3>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${SOURCE_COLORS[selectedDeal.source]}`}
                  >
                    {SOURCE_LABELS[selectedDeal.source]}
                  </span>
                </section>

                {/* Cross-sell */}
                {selectedDeal.crossSell.found && (
                  <div className="rounded-lg border border-amber-200/70 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangleIcon className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                        Cross-sell — klient znany w:{" "}
                        {selectedDeal.crossSell.spolki.join(", ")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Jest klientem info */}
                {selectedDeal.stage === "Klient" && (
                  <div className="rounded-lg border border-green-200/70 bg-green-50/50 dark:border-green-900/40 dark:bg-green-950/20 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <UserCheckIcon className="size-3.5 text-green-600 dark:text-green-400 shrink-0" />
                      <p className="text-xs font-medium text-green-700 dark:text-green-300">
                        Karta klienta utworzona w WiseGroup — deal nadal aktywny w lejku
                      </p>
                    </div>
                  </div>
                )}

                {/* Etap pipeline */}
                <section className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <CalendarIcon className="size-3.5" />
                    Etap pipeline
                  </h3>
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedDeal.stage}
                      onValueChange={(v) =>
                        handleStageChange(selectedDeal.id, v as LsStage)
                      }
                      disabled={updatingId === selectedDeal.id}
                    >
                      <SelectTrigger className="h-8 text-xs flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LS_STAGES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {updatingId === selectedDeal.id && (
                      <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1">
                        <Loader2Icon className="size-3 animate-spin" />
                        Sync...
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    WiseGroup status →{" "}
                    <span className="font-mono font-medium">
                      {STAGE_TO_STATUS[selectedDeal.stage]}
                    </span>
                  </p>
                </section>

                {/* Notatka od WiseGroup */}
                <section className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Notatki od WiseGroup
                  </h3>
                  <div className="rounded-lg border bg-muted/30 px-3 py-2 space-y-1">
                    <p className="text-xs">{selectedDeal.notatkaWG}</p>
                  </div>
                </section>

                {/* Mapowanie etapów */}
                <section className="space-y-2 border-t pt-4">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Mapowanie etapów Livespace → WiseGroup
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 font-mono text-[11px] text-muted-foreground">
                    {LS_STAGES.map((s) => (
                      <p key={s}>
                        <span className="text-foreground/60">{s}</span> →{" "}
                        {STAGE_TO_STATUS[s]}
                      </p>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
