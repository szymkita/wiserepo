"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { DetailGrid, DetailField } from "@/features/shared/components/detail-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SpolkaBadge } from "@/components/layout/spolka-badge";
import { StatusBadge } from "@/features/shared/components/status-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Zgloszenie } from "../model/zgloszenia.types";
import { ZRODLO_LABELS, STATUS_LABELS } from "../model/zgloszenia.types";
import { SPOLKI_BEZ_WISEGROUP, SPOLKA_CONFIG } from "@/features/shared/model/spolki.types";
import type { SpolkaOperacyjna } from "@/features/shared/model/spolki.types";
import { getPodmiotById, getOsobyKontaktowe, getOsobaKontaktowaById } from "@/features/podmioty/model/podmioty.data-source";
import { getPracownikById } from "@/features/zespol/model/zespol.data-source";
import { getPolecenieById } from "@/features/polecenia/model/polecenia.data-source";
import { getProjektyDlaPodmiotu } from "@/features/projekty/model/projekty.data-source";
import { getPracownikFullName } from "@/features/zespol/model/zespol.data-source";
import {
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
  BuildingIcon,
  UserIcon,
  InboxIcon,
  LinkIcon,
  ArrowUpRightIcon,
  MessageSquareTextIcon,
  BanIcon,
  SearchIcon,
  Loader2Icon,
  PlusCircleIcon,
  UsersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ZgloszenieSheetProps {
  zgloszenie: Zgloszenie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_VARIANT_MAP = {
  nowe: "default",
  spam: "muted",
  odrzucone: "destructive",
  w_sprzedazy: "info",
  jest_klientem: "success",
  przegrane: "destructive",
} as const;

const GUS_NIP_MOCK: Record<string, { nazwa: string; branza: string; miasto: string }> = {
  "1234567890": { nazwa: "TechVenture Sp. z o.o.", branza: "IT / Software", miasto: "Warszawa" },
  "9876543210": { nazwa: "ProBuild S.A.", branza: "Budownictwo", miasto: "Kraków" },
  "3322114455": { nazwa: "DataStream Sp. z o.o.", branza: "Data / Analytics", miasto: "Wrocław" },
  "1122334455": { nazwa: "NovaTrade Sp. z o.o.", branza: "Handel", miasto: "Poznań" },
};

export function ZgloszenieSheet({
  zgloszenie,
  open,
  onOpenChange,
}: ZgloszenieSheetProps) {
  const [nipInput, setNipInput] = useState("");
  const [gusLoading, setGusLoading] = useState(false);
  const [gusResult, setGusResult] = useState<{ nazwa: string; branza: string; miasto: string } | null>(null);
  const [gusFailed, setGusFailed] = useState(false);
  const [nipConfirmed, setNipConfirmed] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualNazwa, setManualNazwa] = useState("");
  const [manualBranza, setManualBranza] = useState("");
  const [manualMiasto, setManualMiasto] = useState("");
  const [manualSaved, setManualSaved] = useState(false);
  const [assignedSpolka, setAssignedSpolka] = useState<SpolkaOperacyjna | null>(null);
  const [spolkaSelectValue, setSpolkaSelectValue] = useState<string>("");
  const [powodOdrzucenia, setPowodOdrzucenia] = useState("");
  const [showOdrzucenieForm, setShowOdrzucenieForm] = useState(false);

  // Reset state when zgłoszenie changes
  useEffect(() => {
    setNipInput("");
    setGusLoading(false);
    setGusResult(null);
    setGusFailed(false);
    setNipConfirmed(false);
    setShowManualForm(false);
    setManualNazwa("");
    setManualBranza("");
    setManualMiasto("");
    setManualSaved(false);
    setAssignedSpolka(null);
    setSpolkaSelectValue("");
    setPowodOdrzucenia("");
    setShowOdrzucenieForm(false);
  }, [zgloszenie?.id]);

  if (!zgloszenie) return null;

  const podmiot = zgloszenie.podmiotId ? getPodmiotById(zgloszenie.podmiotId) : null;
  const handlowiec = zgloszenie.handlowiecId ? getPracownikById(zgloszenie.handlowiecId) : null;
  const polecenie = zgloszenie.polecenieId ? getPolecenieById(zgloszenie.polecenieId) : null;
  const osobyFirmy = podmiot ? getOsobyKontaktowe(podmiot.id) : [];
  const istniejacyKlient = podmiot?.status === "klient";
  const projektyKlienta = istniejacyKlient ? getProjektyDlaPodmiotu(podmiot!.id) : [];
  const osoba = zgloszenie.osobaKontaktowaId
    ? getOsobaKontaktowaById(zgloszenie.osobaKontaktowaId)
    : null;

  const nip = nipConfirmed ? nipInput : (zgloszenie.nip ?? podmiot?.nip ?? null);
  const brakNip = !nip && !nipConfirmed;
  const brakNipPrzyWygranym = zgloszenie.status === "jest_klientem" && brakNip;
  const canEditNip = zgloszenie.status === "nowe" && !zgloszenie.nip && !podmiot?.nip && !nipConfirmed;
  const resolvedNazwa = gusResult?.nazwa ?? (manualNazwa || null);

  const handleGusLookup = async () => {
    if (nipInput.replace(/\D/g, "").length !== 10) {
      toast.error("NIP musi mieć 10 cyfr");
      return;
    }
    setGusLoading(true);
    setGusFailed(false);
    await new Promise((r) => setTimeout(r, 800));
    const result = GUS_NIP_MOCK[nipInput.replace(/\D/g, "")];
    if (result) {
      setGusResult(result);
      setNipConfirmed(true);
      toast.success(`Pobrano dane z GUS — ${result.nazwa}`);
    } else {
      setGusFailed(true);
      setNipConfirmed(true);
      toast.warning("Nie udało się pobrać danych z GUS — utwórz firmę ręcznie");
      setShowManualForm(true);
    }
    setGusLoading(false);
  };

  const handleManualSave = () => {
    if (!manualNazwa.trim()) {
      toast.error("Podaj nazwę firmy");
      return;
    }
    setManualSaved(true);
    setShowManualForm(false);
    toast.success(`Firma "${manualNazwa}" utworzona`);
  };

  const handleKwalifikuj = () => {
    if (!nip) {
      toast.error("Brak NIP — uzupełnij NIP firmy przed kwalifikacją");
      return;
    }
    toast.success("Zgłoszenie przekazane do sprzedaży");
    onOpenChange(false);
  };

  const handleOdrzuc = () => {
    if (!showOdrzucenieForm) {
      setShowOdrzucenieForm(true);
      return;
    }
    if (!powodOdrzucenia.trim()) {
      toast.error("Wpisz powód odrzucenia");
      return;
    }
    toast("Zgłoszenie oznaczone jako odrzucone");
    onOpenChange(false);
  };

  const handleSpam = () => {
    toast("Zgłoszenie oznaczone jako spam");
    onOpenChange(false);
  };

  const isWisegroupBezSpolki =
    zgloszenie.zrodlo === "formularz_wisegroup" &&
    !zgloszenie.spolka &&
    !assignedSpolka;

  const displaySpolka = assignedSpolka ?? zgloszenie.spolka;

  const handlePrzypiszSpolke = () => {
    if (!spolkaSelectValue) {
      toast.error("Wybierz spółkę");
      return;
    }
    const spolka = spolkaSelectValue as SpolkaOperacyjna;
    setAssignedSpolka(spolka);
    toast.success(`Zgłoszenie przypisane do ${SPOLKA_CONFIG[spolka].name}`);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl">
        {/* ── Header ── */}
        <SheetHeader className="border-b bg-muted/50 pb-6">
          <SheetDescription className="font-mono text-xs tracking-wide">
            {zgloszenie.numer}
          </SheetDescription>
          <SheetTitle className="text-lg leading-snug">
            {podmiot?.nazwa ?? "Nieznana firma"}
          </SheetTitle>
          <div className="flex items-center gap-3 pt-1.5">
            <StatusBadge
              label={STATUS_LABELS[zgloszenie.status]}
              variant={STATUS_VARIANT_MAP[zgloszenie.status]}
            />
            <span className="text-xs text-muted-foreground">·</span>
            {displaySpolka ? (
              <SpolkaBadge spolka={displaySpolka} />
            ) : (
              <span className="text-xs text-muted-foreground italic">Brak spółki</span>
            )}
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs tabular-nums text-muted-foreground">{zgloszenie.data}</span>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-8">
            {/* Banner: brak NIP przy wygranym */}
            {brakNipPrzyWygranym && (
              <div className="flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/60 px-4 py-3.5 dark:border-red-900/50 dark:bg-red-950/30">
                <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />
                <div>
                  <p className="text-sm font-medium text-red-900 dark:text-red-200">
                    Brak NIP — nie można utworzyć firmy
                  </p>
                  <p className="mt-0.5 text-xs text-red-700/70 dark:text-red-400/60">
                    Uzupełnij NIP firmy aby dokończyć proces
                  </p>
                </div>
              </div>
            )}

            {/* Banner: wspólny klient (WiseGroup match) */}
            {podmiot && podmiot.wspolneZSpolkami.length > 0 && (
              <Link
                href={`/widok-wspolny/${podmiot.nip}`}
                className="flex items-start gap-3 rounded-xl border border-blue-200/80 bg-blue-50/60 px-4 py-3.5 dark:border-blue-900/50 dark:bg-blue-950/30 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                onClick={() => onOpenChange(false)}
              >
                <UsersIcon className="mt-0.5 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      Wspólny klient
                    </p>
                    <span className="text-xs text-blue-500 font-medium">Szczegóły →</span>
                  </div>
                  {podmiot.wspolneZSpolkami.map((wk, i) => (
                    <p key={i} className="text-xs text-blue-700/70 dark:text-blue-400/60">
                      {SPOLKA_CONFIG[wk.spolka as SpolkaOperacyjna]?.name ?? wk.spolka} — {wk.status} (od {wk.dataOd})
                    </p>
                  ))}
                </div>
              </Link>
            )}


            {/* Banner: istniejący klient — ponowne zgłoszenie (KON-065) */}
            {istniejacyKlient && podmiot && zgloszenie.status === "nowe" && (
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 px-4 py-3.5 dark:border-amber-900/50 dark:bg-amber-950/30">
                <div className="flex items-start gap-3">
                  <AlertTriangleIcon className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                        Istniejący klient — ta firma ma aktywne projekty
                      </p>
                      <p className="mt-0.5 text-xs text-amber-700/70 dark:text-amber-400/60">
                        Firma {podmiot.nazwa} jest już klientem. Nowe zgłoszenie może oznaczać upsell lub duplikat.
                      </p>
                    </div>
                    {projektyKlienta.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600/60 dark:text-amber-500/50">
                          Aktywne projekty
                        </p>
                        {projektyKlienta.map((pr) => (
                          <div key={pr.id} className="text-xs text-amber-800 dark:text-amber-300">
                            {pr.nazwa}
                          </div>
                        ))}
                      </div>
                    )}
                    <Link
                      href={`/podmioty/${podmiot.id}`}
                      onClick={() => onOpenChange(false)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200"
                    >
                      Karta firmy →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Banner: przypisz spółkę (formularz WiseGroup) */}
            {isWisegroupBezSpolki && (
              <div className="relative overflow-hidden rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50 via-blue-50/80 to-indigo-50/60 dark:border-blue-900/50 dark:from-blue-950/40 dark:via-blue-950/20 dark:to-indigo-950/30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_70%)]" />
                <div className="relative px-4 py-3.5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
                      <InboxIcon className="size-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                          Zgłoszenie z formularza WiseGroup
                        </p>
                        <p className="mt-0.5 text-xs text-blue-700/70 dark:text-blue-400/60">
                          Przypisz spółkę operacyjną, do której trafi to zgłoszenie
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={spolkaSelectValue} onValueChange={setSpolkaSelectValue}>
                          <SelectTrigger size="sm" className="flex-1 text-xs">
                            <SelectValue placeholder="Wybierz spółkę..." />
                          </SelectTrigger>
                          <SelectContent>
                            {SPOLKI_BEZ_WISEGROUP.map((s) => (
                              <SelectItem key={s} value={s}>
                                <span
                                  className="mr-1.5 inline-block size-2 rounded-full"
                                  style={{ backgroundColor: SPOLKA_CONFIG[s].color }}
                                />
                                {SPOLKA_CONFIG[s].name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={handlePrzypiszSpolke}
                          disabled={!spolkaSelectValue}
                          className="shrink-0"
                        >
                          <CheckCircleIcon className="mr-1.5 size-3.5" />
                          Przypisz
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Dane firmy ── */}
            <section className="space-y-4">
              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground after:flex-1 after:h-px after:bg-border">
                <BuildingIcon className="size-3.5" />
                Dane firmy
              </h4>

              {/* Input NIP + GUS lookup */}
              {canEditNip && !gusResult && !manualSaved && (
                <div className="rounded-lg border border-amber-200/80 bg-amber-50/30 dark:border-amber-900/50 dark:bg-amber-950/20 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangleIcon className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                      Brak NIP — wpisz NIP i pobierz dane firmy z GUS
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={nipInput}
                      onChange={(e) => setNipInput(e.target.value)}
                      placeholder="Wpisz NIP (10 cyfr)..."
                      className="flex-1 font-mono text-sm"
                      maxLength={10}
                    />
                    <Button
                      size="sm"
                      onClick={handleGusLookup}
                      disabled={gusLoading || nipInput.replace(/\D/g, "").length < 10}
                    >
                      {gusLoading ? (
                        <Loader2Icon className="mr-1.5 size-3.5 animate-spin" />
                      ) : (
                        <SearchIcon className="mr-1.5 size-3.5" />
                      )}
                      Pobierz z GUS
                    </Button>
                  </div>
                </div>
              )}

              {/* GUS result */}
              {gusResult && (
                <div className="rounded-lg border border-green-200/80 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/20 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircleIcon className="size-3.5 text-green-600 dark:text-green-400 shrink-0" />
                    <span className="text-xs font-medium text-green-800 dark:text-green-300">Pobrano z GUS</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <span className="text-muted-foreground text-xs">Firma</span>
                    <span className="font-medium text-xs">{gusResult.nazwa}</span>
                    <span className="text-muted-foreground text-xs">NIP</span>
                    <span className="font-mono text-xs">{nipInput}</span>
                    <span className="text-muted-foreground text-xs">Branża</span>
                    <span className="text-xs">{gusResult.branza}</span>
                    <span className="text-muted-foreground text-xs">Miasto</span>
                    <span className="text-xs">{gusResult.miasto}</span>
                  </div>
                </div>
              )}

              {/* Manual form when GUS failed */}
              {showManualForm && (
                <div className="rounded-lg border border-border p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <PlusCircleIcon className="size-3.5 text-muted-foreground shrink-0" />
                    <p className="text-xs font-medium">Utwórz firmę ręcznie</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    NIP: <span className="font-mono">{nipInput}</span> — GUS nie zwrócił danych.
                  </p>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Nazwa firmy *</Label>
                      <Input
                        value={manualNazwa}
                        onChange={(e) => setManualNazwa(e.target.value)}
                        placeholder="Nazwa firmy"
                        className="text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Branża</Label>
                        <Input
                          value={manualBranza}
                          onChange={(e) => setManualBranza(e.target.value)}
                          placeholder="Branża"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Miasto</Label>
                        <Input
                          value={manualMiasto}
                          onChange={(e) => setManualMiasto(e.target.value)}
                          placeholder="Miasto"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <Button size="sm" onClick={handleManualSave} className="w-full">
                    <PlusCircleIcon className="mr-1.5 size-3.5" />
                    Zapisz firmę
                  </Button>
                </div>
              )}

              {/* Manual saved confirmation */}
              {manualSaved && (
                <div className="rounded-lg border border-green-200/80 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/20 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircleIcon className="size-3.5 text-green-600 dark:text-green-400 shrink-0" />
                    <span className="text-xs font-medium text-green-800 dark:text-green-300">Firma utworzona ręcznie</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <span className="text-muted-foreground text-xs">Firma</span>
                    <span className="font-medium text-xs">{manualNazwa}</span>
                    <span className="text-muted-foreground text-xs">NIP</span>
                    <span className="font-mono text-xs">{nipInput}</span>
                    {manualBranza && <>
                      <span className="text-muted-foreground text-xs">Branża</span>
                      <span className="text-xs">{manualBranza}</span>
                    </>}
                    {manualMiasto && <>
                      <span className="text-muted-foreground text-xs">Miasto</span>
                      <span className="text-xs">{manualMiasto}</span>
                    </>}
                  </div>
                </div>
              )}

              {/* Standard fields (when NIP exists from data) */}
              {!canEditNip && (
                <DetailGrid columns={2}>
                  <DetailField label="Nazwa" variant="link">
                    {podmiot ? (
                      <Link href={`/podmioty/${podmiot.id}`} className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                        {podmiot.nazwa}
                        <ArrowUpRightIcon className="size-3.5 shrink-0" />
                      </Link>
                    ) : resolvedNazwa ? (
                      <span className="font-medium">{resolvedNazwa}</span>
                    ) : "—"}
                  </DetailField>
                  <DetailField label="NIP" variant="mono">
                    {nip ?? (
                      <span className="text-muted-foreground/60 italic text-xs">Brak NIP</span>
                    )}
                  </DetailField>
                </DetailGrid>
              )}
            </section>

            {/* ── Osoby kontaktowe firmy ── */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground after:flex-1 after:h-px after:bg-border flex-1">
                  <UserIcon className="size-3.5" />
                  Osoby kontaktowe
                </h4>
                {podmiot && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-muted-foreground"
                    onClick={() => toast("Dodawanie osoby kontaktowej (demo)")}
                  >
                    + Dodaj
                  </Button>
                )}
              </div>
              {osobyFirmy.length > 0 ? (
                <div className="space-y-2">
                  {osobyFirmy.map((o) => (
                    <div
                      key={o.id}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-sm",
                        zgloszenie.osobaKontaktowaId === o.id && "border-primary/30 bg-primary/5"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{o.imie} {o.nazwisko}</span>
                        {zgloszenie.osobaKontaktowaId === o.id && (
                          <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                            Przypisana
                          </span>
                        )}
                      </div>
                      {o.stanowisko && (
                        <p className="text-xs text-muted-foreground">{o.stanowisko}</p>
                      )}
                      <div className="flex gap-4 mt-1">
                        {o.email && <span className="text-xs text-muted-foreground">{o.email}</span>}
                        {o.telefon && <span className="text-xs text-muted-foreground font-mono">{o.telefon}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : osoba ? (
                <DetailGrid columns={2}>
                  <DetailField label="Imię i nazwisko">
                    {osoba.imie} {osoba.nazwisko}
                  </DetailField>
                  {osoba.email && (
                    <DetailField label="Email">{osoba.email}</DetailField>
                  )}
                </DetailGrid>
              ) : (
                <p className="text-xs text-muted-foreground">Brak osób kontaktowych</p>
              )}
            </section>

            {/* ── Szczegóły zgłoszenia ── */}
            <section className="space-y-4">
              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground after:flex-1 after:h-px after:bg-border">
                <InboxIcon className="size-3.5" />
                Szczegóły zgłoszenia
              </h4>
              <DetailGrid columns={2}>
                <DetailField label="Status" variant="badge">
                  <StatusBadge
                    label={STATUS_LABELS[zgloszenie.status]}
                    variant={STATUS_VARIANT_MAP[zgloszenie.status]}
                  />
                </DetailField>
                <DetailField label="Źródło" variant="badge">
                  {ZRODLO_LABELS[zgloszenie.zrodlo]}
                </DetailField>
                <DetailField label="Spółka" variant="badge">
                  {displaySpolka ? <SpolkaBadge spolka={displaySpolka} /> : "—"}
                </DetailField>
                <DetailField label="Data" variant="mono">
                  {zgloszenie.data}
                </DetailField>
                <DetailField label="Sprzedawca" className="sm:col-span-2">
                  {handlowiec
                    ? `${handlowiec.imie} ${handlowiec.nazwisko}`
                    : "—"}
                </DetailField>
                {zgloszenie.powod_odrzucenia && (
                  <DetailField label="Powód odrzucenia" className="sm:col-span-2">
                    {zgloszenie.powod_odrzucenia}
                  </DetailField>
                )}
              </DetailGrid>
            </section>

            {/* ── Powiązania ── */}
            {polecenie && (
              <section className="space-y-4">
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground after:flex-1 after:h-px after:bg-border">
                  <LinkIcon className="size-3.5" />
                  Powiązania
                </h4>
                <DetailGrid columns={2}>
                  <DetailField label="Polecenie" variant="link">
                    <span className="inline-flex items-center gap-1 text-primary cursor-pointer hover:text-primary/80 transition-colors">
                      #{polecenie.id}
                      <ArrowUpRightIcon className="size-3.5 shrink-0" />
                    </span>
                  </DetailField>
                </DetailGrid>
              </section>
            )}

            {/* ── Notatki ── */}
            {zgloszenie.notatki && zgloszenie.notatki.length > 0 && (
              <section className="space-y-4">
                <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground after:flex-1 after:h-px after:bg-border">
                  <MessageSquareTextIcon className="size-3.5" />
                  Notatki
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
                    {zgloszenie.notatki.length}
                  </span>
                </h4>
                <div className="space-y-2.5">
                  {zgloszenie.notatki.map((notatka) => {
                    const isSystem = notatka.autor === "system";
                    return (
                      <div
                        key={notatka.id}
                        className={
                          isSystem
                            ? "rounded-lg border border-amber-200/80 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20 px-4 py-3"
                            : "rounded-lg border border-border/60 bg-transparent px-4 py-3 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]"
                        }
                      >
                        <div className="mb-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className={isSystem ? "font-medium text-amber-700 dark:text-amber-400" : "font-medium text-foreground/70"}>
                            {isSystem ? "System" : getPracownikFullName(notatka.autor)}
                          </span>
                          <span>·</span>
                          <span className="tabular-nums">{notatka.data}</span>
                        </div>
                        <p className={isSystem ? "text-sm leading-relaxed text-amber-900 dark:text-amber-200" : "text-sm leading-relaxed"}>
                          {notatka.tresc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ── Akcje ── */}
            {zgloszenie.status === "nowe" && (
              <div className="space-y-3 border-t pt-6">
                {showOdrzucenieForm && (
                  <div className="space-y-2">
                    <Label className="text-xs">Powód odrzucenia</Label>
                    <Textarea
                      rows={2}
                      value={powodOdrzucenia}
                      onChange={(e) => setPowodOdrzucenia(e.target.value)}
                      placeholder="Wpisz powód odrzucenia zgłoszenia..."
                      className="text-sm"
                    />
                  </div>
                )}
                <div className="flex gap-3">
                  <Button onClick={handleKwalifikuj} className="flex-1">
                    <CheckCircleIcon className="mr-2 size-4" />
                    Do sprzedaży
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleOdrzuc}
                    className="flex-1"
                  >
                    <XCircleIcon className="mr-2 size-4" />
                    {showOdrzucenieForm ? "Potwierdź odrzucenie" : "Odrzuć"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleSpam}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <BanIcon className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
