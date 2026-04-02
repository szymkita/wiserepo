"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { SpolkaBadge } from "@/components/layout/spolka-badge";
import { StatusBadge } from "@/features/shared/components/status-badge";
import { DetailGrid, DetailField } from "@/features/shared/components/detail-field";
import type { Polecenie } from "../model/polecenia.types";
import {
  TYP_POLECENIA_LABELS,
  STATUS_POLECENIA_LABELS,
} from "../model/polecenia.types";
import { getPodmiotById } from "@/features/podmioty/model/podmioty.data-source";
import { getPracownikById } from "@/features/zespol/model/zespol.data-source";
import { getZgloszenieById } from "@/features/zgloszenia/model/zgloszenia.data-source";
import {
  InfoIcon,
  ArrowRightLeftIcon,
  LinkIcon,
  MessageSquareTextIcon,
  ArrowUpRightIcon,
} from "lucide-react";

interface PolecenieSheetProps {
  polecenie: Polecenie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PolecenieSheet({
  polecenie,
  open,
  onOpenChange,
}: PolecenieSheetProps) {
  if (!polecenie) return null;

  const polecajacy = getPracownikById(polecenie.polecajacyId);
  const podmiot = getPodmiotById(polecenie.podmiotId);
  const zrodloZgl = polecenie.zrodloZgloszenieId
    ? getZgloszenieById(polecenie.zrodloZgloszenieId)
    : null;
  const doceloweZgl = getZgloszenieById(polecenie.zgloszenieDoceloweId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-balance">Polecenie #{polecenie.id}</SheetTitle>
          <SheetDescription>
            {TYP_POLECENIA_LABELS[polecenie.typ]} · {polecenie.data}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">
          {/* ── Informacje ── */}
          <section className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground after:flex-1 after:h-px after:bg-border">
              <InfoIcon className="size-3.5 text-muted-foreground" />
              Informacje
            </h4>
            <DetailGrid columns={2}>
              <DetailField label="Typ">
                <StatusBadge
                  label={TYP_POLECENIA_LABELS[polecenie.typ]}
                  variant={polecenie.typ === "aktywne" ? "info" : "muted"}
                />
              </DetailField>
              <DetailField label="Status">
                <StatusBadge
                  label={STATUS_POLECENIA_LABELS[polecenie.status]}
                  variant={
                    polecenie.status === "wygrana"
                      ? "success"
                      : polecenie.status === "odrzucone"
                        ? "destructive"
                        : polecenie.status === "przeslane_do_crm"
                          ? "info"
                          : "default"
                  }
                />
              </DetailField>
              <DetailField label="Prowizja należna">
                {polecenie.prowizjaNalezna ? (
                  <StatusBadge label="Tak" variant="success" />
                ) : (
                  <StatusBadge label="Nie" variant="muted" />
                )}
              </DetailField>
              <DetailField label="Data">
                <span className="tabular-nums">{polecenie.data}</span>
              </DetailField>
            </DetailGrid>
          </section>

          {/* ── Kierunek ── */}
          <section className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground after:flex-1 after:h-px after:bg-border">
              <ArrowRightLeftIcon className="size-3.5 text-muted-foreground" />
              Kierunek
            </h4>
            <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-card px-3.5 py-3 shadow-[var(--shadow-xs)] dark:bg-input/30">
              <SpolkaBadge spolka={polecenie.spolkaZrodlowa} size="md" />
              <span className="text-muted-foreground">→</span>
              <SpolkaBadge spolka={polecenie.spolkaDocelowa} size="md" />
            </div>
          </section>

          {/* ── Relacje ── */}
          <section className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground after:flex-1 after:h-px after:bg-border">
              <LinkIcon className="size-3.5 text-muted-foreground" />
              Relacje
            </h4>
            <DetailGrid columns={2}>
              <DetailField label="Polecający">
                {polecajacy
                  ? `${polecajacy.imie} ${polecajacy.nazwisko}`
                  : "—"}
              </DetailField>
              <DetailField label="Firma">
                {podmiot ? (
                  <Link href={`/podmioty/${podmiot.id}`} className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors">
                    {podmiot.nazwa}
                    <ArrowUpRightIcon className="size-3.5 shrink-0" />
                  </Link>
                ) : "—"}
              </DetailField>
              {zrodloZgl && (
                <DetailField label="Źródło (zgłoszenie w A)">
                  #{zrodloZgl.id}
                </DetailField>
              )}
              {doceloweZgl && (
                <DetailField label="Zgłoszenie w B">
                  #{doceloweZgl.id}
                </DetailField>
              )}
            </DetailGrid>
          </section>

          {/* ── Opis potrzeby ── */}
          <section className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground after:flex-1 after:h-px after:bg-border">
              <MessageSquareTextIcon className="size-3.5 text-muted-foreground" />
              Opis potrzeby
            </h4>
            <div className="rounded-lg border border-border/70 bg-card px-3.5 py-3 shadow-[var(--shadow-xs)] dark:bg-input/30">
              <p className="text-sm leading-relaxed">{polecenie.opis}</p>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
