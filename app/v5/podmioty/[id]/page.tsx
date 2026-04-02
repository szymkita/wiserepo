"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { getPodmiotById, getOsobyKontaktowe } from "@/features/podmioty/model/podmioty.data-source";
import { getZgloszeniaDlaPodmiotu } from "@/features/zgloszenia/model/zgloszenia.data-source";
import { getProjektyDlaPodmiotu } from "@/features/projekty/model/projekty.data-source";
import { getPracownikFullName } from "@/features/zespol/model/zespol.data-source";
import { useActiveSystem } from "@/features/shared/context/active-system-context";
import { STATUS_PODMIOTU_LABELS } from "@/features/podmioty/model/podmioty.types";
import { STATUS_LABELS } from "@/features/zgloszenia/model/zgloszenia.types";
import { SPOLKA_CONFIG, type SpolkaId, hexToRgba } from "@/features/shared/model/spolki.types";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import {
  ArrowLeftIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  UsersIcon,
  ArrowUpRightIcon,
  CopyIcon,
  MapPinIcon,
  BriefcaseIcon,
  BuildingIcon,
} from "lucide-react";

const OsobaKontaktowaForm = dynamic(
  () => import("@/features/podmioty/components/osoba-kontaktowa-form").then((m) => m.OsobaKontaktowaForm),
  { ssr: false }
);

const ProjektForm = dynamic(
  () => import("@/features/projekty/components/projekt-form").then((m) => m.ProjektForm),
  { ssr: false }
);

/* ─── Status ─── */
function statusColor(status: string) {
  switch (status) {
    case "klient": return "text-emerald-600 dark:text-emerald-400";
    case "lead": return "text-blue-600 dark:text-blue-400";
    default: return "text-muted-foreground";
  }
}
function statusDot(status: string) {
  switch (status) {
    case "klient": return "bg-emerald-500";
    case "lead": return "bg-blue-500";
    default: return "bg-muted-foreground/40";
  }
}

function zglStatusVariant(status: string) {
  switch (status) {
    case "jest_klientem": return "text-emerald-600 dark:text-emerald-400";
    case "w_sprzedazy": return "text-blue-600 dark:text-blue-400";
    case "odrzucone": case "przegrane": return "text-red-500 dark:text-red-400";
    default: return "text-muted-foreground";
  }
}

/* ─── Section heading ─── */
function SectionHeading({ children, count, action }: { children: React.ReactNode; count?: number; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-border/25">
      <div className="flex items-baseline gap-2.5">
        <h2 className="text-[15px] font-semibold text-foreground">{children}</h2>
        {count !== undefined && (
          <span className="text-[13px] tabular-nums text-muted-foreground/50">{count}</span>
        )}
      </div>
      {action}
    </div>
  );
}

export default function V5PodmiotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const podmiot = getPodmiotById(id);
  const [formOpen, setFormOpen] = useState(false);
  const [projektFormOpen, setProjektFormOpen] = useState(false);
  const { activeSystem } = useActiveSystem();

  if (!podmiot) notFound();

  const osoby = getOsobyKontaktowe(podmiot.id);
  const zgloszenia = getZgloszeniaDlaPodmiotu(podmiot.id, activeSystem);
  const projekty = getProjektyDlaPodmiotu(podmiot.id, activeSystem);
  const wks = podmiot.wspolneZSpolkami;
  const spolkaConfig = SPOLKA_CONFIG[podmiot.spolka as SpolkaId];

  return (
    <div>
      {/* Back */}
      <Link
        href="/v5/podmioty"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeftIcon className="size-3.5" />
        Firmy
      </Link>

      {/* ── Header ── */}
      <div className="mb-10 opacity-0 animate-fade-in" style={{ animationDelay: "50ms", animationFillMode: "forwards" }}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-[40px] font-bold tracking-tight text-foreground leading-[1]">
              {podmiot.nazwa}
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(podmiot.nip);
                  toast("NIP skopiowany");
                }}
                className="group flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="font-mono tabular-nums tracking-[0.02em]">NIP {podmiot.nip}</span>
                <CopyIcon className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <span className="h-4 w-px bg-border/40" />
              <span className="inline-flex items-center gap-1.5">
                <span className={cn("size-1.5 rounded-full", statusDot(podmiot.status))} />
                <span className={cn("text-[13px] font-medium", statusColor(podmiot.status))}>
                  {STATUS_PODMIOTU_LABELS[podmiot.status]}
                </span>
              </span>
              <span className="h-4 w-px bg-border/40" />
              <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
                <span className="size-2 rounded-full" style={{ backgroundColor: spolkaConfig?.color }} />
                {spolkaConfig?.name}
              </span>
            </div>
          </div>
          <button
            onClick={() => toast("Edycja danych firmy (demo)")}
            className="mt-2 rounded-lg border border-border/40 px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            Edytuj
          </button>
        </div>

        {/* Info chips */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          {podmiot.miasto && (
            <span className="inline-flex items-center gap-1.5">
              <MapPinIcon className="size-3.5 text-muted-foreground/50" strokeWidth={1.5} />
              {podmiot.adres ? `${podmiot.adres}` : podmiot.miasto}
            </span>
          )}
          {podmiot.branza && (
            <span className="inline-flex items-center gap-1.5">
              <BriefcaseIcon className="size-3.5 text-muted-foreground/50" strokeWidth={1.5} />
              {podmiot.branza}
            </span>
          )}
        </div>
      </div>

      {/* ── Cross-sell callout ── */}
      {wks.length > 0 && (
        <Link
          href={`/widok-wspolny/${podmiot.nip}`}
          className="group flex items-center gap-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/10 border border-blue-200/50 dark:border-blue-800/30 px-5 py-4 mb-8 transition-all hover:shadow-[0_4px_12px_rgba(59,130,246,0.1)] hover:border-blue-300/60 dark:hover:border-blue-700/40 opacity-0 animate-fade-in"
          style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40 shrink-0">
            <UsersIcon className="size-5 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              Wspólny klient
            </p>
            <p className="text-[13px] text-blue-600/70 dark:text-blue-400/60 mt-0.5">
              Ta firma jest również klientem: {wks.map((wk) => SPOLKA_CONFIG[wk.spolka as SpolkaId]?.name ?? wk.spolka).join(", ")}
            </p>
          </div>
          <ArrowUpRightIcon className="size-4 text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors shrink-0" />
        </Link>
      )}

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10">
        {/* ── Left column: contacts ── */}
        <div className="space-y-5 opacity-0 animate-fade-in" style={{ animationDelay: "150ms", animationFillMode: "forwards" }}>
          <SectionHeading
            count={osoby.length}
            action={
              <button
                onClick={() => setFormOpen(true)}
                className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <PlusIcon className="size-3.5" />
                Dodaj
              </button>
            }
          >
            Osoby kontaktowe
          </SectionHeading>

          {osoby.length === 0 ? (
            <p className="text-sm text-muted-foreground/50 py-6">Brak osób kontaktowych</p>
          ) : (
            <div className="space-y-2.5">
              {osoby.map((o) => (
                <div
                  key={o.id}
                  className="group/card rounded-xl border border-border/30 bg-foreground/[0.01] p-4 flex items-start gap-3.5 hover:border-border/50 hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:translate-y-[-1px] transition-all duration-200"
                >
                  <div
                    className="flex size-9 items-center justify-center rounded-full text-[11px] font-bold text-white shrink-0 mt-0.5"
                    style={{ backgroundColor: hexToRgba(spolkaConfig?.color ?? "#6b7280", 0.6) }}
                  >
                    {o.imie[0]}{o.nazwisko[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {o.imie} {o.nazwisko}
                    </p>
                    {o.stanowisko && (
                      <p className="text-xs text-muted-foreground mt-0.5">{o.stanowisko}</p>
                    )}
                    <div className="mt-2 space-y-1">
                      {o.email && (
                        <a href={`mailto:${o.email}`} className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                          <MailIcon className="size-3.5 text-muted-foreground/40" strokeWidth={1.5} />
                          {o.email}
                        </a>
                      )}
                      {o.telefon && (
                        <a href={`tel:${o.telefon}`} className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
                          <PhoneIcon className="size-3.5 text-muted-foreground/40" strokeWidth={1.5} />
                          {o.telefon}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Right column: tables ── */}
        <div className="space-y-8">
          {/* Zgłoszenia */}
          <div className="space-y-4 opacity-0 animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            <SectionHeading count={zgloszenia.length}>Zgłoszenia</SectionHeading>

            {zgloszenia.length === 0 ? (
              <p className="text-sm text-muted-foreground/50 py-6">Brak zgłoszeń</p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border/40">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40 bg-foreground/[0.015]">
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Data</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Handlowiec</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zgloszenia.map((z) => (
                      <tr key={z.id} className="border-b border-border/20 last:border-0 hover:bg-foreground/[0.02] transition-colors duration-100">
                        <td className="px-4 py-3 text-sm tabular-nums text-muted-foreground">{z.data}</td>
                        <td className="px-4 py-3 text-sm text-foreground">
                          {z.handlowiecId ? getPracownikFullName(z.handlowiecId) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("text-[13px] font-medium", zglStatusVariant(z.status))}>
                            {STATUS_LABELS[z.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Projekty */}
          <div className="space-y-4 opacity-0 animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            <SectionHeading
              count={projekty.length}
              action={
                podmiot.status === "klient" ? (
                  <button
                    onClick={() => setProjektFormOpen(true)}
                    className="flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <PlusIcon className="size-3.5" />
                    Dodaj projekt
                  </button>
                ) : undefined
              }
            >
              Projekty
            </SectionHeading>

            {projekty.length === 0 ? (
              <p className="text-sm text-muted-foreground/50 py-6">
                {podmiot.status === "klient"
                  ? "Brak projektów — dodaj projekt opisujący współpracę z klientem"
                  : "Projekty można dodawać po zmianie statusu na klienta"}
              </p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border/40">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40 bg-foreground/[0.015]">
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Nazwa</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Status</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Od</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projekty.map((pr) => (
                      <tr key={pr.id} className="border-b border-border/20 last:border-0 hover:bg-foreground/[0.02] transition-colors duration-100">
                        <td className="px-4 py-3">
                          <Link href={`/v5/projekty/${pr.id}`} className="text-sm font-medium text-foreground hover:underline decoration-foreground/20 underline-offset-2">
                            {pr.nazwa}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("text-[13px] font-medium", pr.status === "aktywny" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                            {pr.status === "aktywny" ? "Aktywny" : "Zakończony"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm tabular-nums text-muted-foreground">{pr.dataOd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {formOpen && (
        <OsobaKontaktowaForm
          podmiotId={podmiot.id}
          open={formOpen}
          onOpenChange={setFormOpen}
        />
      )}

      {projektFormOpen && (
        <ProjektForm
          open={projektFormOpen}
          onOpenChange={setProjektFormOpen}
          defaultPodmiotId={podmiot.id}
        />
      )}
    </div>
  );
}
