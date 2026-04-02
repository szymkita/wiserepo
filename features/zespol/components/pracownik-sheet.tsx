"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SpolkaBadge } from "@/components/layout/spolka-badge";
import { StatusBadge } from "@/features/shared/components/status-badge";
import { DetailGrid, DetailField } from "@/features/shared/components/detail-field";
import type { Pracownik } from "../model/zespol.types";
import { getZgloszeniaDlaHandlowca } from "@/features/zgloszenia/model/zgloszenia.data-source";
import { getProjektyDlaWykonawcy } from "@/features/projekty/model/projekty.data-source";
import { getPoleceniaDlaPracownika } from "@/features/polecenia/model/polecenia.data-source";
import { STATUS_LABELS } from "@/features/zgloszenia/model/zgloszenia.types";
import {
  MailIcon,
  PhoneIcon,
  UserIcon,
  InboxIcon,
  FolderIcon,
  ArrowRightLeftIcon,
} from "lucide-react";

interface PracownikSheetProps {
  pracownik: Pracownik | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PracownikSheet({
  pracownik,
  open,
  onOpenChange,
}: PracownikSheetProps) {
  if (!pracownik) return null;

  const isHandlowiec = pracownik.role.includes("handlowiec");
  const isWykonawca = pracownik.role.includes("wykonawca");

  const zgloszenia = isHandlowiec ? getZgloszeniaDlaHandlowca(pracownik.id) : [];
  const projekty = isWykonawca ? getProjektyDlaWykonawcy(pracownik.id) : [];
  const polecenia = getPoleceniaDlaPracownika(pracownik.id);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-balance">
            {pracownik.imie} {pracownik.nazwisko}
          </SheetTitle>
          <SheetDescription>
            {pracownik.stanowisko} · <SpolkaBadge spolka={pracownik.spolka} />
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">
          {/* ── Dane kontaktowe ── */}
          <section className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground after:flex-1 after:h-px after:bg-border">
              <UserIcon className="size-3.5 text-muted-foreground" />
              Dane kontaktowe
            </h4>
            <DetailGrid columns={2}>
              <DetailField label="Email">
                <span className="inline-flex items-center gap-1.5">
                  <MailIcon className="size-3.5 text-muted-foreground" />
                  {pracownik.email}
                </span>
              </DetailField>
              <DetailField label="Telefon">
                <span className="inline-flex items-center gap-1.5">
                  <PhoneIcon className="size-3.5 text-muted-foreground" />
                  {pracownik.telefon}
                </span>
              </DetailField>
              <DetailField label="Role" className="sm:col-span-2">
                <div className="flex flex-wrap gap-1.5">
                  {pracownik.role.map((r) => (
                    <StatusBadge
                      key={r}
                      label={r === "handlowiec" ? "Handlowiec" : "Wykonawca"}
                      variant={r === "handlowiec" ? "info" : "success"}
                    />
                  ))}
                </div>
              </DetailField>
            </DetailGrid>
          </section>

          {/* ── Zgłoszenia ── */}
          {zgloszenia.length > 0 && (
            <section className="space-y-4">
              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground after:flex-1 after:h-px after:bg-border">
                <InboxIcon className="size-3.5 text-muted-foreground" />
                Zgłoszenia
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                  {zgloszenia.length}
                </span>
              </h4>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Spółka</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zgloszenia.slice(0, 5).map((z) => (
                      <TableRow key={z.id}>
                        <TableCell className="tabular-nums">{z.data}</TableCell>
                        <TableCell>{z.spolka ? <SpolkaBadge spolka={z.spolka} /> : "—"}</TableCell>
                        <TableCell>
                          <StatusBadge
                            label={STATUS_LABELS[z.status]}
                            variant={z.status === "jest_klientem" ? "success" : z.status === "odrzucone" || z.status === "przegrane" ? "destructive" : z.status === "w_sprzedazy" ? "info" : "default"}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>
          )}

          {/* ── Projekty ── */}
          {projekty.length > 0 && (
            <section className="space-y-4">
              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground after:flex-1 after:h-px after:bg-border">
                <FolderIcon className="size-3.5 text-muted-foreground" />
                Projekty
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                  {projekty.length}
                </span>
              </h4>
              <div className="space-y-2">
                {projekty.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border border-border/70 bg-card px-3.5 py-2.5 shadow-[var(--shadow-xs)] dark:bg-input/30">
                    <span className="text-sm font-medium">{p.nazwa}</span>
                    <SpolkaBadge spolka={p.spolka} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Polecenia ── */}
          {polecenia.length > 0 && (
            <section className="space-y-4">
              <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground after:flex-1 after:h-px after:bg-border">
                <ArrowRightLeftIcon className="size-3.5 text-muted-foreground" />
                Polecenia
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
                  {polecenia.length}
                </span>
              </h4>
              <div className="space-y-2">
                {polecenia.map((p) => (
                  <div key={p.id} className="rounded-lg border border-border/70 bg-card px-3.5 py-3 shadow-[var(--shadow-xs)] dark:bg-input/30">
                    <p className="text-sm leading-relaxed">{p.opis}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
