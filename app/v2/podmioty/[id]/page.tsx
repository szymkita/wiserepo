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
} from "lucide-react";

const OsobaKontaktowaForm = dynamic(
  () => import("@/features/podmioty/components/osoba-kontaktowa-form").then((m) => m.OsobaKontaktowaForm),
  { ssr: false }
);

const ProjektForm = dynamic(
  () => import("@/features/projekty/components/projekt-form").then((m) => m.ProjektForm),
  { ssr: false }
);

/* ─── Status colors ─── */
function statusColor(status: string) {
  switch (status) {
    case "klient": return "text-emerald-600 dark:text-emerald-400";
    case "lead": return "text-blue-600 dark:text-blue-400";
    default: return "text-muted-foreground/60";
  }
}

function zglStatusVariant(status: string) {
  switch (status) {
    case "jest_klientem": return "text-emerald-600 dark:text-emerald-400";
    case "w_sprzedazy": return "text-blue-600 dark:text-blue-400";
    case "odrzucone": case "przegrane": return "text-red-500/80 dark:text-red-400/80";
    default: return "text-muted-foreground/60";
  }
}

/* ─── Section heading ─── */
function SectionHeading({ children, count, action }: { children: React.ReactNode; count?: number; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-baseline gap-2">
        <h2 className="text-[14px] font-semibold text-foreground">{children}</h2>
        {count !== undefined && (
          <span className="text-[12px] tabular-nums text-muted-foreground/50">{count}</span>
        )}
      </div>
      {action}
    </div>
  );
}

/* ─── Field ─── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/50 mb-1">
        {label}
      </dt>
      <dd className="text-[13px] text-foreground">{children}</dd>
    </div>
  );
}

export default function V2PodmiotDetailPage({
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
    <div className="space-y-10">
      {/* Back */}
      <Link
        href="/v2/podmioty"
        className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground/60 hover:text-foreground transition-colors"
      >
        <ArrowLeftIcon className="size-3" />
        Firmy
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-[26px] font-semibold tracking-tight text-foreground leading-tight">
            {podmiot.nazwa}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(podmiot.nip);
                toast("NIP skopiowany");
              }}
              className="group flex items-center gap-1.5 text-[13px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              <span className="font-mono tabular-nums">{podmiot.nip}</span>
              <CopyIcon className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <span className="h-3.5 w-px bg-border/40" />
            <span
              className={cn("text-[12px] font-medium", statusColor(podmiot.status))}
            >
              {STATUS_PODMIOTU_LABELS[podmiot.status]}
            </span>
          </div>
        </div>
        <button
          onClick={() => toast("Edycja danych firmy (demo)")}
          className="rounded-lg border border-border/40 px-3 py-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
        >
          Edytuj
        </button>
      </div>

      {/* Company data */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-5 sm:grid-cols-4">
        {podmiot.adres && <Field label="Adres">{podmiot.adres}</Field>}
        {podmiot.miasto && <Field label="Miasto">{podmiot.miasto}</Field>}
        {podmiot.branza && <Field label="Branza">{podmiot.branza}</Field>}
        <Field label="Spolka">
          <span className="inline-flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: spolkaConfig?.color }}
            />
            <span>{spolkaConfig?.name}</span>
          </span>
        </Field>
      </div>

      {/* Cross-sell banner */}
      {wks.length > 0 && (
        <Link
          href={`/widok-wspolny/${podmiot.nip}`}
          className="group flex items-center justify-between rounded-xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/10 px-5 py-4 transition-colors hover:bg-blue-50/70 dark:hover:bg-blue-950/20"
        >
          <div className="flex items-center gap-3">
            <UsersIcon className="size-4 text-blue-500/70" strokeWidth={1.75} />
            <div>
              <p className="text-[13px] font-medium text-blue-700 dark:text-blue-300">
                Wspolny klient
              </p>
              <p className="text-[12px] text-blue-600/60 dark:text-blue-400/50">
                {wks.map((wk) => SPOLKA_CONFIG[wk.spolka as SpolkaId]?.name ?? wk.spolka).join(", ")}
              </p>
            </div>
          </div>
          <ArrowUpRightIcon className="size-4 text-blue-400/50 group-hover:text-blue-500 transition-colors" />
        </Link>
      )}

      <div className="h-px bg-border/30" />

      {/* Contacts */}
      <div className="space-y-4">
        <SectionHeading
          count={osoby.length}
          action={
            <button
              onClick={() => setFormOpen(true)}
              className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              <PlusIcon className="size-3.5" />
              Dodaj
            </button>
          }
        >
          Osoby kontaktowe
        </SectionHeading>

        {osoby.length === 0 ? (
          <p className="text-[13px] text-muted-foreground/50">Brak osob kontaktowych</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {osoby.map((o) => (
              <div
                key={o.id}
                className="rounded-xl border border-border/30 bg-foreground/[0.01] p-4 space-y-2"
              >
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    {o.imie} {o.nazwisko}
                  </p>
                  {o.stanowisko && (
                    <p className="text-[11px] text-muted-foreground/50">{o.stanowisko}</p>
                  )}
                </div>
                <div className="space-y-1">
                  {o.email && (
                    <div className="flex items-center gap-1.5">
                      <MailIcon className="size-3 text-muted-foreground/30" strokeWidth={1.5} />
                      <span className="text-[12px] text-muted-foreground/60">{o.email}</span>
                    </div>
                  )}
                  {o.telefon && (
                    <div className="flex items-center gap-1.5">
                      <PhoneIcon className="size-3 text-muted-foreground/30" strokeWidth={1.5} />
                      <span className="text-[12px] text-muted-foreground/60">{o.telefon}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-border/30" />

      {/* Zgloszenia */}
      <div className="space-y-4">
        <SectionHeading count={zgloszenia.length}>Zgloszenia</SectionHeading>

        {zgloszenia.length === 0 ? (
          <p className="text-[13px] text-muted-foreground/50">Brak zgloszen</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border/30">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/40">Data</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/40">Spolka</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/40">Handlowiec</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/40">Status</th>
                </tr>
              </thead>
              <tbody>
                {zgloszenia.map((z) => (
                  <tr key={z.id} className="border-b border-border/15 last:border-0 hover:bg-foreground/[0.01] transition-colors duration-100">
                    <td className="px-4 py-3 text-[13px] tabular-nums text-muted-foreground/70">{z.data}</td>
                    <td className="px-4 py-3">
                      {z.spolka ? (
                        <span
                          className="text-[12px] font-medium"
                          style={{ color: SPOLKA_CONFIG[z.spolka as SpolkaId]?.color }}
                        >
                          {SPOLKA_CONFIG[z.spolka as SpolkaId]?.shortName}
                        </span>
                      ) : "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-muted-foreground/60">
                      {z.handlowiecId ? getPracownikFullName(z.handlowiecId) : "\u2014"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[12px] font-medium", zglStatusVariant(z.status))}>
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

      <div className="h-px bg-border/30" />

      {/* Projekty */}
      <div className="space-y-4">
        <SectionHeading
          count={projekty.length}
          action={
            podmiot.status === "klient" ? (
              <button
                onClick={() => setProjektFormOpen(true)}
                className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground/60 hover:text-foreground transition-colors"
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
          <p className="text-[13px] text-muted-foreground/50">
            {podmiot.status === "klient"
              ? "Brak projektow \u2014 dodaj projekt opisujacy wspolprace z klientem"
              : "Projekty mozna dodawac po zmianie statusu na klienta"}
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border/30">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/40">Nazwa</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/40">Charakter</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/40">Status</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/40">Od</th>
                </tr>
              </thead>
              <tbody>
                {projekty.map((pr) => (
                  <tr key={pr.id} className="border-b border-border/15 last:border-0 hover:bg-foreground/[0.01] transition-colors duration-100">
                    <td className="px-4 py-3">
                      <Link href={`/v2/projekty/${pr.id}`} className="text-[13px] font-medium text-foreground hover:underline decoration-foreground/20 underline-offset-2">
                        {pr.nazwa}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-muted-foreground/60">
                      {pr.charakter === "staly" ? "Staly" : pr.charakter === "jednorazowy" ? "Jednorazowy" : "Planowany"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-[12px] font-medium", pr.status === "aktywny" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground/50")}>
                        {pr.status === "aktywny" ? "Aktywny" : "Zakonczony"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px] tabular-nums text-muted-foreground/60">{pr.dataOd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
