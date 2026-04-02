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
import { SPOLKA_CONFIG, type SpolkaId } from "@/features/shared/model/spolki.types";
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
    default: return "text-muted-foreground";
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
    <div className="flex items-center justify-between">
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

/* ─── Field ─── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground mb-1.5">
        {label}
      </dt>
      <dd className="text-sm text-foreground">{children}</dd>
    </div>
  );
}

export default function V4PodmiotDetailPage({
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
        href="/v4/podmioty"
        className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeftIcon className="size-3.5" />
        Firmy
      </Link>

      {/* ── H1 ── */}
      <div className="pb-8 border-b border-border/25">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span
                className="inline-block h-5 w-1 rounded-full"
                style={{ backgroundColor: spolkaConfig?.color }}
              />
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground/50">
                {spolkaConfig?.name}
              </span>
              <span className="text-muted-foreground/20">/</span>
              <span className={cn("text-[11px] font-medium uppercase tracking-[0.12em]", statusColor(podmiot.status))}>
                {STATUS_PODMIOTU_LABELS[podmiot.status]}
              </span>
            </div>
            <h1 className="text-[40px] font-semibold tracking-tight text-foreground leading-[1]">
              {podmiot.nazwa}
            </h1>
            <button
              onClick={() => {
                navigator.clipboard.writeText(podmiot.nip);
                toast("NIP skopiowany");
              }}
              className="group flex items-center gap-1.5 mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="font-mono tabular-nums">NIP {podmiot.nip}</span>
              <CopyIcon className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
          <button
            onClick={() => toast("Edycja danych firmy (demo)")}
            className="mt-8 rounded-lg border border-border/40 px-4 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            Edytuj
          </button>
        </div>
      </div>

      {/* Company data */}
      <div className="grid grid-cols-2 gap-x-16 gap-y-6 sm:grid-cols-4">
        {podmiot.adres && <Field label="Adres">{podmiot.adres}</Field>}
        {podmiot.miasto && <Field label="Miasto">{podmiot.miasto}</Field>}
        {podmiot.branza && <Field label="Branża">{podmiot.branza}</Field>}
        <Field label="Spółka">
          <span className="inline-flex items-center gap-2">
            <span
              className="size-2.5 rounded-full"
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
          className="group flex items-center justify-between rounded-xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/10 px-6 py-4 transition-colors hover:bg-blue-50/70 dark:hover:bg-blue-950/20"
        >
          <div className="flex items-center gap-3">
            <UsersIcon className="size-4 text-blue-500/70" strokeWidth={1.75} />
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Wspólny klient
              </p>
              <p className="text-[13px] text-blue-600/60 dark:text-blue-400/50">
                {wks.map((wk) => SPOLKA_CONFIG[wk.spolka as SpolkaId]?.name ?? wk.spolka).join(", ")}
              </p>
            </div>
          </div>
          <ArrowUpRightIcon className="size-4 text-blue-400/50 group-hover:text-blue-500 transition-colors" />
        </Link>
      )}

      <div className="h-px bg-border/25" />

      {/* Contacts */}
      <div className="space-y-5">
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
          <p className="text-sm text-muted-foreground/50">Brak osób kontaktowych</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {osoby.map((o) => (
              <div
                key={o.id}
                className="rounded-xl border border-border/30 bg-foreground/[0.01] p-5 space-y-3 hover:border-border/50 transition-colors duration-200"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {o.imie} {o.nazwisko}
                  </p>
                  {o.stanowisko && (
                    <p className="text-xs text-muted-foreground mt-0.5">{o.stanowisko}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  {o.email && (
                    <a
                      href={`mailto:${o.email}`}
                      className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MailIcon className="size-3.5 text-muted-foreground/40" strokeWidth={1.5} />
                      {o.email}
                    </a>
                  )}
                  {o.telefon && (
                    <a
                      href={`tel:${o.telefon}`}
                      className="flex items-center gap-2 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <PhoneIcon className="size-3.5 text-muted-foreground/40" strokeWidth={1.5} />
                      {o.telefon}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-px bg-border/25" />

      {/* Zgłoszenia */}
      <div className="space-y-5">
        <SectionHeading count={zgloszenia.length}>Zgłoszenia</SectionHeading>

        {zgloszenia.length === 0 ? (
          <p className="text-sm text-muted-foreground/50">Brak zgłoszeń</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border/40">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 bg-foreground/[0.015]">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Data</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Spółka</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Handlowiec</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {zgloszenia.map((z) => (
                  <tr key={z.id} className="border-b border-border/20 last:border-0 hover:bg-foreground/[0.02] transition-colors duration-100">
                    <td className="px-5 py-3.5 text-sm tabular-nums text-muted-foreground">{z.data}</td>
                    <td className="px-4 py-3.5">
                      {z.spolka ? (
                        <span
                          className="text-[13px] font-medium"
                          style={{ color: SPOLKA_CONFIG[z.spolka as SpolkaId]?.color }}
                        >
                          {SPOLKA_CONFIG[z.spolka as SpolkaId]?.shortName}
                        </span>
                      ) : "\u2014"}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-muted-foreground">
                      {z.handlowiecId ? getPracownikFullName(z.handlowiecId) : "\u2014"}
                    </td>
                    <td className="px-4 py-3.5">
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

      <div className="h-px bg-border/25" />

      {/* Projekty */}
      <div className="space-y-5">
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
          <p className="text-sm text-muted-foreground/50">
            {podmiot.status === "klient"
              ? "Brak projektów — dodaj projekt opisujący współpracę z klientem"
              : "Projekty można dodawać po zmianie statusu na klienta"}
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border/40">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 bg-foreground/[0.015]">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Nazwa</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Charakter</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Od</th>
                </tr>
              </thead>
              <tbody>
                {projekty.map((pr) => (
                  <tr key={pr.id} className="border-b border-border/20 last:border-0 hover:bg-foreground/[0.02] transition-colors duration-100">
                    <td className="px-5 py-3.5">
                      <Link href={`/v4/projekty/${pr.id}`} className="text-sm font-medium text-foreground hover:underline decoration-foreground/20 underline-offset-2">
                        {pr.nazwa}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-muted-foreground">
                      {pr.charakter === "staly" ? "Stały" : pr.charakter === "jednorazowy" ? "Jednorazowy" : "Planowany"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn("text-[13px] font-medium", pr.status === "aktywny" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground")}>
                        {pr.status === "aktywny" ? "Aktywny" : "Zakończony"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm tabular-nums text-muted-foreground">{pr.dataOd}</td>
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
