"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { DetailGrid, DetailField } from "@/features/shared/components/detail-field";
import { Badge } from "@/components/ui/badge";
import { SpolkaBadge } from "@/components/layout/spolka-badge";
import { StatusBadge } from "@/features/shared/components/status-badge";
import type { Projekt } from "../model/projekty.types";
import {
  CHARAKTER_LABELS,
  STATUS_PROJEKTU_LABELS,
} from "../model/projekty.types";
import { getPodmiotById, getOsobyKontaktowe } from "@/features/podmioty/model/podmioty.data-source";
import { getUslugaById } from "@/features/uslugi/model/uslugi.data-source";
import { getPracownikById } from "@/features/zespol/model/zespol.data-source";
import {
  InfoIcon,
  BuildingIcon,
  PackageIcon,
  UsersIcon,
  UserIcon,
  ArrowUpRightIcon,
} from "lucide-react";

interface ProjektSheetProps {
  projekt: Projekt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjektSheet({ projekt, open, onOpenChange }: ProjektSheetProps) {
  if (!projekt) return null;

  const podmiot = getPodmiotById(projekt.podmiotId);
  const uslugi = projekt.uslugaIds.map((id) => getUslugaById(id)).filter(Boolean);
  const wykonawcy = projekt.wykonawcaIds.map((id) => getPracownikById(id)).filter(Boolean);
  const kontakty = getOsobyKontaktowe(projekt.podmiotId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-balance">{projekt.nazwa}</SheetTitle>
          <SheetDescription>
            Projekt · {podmiot?.nazwa ?? "—"}
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
              <DetailField label="Spółka">
                <SpolkaBadge spolka={projekt.spolka} />
              </DetailField>
              <DetailField label="Charakter">{CHARAKTER_LABELS[projekt.charakter]}</DetailField>
              <DetailField label="Status">
                <StatusBadge
                  label={STATUS_PROJEKTU_LABELS[projekt.status]}
                  variant={projekt.status === "aktywny" ? "success" : "muted"}
                />
              </DetailField>
              <DetailField label="Od">
                <span className="tabular-nums">{projekt.dataOd}</span>
              </DetailField>
              {projekt.dataDo && (
                <DetailField label="Do">
                  <span className="tabular-nums">{projekt.dataDo}</span>
                </DetailField>
              )}
            </DetailGrid>
          </section>

          {/* ── Firma ── */}
          <section className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground after:flex-1 after:h-px after:bg-border">
              <BuildingIcon className="size-3.5 text-muted-foreground" />
              Firma
            </h4>
            {podmiot ? (
              <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-card px-3.5 py-2.5 shadow-[var(--shadow-xs)] dark:bg-input/30">
                <div className="flex-1 min-w-0">
                  <Link href={`/podmioty/${podmiot.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    {podmiot.nazwa}
                    <ArrowUpRightIcon className="size-3.5 shrink-0" />
                  </Link>
                  <p className="text-xs text-muted-foreground">NIP: {podmiot.nip}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </section>

          {/* ── Usługi ── */}
          {uslugi.length > 0 && (
            <section className="space-y-4">
              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground after:flex-1 after:h-px after:bg-border">
                <PackageIcon className="size-3.5 text-muted-foreground" />
                Usługi
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {uslugi.map((u) =>
                  u ? (
                    <Badge key={u.id} variant="outline">
                      {u.nazwa}
                    </Badge>
                  ) : null
                )}
              </div>
            </section>
          )}

          {/* ── Wykonawcy ── */}
          {wykonawcy.length > 0 && (
            <section className="space-y-4">
              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground after:flex-1 after:h-px after:bg-border">
                <UsersIcon className="size-3.5 text-muted-foreground" />
                Wykonawcy
              </h4>
              <DetailGrid columns={2}>
                {wykonawcy.map((w) =>
                  w ? (
                    <DetailField key={w.id} label={w.stanowisko ?? "Wykonawca"}>
                      {w.imie} {w.nazwisko}
                    </DetailField>
                  ) : null
                )}
              </DetailGrid>
            </section>
          )}

          {/* ── Kontakty ── */}
          {kontakty.length > 0 && (
            <section className="space-y-4">
              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground after:flex-1 after:h-px after:bg-border">
                <UserIcon className="size-3.5 text-muted-foreground" />
                Kontakty
              </h4>
              <DetailGrid columns={2}>
                {kontakty.map((k) => (
                  <DetailField key={k.id} label={k.stanowisko ?? "Kontakt"}>
                    {k.imie} {k.nazwisko}
                  </DetailField>
                ))}
              </DetailGrid>
            </section>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
