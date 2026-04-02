"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getPodmiotyWithRelations } from "@/features/podmioty/model/podmioty.data-source";
import { useActiveSystem } from "@/features/shared/context/active-system-context";
import { STATUS_PODMIOTU_LABELS, type statusPodmiotu } from "@/features/podmioty/model/podmioty.types";
import { SPOLKA_CONFIG, type SpolkaId } from "@/features/shared/model/spolki.types";
import {
  BuildingIcon,
  ArrowUpRightIcon,
  UsersIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

type StatusFilter = (typeof statusPodmiotu)[number] | "all";

export default function V5PodmiotyPage() {
  const { activeSystem } = useActiveSystem();
  const allPodmioty = getPodmiotyWithRelations(activeSystem);
  const allForSpolka = allPodmioty.filter((p) => p.spolka === activeSystem);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const podmioty = allForSpolka.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search && !p.nazwa.toLowerCase().includes(search.toLowerCase()) && !p.nip.includes(search)) return false;
    return true;
  });

  const klienciCount = allForSpolka.filter((p) => p.status === "klient").length;
  const leadCount = allForSpolka.filter((p) => p.status === "lead").length;

  return (
    <div className="space-y-6">
      {/* ── H1 ── */}
      <h1 className="text-[44px] font-bold tracking-tight text-foreground leading-[1]">
        Firmy
      </h1>

      {/* ── Filters ── */}
      <div className="flex items-center gap-3">
        {/* Status tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-border/40 p-1">
          {([
            { key: "all" as StatusFilter, label: "Wszystkie", count: allForSpolka.length },
            { key: "klient" as StatusFilter, label: "Klienci", count: klienciCount },
            { key: "lead" as StatusFilter, label: "Leady", count: leadCount },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-all duration-150",
                statusFilter === tab.key
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
              )}
            >
              {tab.label}
              <span className={cn(
                "tabular-nums text-[11px]",
                statusFilter === tab.key ? "text-background/60" : "text-muted-foreground/50"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative ml-auto">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50" strokeWidth={1.75} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj firm..."
            className="h-9 w-56 rounded-lg border border-border/40 bg-transparent pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-border focus:ring-1 focus:ring-border/30 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      {podmioty.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex size-12 items-center justify-center rounded-full bg-foreground/[0.04]">
            <BuildingIcon className="size-5 text-muted-foreground/40" strokeWidth={1.5} />
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            {search || statusFilter !== "all" ? "Brak wyników" : "Brak firm"}
          </p>
          {(search || statusFilter !== "all") && (
            <button
              onClick={() => { setSearch(""); setStatusFilter("all"); }}
              className="mt-2 text-[13px] text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              Wyczyść filtry
            </button>
          )}
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
                          <span className="inline-flex items-center gap-1.5 flex-wrap">
                            <UsersIcon className="size-3.5 text-blue-500/70 shrink-0" strokeWidth={1.75} />
                            {wks.map((w, wi) => {
                              const wkConfig = SPOLKA_CONFIG[w.spolka as SpolkaId];
                              if (!wkConfig) return null;
                              return (
                                <Tooltip key={w.spolka}>
                                  <TooltipTrigger asChild>
                                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 cursor-default">
                                      {wkConfig.name}{wi < wks.length - 1 ? "," : ""}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">
                                    <p className="font-semibold text-xs">{wkConfig.name}</p>
                                    <p className="text-[11px] text-muted-foreground mt-0.5">
                                      {w.status === "klient" ? "Klient" : w.status === "lead" ? "Lead" : w.status} · od {w.dataOd}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
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
            {statusFilter !== "all" && ` · filtr: ${statusFilter === "klient" ? "klienci" : "leady"}`}
          </p>
        </div>
      )}
    </div>
  );
}
