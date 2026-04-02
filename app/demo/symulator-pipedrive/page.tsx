"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  PlusIcon,
  ZapIcon,
  AlertTriangleIcon,
  InfoIcon,
  ChevronRightIcon,
  Building2Icon,
  CalendarIcon,
  FileTextIcon,
  ArrowRightIcon,
  XIcon,
  Loader2Icon,
  UserCheckIcon,
} from "lucide-react";

/* ─── Etapy Pipedrive (po polsku) ─── */

const PD_STAGES = [
  "Nowy",
  "Kwalifikacja",
  "Demo umówione",
  "Propozycja",
  "Klient",
  "Wygrany",
  "Przegrany",
] as const;
type PdStage = (typeof PD_STAGES)[number];

const STAGE_TO_STATUS: Record<PdStage, string> = {
  Nowy: "nowe",
  Kwalifikacja: "w_sprzedazy",
  "Demo umówione": "w_sprzedazy",
  Propozycja: "w_sprzedazy",
  Klient: "jest_klientem",
  Wygrany: "jest_klientem",
  Przegrany: "przegrane",
};

const STAGE_VARIANT: Record<
  PdStage,
  "default" | "info" | "success" | "destructive" | "muted"
> = {
  Nowy: "default",
  Kwalifikacja: "info",
  "Demo umówione": "info",
  Propozycja: "info",
  Klient: "success",
  Wygrany: "muted",
  Przegrany: "destructive",
};

/* ─── Deal type ─── */

type DealSource = "polecenie" | "formularz_wg" | "nowy";

interface PdDeal {
  id: string;
  name: string;
  nip: string;
  email: string;
  stage: PdStage;
  notatkaWG: string;
  crossSell: { found: boolean; spolki: string[] };
  data: string;
  zglNumer: string;
  source: DealSource;
}

/* ─── Mock deals — 7 scenariuszy ─── */

const INITIAL_DEALS: PdDeal[] = [
  {
    id: "pd-deal-2001",
    name: "TechVenture Sp. z o.o.",
    nip: "1234567890",
    email: "cto@techventure.pl",
    stage: "Demo umówione",
    notatkaWG:
      "Polecenie od SellWise. CTO TechVenture zainteresowany automatyzacją CRM. Cross-sell: podmiot znany w SellWise.",
    crossSell: { found: true, spolki: ["SellWise"] },
    data: "2024-10-15",
    zglNumer: "ZGL-2024-003",
    source: "polecenie",
  },
  {
    id: "pd-deal-2055",
    name: "Nieznana firma",
    nip: "—",
    email: "kontakt@unknown.pl",
    stage: "Nowy",
    notatkaWG:
      "Brak NIP — uzupełnij dane klienta. Webhook z Pipedrive odebrany. Wymaga weryfikacji przed kwalifikacją.",
    crossSell: { found: false, spolki: [] },
    data: "2025-02-05",
    zglNumer: "ZGL-2025-004",
    source: "nowy",
  },
  {
    id: "pd-deal-2003",
    name: "AutoSoft Sp. z o.o.",
    nip: "8877665544",
    email: "sales@autosoft.pl",
    stage: "Klient",
    notatkaWG:
      "Klient kupił wstępny audyt automatyzacji. Karta klienta utworzona w WiseGroup. Trwa upsell na pełne wdrożenie.",
    crossSell: { found: false, spolki: [] },
    data: "2025-01-20",
    zglNumer: "ZGL-2025-002",
    source: "nowy",
  },
  {
    id: "pd-deal-2004",
    name: "GreenTech Solutions",
    nip: "3322114455",
    email: "biuro@greentech.pl",
    stage: "Kwalifikacja",
    notatkaWG:
      "Z formularza WiseGroup — lead przekierowany do Let's Automate. Potrzebują integracji systemów.",
    crossSell: { found: true, spolki: ["HireWise"] },
    data: "2025-02-10",
    zglNumer: "ZGL-2025-006",
    source: "formularz_wg",
  },
  {
    id: "pd-deal-2005",
    name: "SmartLogic S.A.",
    nip: "7766554433",
    email: "cfo@smartlogic.pl",
    stage: "Propozycja",
    notatkaWG:
      "NIP zaktualizowany przez handlowca. Początkowo brak NIP — dodano po rozmowie telefonicznej.",
    crossSell: { found: false, spolki: [] },
    data: "2025-02-15",
    zglNumer: "ZGL-2025-007",
    source: "nowy",
  },
  {
    id: "pd-deal-2006",
    name: "OldCorp Sp. z o.o.",
    nip: "5566778899",
    email: "info@oldcorp.pl",
    stage: "Przegrany",
    notatkaWG:
      "Deal odrzucony — klient zrezygnował z projektu automatyzacji. Budget przeniesiony na inne priorytety.",
    crossSell: { found: false, spolki: [] },
    data: "2025-02-20",
    zglNumer: "ZGL-2025-009",
    source: "nowy",
  },
  {
    id: "pd-deal-2007",
    name: "DataFlow Sp. z o.o.",
    nip: "6655443322",
    email: "biuro@dataflow.pl",
    stage: "Wygrany",
    notatkaWG:
      "Proces sprzedaży zakończony. Zgłoszenie zamknięte w WiseGroup. Klient obsługiwany w ramach projektu wdrożenia.",
    crossSell: { found: false, spolki: [] },
    data: "2024-12-10",
    zglNumer: "ZGL-2024-011",
    source: "polecenie",
  },
];

/* ─── Source labels ─── */

const SOURCE_LABELS: Record<DealSource, string> = {
  polecenie: "Polecenie",
  formularz_wg: "Formularz WG",
  nowy: "Nowy",
};

const SOURCE_COLORS: Record<DealSource, string> = {
  polecenie:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  formularz_wg:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  nowy: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

/* ─── Component ─── */

export default function SymulatorPipedrivePage() {
  const [deals, setDeals] = useState<PdDeal[]>(INITIAL_DEALS);
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Add deal form
  const [firma, setFirma] = useState("");
  const [email, setEmail] = useState("");
  const [nip, setNip] = useState("");
  const [stage, setStage] = useState<PdStage | "">("");
  const [loading, setLoading] = useState(false);

  const selectedDeal = deals.find((d) => d.id === selectedDealId) ?? null;

  const handleStageChange = async (dealId: string, newStage: PdStage) => {
    setUpdatingId(dealId);
    await new Promise((r) => setTimeout(r, 400));
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );
    setUpdatingId(null);
  };

  const handleNipUpdate = async (dealId: string, newNip: string) => {
    setUpdatingId(dealId);
    await new Promise((r) => setTimeout(r, 500));
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, nip: newNip } : d))
    );
    setUpdatingId(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const dealId = `pd-deal-${String(Date.now()).slice(-4)}`;
    const zglNumer = `ZGL-PD-${String(Date.now()).slice(-4)}`;
    const newDeal: PdDeal = {
      id: dealId,
      name: firma,
      nip: nip || "—",
      email,
      stage: (stage as PdStage) || "Nowy",
      notatkaWG:
        "Deal z Pipedrive — webhook odebrany przez WiseGroup. Oczekuje na weryfikację.",
      crossSell: { found: false, spolki: [] },
      data: new Date().toISOString().split("T")[0],
      zglNumer,
      source: "nowy",
    };
    setDeals((prev) => [newDeal, ...prev]);
    setFirma("");
    setEmail("");
    setNip("");
    setStage("");
    setLoading(false);
    setShowAddForm(false);
    setSelectedDealId(dealId);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pipedrive — Symulator (Let's Automate)"
        description="Symuluje widok CRM Pipedrive dla spółki Let's Automate. Lista dealów z możliwością przeglądania szczegółów i zmiany etapów."
      />

      {/* Info banner */}
      <div className="rounded-lg border border-blue-200/70 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20 p-3">
        <div className="flex items-start gap-2">
          <ZapIcon className="size-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Te deale zostały przesłane przez{" "}
            <strong>WiseGroup Hub</strong> na podstawie poleceń i zgłoszeń.
            Zmiana etapu synchronizuje status zgłoszenia w systemie.
          </p>
        </div>
      </div>

      {/* Deal list */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">
              Deale ({deals.length})
            </CardTitle>
            <Button size="sm" onClick={() => setShowAddForm(true)}>
              <PlusIcon className="size-4 mr-1.5" />
              Dodaj deal
            </Button>
          </div>
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
                    <span className="font-mono">
                      NIP: {deal.nip}
                    </span>
                    <span className="tabular-nums">{deal.data}</span>
                    <span className="font-mono text-[11px]">{deal.zglNumer}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${SOURCE_COLORS[deal.source]}`}
                  >
                    {SOURCE_LABELS[deal.source]}
                  </span>
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

      {/* Stage mapping card */}
      <Card className="border-dashed">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <InfoIcon className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-muted-foreground">
              <p className="font-medium text-foreground/70">
                Mapowanie etapów Pipedrive → WiseGroup
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 font-mono text-[11px]">
                {PD_STAGES.map((s) => (
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
                        <p className="text-[11px] text-muted-foreground mb-0.5">Data</p>
                        <p className="text-sm tabular-nums">{selectedDeal.data}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground mb-1">NIP</p>
                      <NipField
                        nip={selectedDeal.nip}
                        dealId={selectedDeal.id}
                        onUpdate={handleNipUpdate}
                        updating={updatingId === selectedDeal.id}
                      />
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
                        handleStageChange(selectedDeal.id, v as PdStage)
                      }
                      disabled={updatingId === selectedDeal.id}
                    >
                      <SelectTrigger className="h-8 text-xs flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PD_STAGES.map((s) => (
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
                    Mapowanie etapów Pipedrive → WiseGroup
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 font-mono text-[11px] text-muted-foreground">
                    {PD_STAGES.map((s) => (
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

      {/* ─── Add Deal Sheet ─── */}
      <Sheet open={showAddForm} onOpenChange={setShowAddForm}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-base flex items-center gap-2">
              <PlusIcon className="size-4" />
              Dodaj deal w Pipedrive
            </SheetTitle>
            <SheetDescription>
              Utwórz nowy deal — webhook wyśle dane do WiseGroup Hub.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleCreate} className="space-y-4 px-6 py-6">
            <div className="space-y-1.5">
              <Label htmlFor="pd-firma">Nazwa firmy</Label>
              <Input
                id="pd-firma"
                value={firma}
                onChange={(e) => setFirma(e.target.value)}
                placeholder="Nazwa firmy klienta"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pd-email">Email kontaktowy</Label>
              <Input
                id="pd-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kontakt@firma.pl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pd-nip">
                NIP{" "}
                <span className="text-muted-foreground text-xs">
                  (opcjonalny)
                </span>
              </Label>
              <Input
                id="pd-nip"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="1234567890"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Etap pipeline</Label>
              <Select
                value={stage}
                onValueChange={(v) => setStage(v as PdStage)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz etap" />
                </SelectTrigger>
                <SelectContent>
                  {PD_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-blue-200/70 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20 p-3">
              <ArrowRightIcon className="size-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Po utworzeniu webhook wyśle dane do WiseGroup Hub — zgłoszenie
                powstanie ze źródłem <strong>pipedrive</strong>.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2Icon className="size-4 mr-1.5 animate-spin" />
                  Tworzenie...
                </>
              ) : (
                "Utwórz deal i wyślij do WiseGroup"
              )}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ─── NIP field sub-component ─── */

function NipField({
  nip,
  dealId,
  onUpdate,
  updating,
}: {
  nip: string;
  dealId: string;
  onUpdate: (dealId: string, nip: string) => void;
  updating: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");

  if (nip !== "—") {
    return <span className="font-mono text-xs">{nip}</span>;
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="1234567890"
          className="h-7 text-xs w-28"
        />
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs px-2"
          disabled={value.length !== 10 || updating}
          onClick={() => {
            onUpdate(dealId, value);
            setEditing(false);
          }}
        >
          {updating ? <Loader2Icon className="size-3 animate-spin" /> : "Zapisz"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs px-1.5"
          onClick={() => setEditing(false)}
        >
          <XIcon className="size-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs italic text-muted-foreground">Brak NIP</span>
      <Button
        size="sm"
        variant="outline"
        className="h-6 text-[10px] px-2"
        onClick={() => setEditing(true)}
      >
        Aktualizuj NIP
      </Button>
    </div>
  );
}
