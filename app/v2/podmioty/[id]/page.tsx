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
  EditIcon,
  MapPinIcon,
  BriefcaseIcon,
} from "lucide-react";

const OsobaKontaktowaForm = dynamic(
  () => import("@/features/podmioty/components/osoba-kontaktowa-form").then((m) => m.OsobaKontaktowaForm),
  { ssr: false }
);

const ProjektForm = dynamic(
  () => import("@/features/projekty/components/projekt-form").then((m) => m.ProjektForm),
  { ssr: false }
);

/* ─── Status pill ─── */
function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    klient: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
    lead: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    byly_klient: "bg-muted text-muted-foreground",
  };
  return (
    <span className={cn("inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium", styles[status] ?? styles.byly_klient)}>
      {STATUS_PODMIOTU_LABELS[status as keyof typeof STATUS_PODMIOTU_LABELS] ?? status}
    </span>
  );
}

/* ─── Zgłoszenie status ─── */
function ZglStatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    jest_klientem: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
    w_sprzedazy: "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    odrzucone: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
    przegrane: "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400",
    nowe: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400",
    spam: "bg-muted text-muted-foreground",
  };
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", styles[status] ?? "bg-muted text-muted-foreground")}>
      {STATUS_LABELS[status as keyof typeof STATUS_LABELS] ?? status}
    </span>
  );
}

/* ─── Section ─── */
function Section({ title, count, action, children }: { title: string; count?: number; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {count !== undefined && (
            <span className="flex items-center justify-center h-5 min-w-5 rounded-full bg-muted px-1.5 text-[11px] font-semibold tabular-nums text-muted-foreground">
              {count}
            </span>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ─── Detail field ─── */
function DetailField({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2 text-sm text-foreground">
        {icon}
        {value}
      </div>
    </div>
  );
}

/* ─── Action button ─── */
function ActionButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg border border-border/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/30 transition-all duration-150"
    >
      {children}
    </button>
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
    <div className="space-y-8">
      {/* Back */}
      <Link
        href="/v2/podmioty"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeftIcon className="size-3.5" />
        Firmy
      </Link>

      {/* Header card */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {podmiot.nazwa}
              </h1>
              <StatusPill status={podmiot.status} />
            </div>
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(podmiot.nip);
                  toast("NIP skopiowany do schowka");
                }}
                className="group inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="font-mono tabular-nums">NIP: {podmiot.nip}</span>
                <CopyIcon className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              {podmiot.miasto && (
                <>
                  <span className="text-border">|</span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPinIcon className="size-3.5" strokeWidth={1.75} />
                    {podmiot.miasto}
                  </span>
                </>
              )}
              <span className="text-border">|</span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: spolkaConfig?.color }}
                />
                {spolkaConfig?.name}
              </span>
            </div>
          </div>
          <ActionButton onClick={() => toast("Edycja danych firmy (demo)")}>
            <EditIcon className="size-3.5" />
            Edytuj
          </ActionButton>
        </div>

        {/* Expanded company info */}
        {(podmiot.adres || podmiot.branza) && (
          <div className="mt-5 pt-5 border-t border-border/30 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {podmiot.adres && <DetailField label="Adres" value={podmiot.adres} />}
            {podmiot.miasto && <DetailField label="Miasto" value={podmiot.miasto} />}
            {podmiot.branza && (
              <DetailField
                label="Branża"
                value={podmiot.branza}
                icon={<BriefcaseIcon className="size-3.5 text-muted-foreground/60" strokeWidth={1.5} />}
              />
            )}
            <DetailField
              label="Spółka"
              value={
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ backgroundColor: spolkaConfig?.color }} />
                  {spolkaConfig?.name}
                </span>
              }
            />
          </div>
        )}
      </div>

      {/* Cross-sell banner */}
      {wks.length > 0 && (
        <Link
          href={`/widok-wspolny/${podmiot.nip}`}
          className="group flex items-center justify-between rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/15 px-5 py-4 transition-all hover:bg-blue-50 dark:hover:bg-blue-950/25 hover:border-blue-300 dark:hover:border-blue-800"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
              <UsersIcon className="size-4 text-blue-600 dark:text-blue-400" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Wspólny klient
              </p>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/60">
                {wks.map((wk) => SPOLKA_CONFIG[wk.spolka as SpolkaId]?.name ?? wk.spolka).join(" · ")}
              </p>
            </div>
          </div>
          <ArrowUpRightIcon className="size-4 text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors" />
        </Link>
      )}

      {/* Contacts */}
      <Section
        title="Osoby kontaktowe"
        count={osoby.length}
        action={
          <ActionButton onClick={() => setFormOpen(true)}>
            <PlusIcon className="size-3.5" />
            Dodaj osobę
          </ActionButton>
        }
      >
        {osoby.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/50 bg-muted/10 py-10 text-center">
            <p className="text-sm text-muted-foreground">Brak osób kontaktowych</p>
            <p className="mt-1 text-xs text-muted-foreground/70">Dodaj pierwszą osobę kontaktową</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {osoby.map((o) => (
              <div
                key={o.id}
                className="rounded-xl border border-border/40 bg-card p-4 hover:border-border/60 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {o.imie} {o.nazwisko}
                    </p>
                    {o.stanowisko && (
                      <p className="text-xs text-muted-foreground mt-0.5">{o.stanowisko}</p>
                    )}
                  </div>
                </div>
                <div className="mt-3 space-y-1.5">
                  {o.email && (
                    <a href={`mailto:${o.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <MailIcon className="size-3.5 text-muted-foreground/50" strokeWidth={1.5} />
                      {o.email}
                    </a>
                  )}
                  {o.telefon && (
                    <a href={`tel:${o.telefon}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <PhoneIcon className="size-3.5 text-muted-foreground/50" strokeWidth={1.5} />
                      {o.telefon}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Zgłoszenia */}
      <Section title="Zgłoszenia" count={zgloszenia.length}>
        {zgloszenia.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/50 bg-muted/10 py-10 text-center">
            <p className="text-sm text-muted-foreground">Brak zgłoszeń</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 border-b border-border/40">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Data</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Spółka</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Handlowiec</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/25">
                {zgloszenia.map((z) => (
                  <tr key={z.id} className="hover:bg-muted/15 transition-colors duration-100">
                    <td className="px-4 py-3 text-sm tabular-nums text-muted-foreground">{z.data}</td>
                    <td className="px-4 py-3">
                      {z.spolka ? (
                        <span className="inline-flex items-center gap-1.5 text-sm">
                          <span
                            className="size-2 rounded-full"
                            style={{ backgroundColor: SPOLKA_CONFIG[z.spolka as SpolkaId]?.color }}
                          />
                          <span className="font-medium">{SPOLKA_CONFIG[z.spolka as SpolkaId]?.shortName}</span>
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {z.handlowiecId ? getPracownikFullName(z.handlowiecId) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <ZglStatusPill status={z.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* Projekty */}
      <Section
        title="Projekty"
        count={projekty.length}
        action={
          podmiot.status === "klient" ? (
            <ActionButton onClick={() => setProjektFormOpen(true)}>
              <PlusIcon className="size-3.5" />
              Dodaj projekt
            </ActionButton>
          ) : undefined
        }
      >
        {projekty.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/50 bg-muted/10 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              {podmiot.status === "klient"
                ? "Brak projektów — dodaj projekt opisujący współpracę z klientem"
                : "Projekty można dodawać po zmianie statusu na klienta"}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30 border-b border-border/40">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Nazwa</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Charakter</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Od</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/25">
                {projekty.map((pr) => (
                  <tr key={pr.id} className="hover:bg-muted/15 transition-colors duration-100">
                    <td className="px-4 py-3">
                      <Link href={`/v2/projekty/${pr.id}`} className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors">
                        {pr.nazwa}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {pr.charakter === "staly" ? "Stały" : pr.charakter === "jednorazowy" ? "Jednorazowy" : "Planowany"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                        pr.status === "aktywny"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      )}>
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
      </Section>

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
