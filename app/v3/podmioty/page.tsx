"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { getPodmiotyWithRelations } from "@/features/podmioty/model/podmioty.data-source";
import { useActiveSystem } from "@/features/shared/context/active-system-context";
import { STATUS_PODMIOTU_LABELS } from "@/features/podmioty/model/podmioty.types";
import { SPOLKA_CONFIG, type SpolkaId } from "@/features/shared/model/spolki.types";
import {
  BuildingIcon,
  ArrowUpRightIcon,
  UsersIcon,
  FilterIcon,
} from "lucide-react";

/* ─── Status styles ─── */
function statusClasses(status: string) {
  switch (status) {
    case "klient":
      return { text: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" };
    case "lead":
      return { text: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30" };
    default:
      return { text: "text-muted-foreground", bg: "bg-muted/50" };
  }
}

export default function V3PodmiotyPage() {
  const { activeSystem } = useActiveSystem();
  const allPodmioty = getPodmiotyWithRelations(activeSystem);
  const podmioty = allPodmioty.filter((p) => p.spolka === activeSystem);

  const klienciCount = podmioty.filter((p) => p.status === "klient").length;
  const leadCount = podmioty.filter((p) => p.status === "lead").length;

  return (
    <div className="space-y-6">
      {/* Page heading + actions */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Firmy
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Rejestr firm z potwierdzonymi NIP-ami
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors">
          <FilterIcon className="size-3.5" strokeWidth={1.75} />
          Filtruj
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Wszystkie firmy", value: podmioty.length, color: "bg-foreground/[0.04]" },
          { label: "Klienci", value: klienciCount, color: "bg-emerald-50 dark:bg-emerald-950/20" },
          { label: "Leady", value: leadCount, color: "bg-blue-50 dark:bg-blue-950/20" },
        ].map((stat) => (
          <div key={stat.label} className={cn("rounded-xl px-5 py-4", stat.color)}>
            <p className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      {podmioty.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-xl border border-border/40 bg-muted/20">
          <div className="flex size-14 items-center justify-center rounded-full bg-muted">
            <BuildingIcon className="size-6 text-muted-foreground/50" strokeWidth={1.5} />
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            Brak firm do wyświetlenia
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            Dodaj pierwszą firmę, aby rozpocząć
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30 border-b border-border/40">
                <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Nazwa firmy
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  NIP
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Miasto
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">
                  Zgłoszenia
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">
                  Projekty
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Wspólny klient
                </th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {podmioty.map((p) => {
                const wks = p.wspolneZSpolkami;
                const st = statusClasses(p.status);
                return (
                  <tr
                    key={p.id}
                    className="group transition-colors duration-100 hover:bg-muted/20"
                  >
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/v3/podmioty/${p.id}`}
                        className="text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
                      >
                        {p.nazwa}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[13px] text-muted-foreground tabular-nums">
                        {p.nip}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-muted-foreground">
                        {p.miasto ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                          st.bg, st.text
                        )}
                      >
                        {STATUS_PODMIOTU_LABELS[p.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {p.zgloszenCount || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {p.projektCount || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {wks.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="size-3.5 text-blue-500" strokeWidth={1.75} />
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                            {wks.map((w) => SPOLKA_CONFIG[w.spolka as SpolkaId]?.shortName ?? w.spolka).join(", ")}
                          </span>
                        </div>
                      ) : null}
                    </td>
                    <td className="px-3 py-3.5">
                      <Link
                        href={`/v3/podmioty/${p.id}`}
                        className="flex items-center justify-center size-7 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted/50 transition-all duration-150"
                      >
                        <ArrowUpRightIcon className="size-3.5 text-muted-foreground" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 bg-muted/20 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              Wyświetlono <span className="font-medium text-foreground">{podmioty.length}</span> firm
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
