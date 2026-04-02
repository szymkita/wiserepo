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
} from "lucide-react";

/* ─── Status ─── */
function statusDot(status: string) {
  switch (status) {
    case "klient": return "bg-emerald-500";
    case "lead": return "bg-blue-500";
    default: return "bg-muted-foreground/40";
  }
}
function statusText(status: string) {
  switch (status) {
    case "klient": return "text-emerald-600 dark:text-emerald-400";
    case "lead": return "text-blue-600 dark:text-blue-400";
    default: return "text-muted-foreground";
  }
}

export default function V5PodmiotyPage() {
  const { activeSystem } = useActiveSystem();
  const config = SPOLKA_CONFIG[activeSystem];
  const allPodmioty = getPodmiotyWithRelations(activeSystem);
  const podmioty = allPodmioty.filter((p) => p.spolka === activeSystem);

  const klienciCount = podmioty.filter((p) => p.status === "klient").length;
  const leadCount = podmioty.filter((p) => p.status === "lead").length;

  return (
    <div className="space-y-8">
      {/* ── H1 ── */}
      <div className="pb-7 border-b border-border/30">
        <div className="flex items-end justify-between">
          <h1 className="text-[40px] font-bold tracking-tight text-foreground leading-[1]">
            Firmy
          </h1>
          <div className="flex items-center gap-10 pb-2">
            {[
              { label: "Wszystkie", value: podmioty.length, color: "text-foreground" },
              { label: "Klienci", value: klienciCount, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Leady", value: leadCount, color: "text-blue-600 dark:text-blue-400" },
            ].map((stat) => (
              <div key={stat.label} className="text-right">
                <p className={cn("text-[32px] font-semibold tracking-tight tabular-nums leading-[1]", stat.color)}>
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      {podmioty.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex size-12 items-center justify-center rounded-full bg-foreground/[0.04]">
            <BuildingIcon className="size-5 text-muted-foreground/40" strokeWidth={1.5} />
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            Brak firm
          </p>
        </div>
      ) : (
        <div>
          <div className="overflow-hidden rounded-xl border border-border/50">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-foreground/[0.015]">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                    Firma
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                    NIP
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                    Zgłoszenia
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                    Projekty
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                    Wspólny klient
                  </th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {podmioty.map((p, i) => {
                  const wks = p.wspolneZSpolkami;
                  return (
                    <Link
                      key={p.id}
                      href={`/v5/podmioty/${p.id}`}
                      className={cn(
                        "group table-row border-b border-border/25 last:border-0 transition-colors duration-100 hover:bg-foreground/[0.025] cursor-pointer",
                        "opacity-0 animate-fade-in",
                      )}
                      style={{ animationDelay: `${Math.min(i * 30, 300)}ms`, animationFillMode: "forwards" }}
                    >
                      {/* Firma — two-line: name + city */}
                      <td className="px-5 py-3">
                        <p className="text-sm font-medium text-foreground group-hover:underline decoration-foreground/20 underline-offset-2">
                          {p.nazwa}
                        </p>
                        <p className="text-[12px] text-muted-foreground/60 mt-0.5">
                          {p.miasto ?? "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[13px] text-muted-foreground tabular-nums tracking-[0.02em]">
                          {p.nip}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <span className={cn("size-1.5 rounded-full", statusDot(p.status))} />
                          <span className={cn("text-[13px] font-medium", statusText(p.status))}>
                            {STATUS_PODMIOTU_LABELS[p.status]}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm tabular-nums text-muted-foreground">
                          {p.zgloszenCount || "\u2014"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm tabular-nums text-muted-foreground">
                          {p.projektCount || "\u2014"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {wks.length > 0 ? (
                          <span className="inline-flex items-center gap-1.5">
                            <UsersIcon className="size-3.5 text-blue-500/70" strokeWidth={1.75} />
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                              {wks.map((w) => SPOLKA_CONFIG[w.spolka as SpolkaId]?.shortName ?? w.spolka).join(", ")}
                            </span>
                          </span>
                        ) : null}
                      </td>
                      <td className="px-2 py-3">
                        <span className="flex items-center justify-center size-6 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-150">
                          <ArrowUpRightIcon className="size-3.5 text-muted-foreground" />
                        </span>
                      </td>
                    </Link>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 px-1 text-[11px] text-muted-foreground/40 tabular-nums">
            {podmioty.length} {podmioty.length === 1 ? "firma" : podmioty.length < 5 ? "firmy" : "firm"}
          </p>
        </div>
      )}
    </div>
  );
}
