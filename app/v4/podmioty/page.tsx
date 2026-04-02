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

/* ─── Inline status variant ─── */
function statusStyle(status: string) {
  switch (status) {
    case "klient":
      return "text-emerald-600 dark:text-emerald-400";
    case "lead":
      return "text-blue-600 dark:text-blue-400";
    default:
      return "text-muted-foreground/60";
  }
}

export default function V4PodmiotyPage() {
  const { activeSystem } = useActiveSystem();
  const allPodmioty = getPodmiotyWithRelations(activeSystem);
  const podmioty = allPodmioty.filter((p) => p.spolka === activeSystem);

  const klienciCount = podmioty.filter((p) => p.status === "klient").length;
  const leadCount = podmioty.filter((p) => p.status === "lead").length;

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
          Firmy
        </h1>
        <p className="mt-1 text-[13px] text-muted-foreground/70">
          Rejestr firm z potwierdzonymi NIP-ami
        </p>
      </div>

      {/* Stats strip */}
      <div className="flex items-center gap-6">
        {[
          { label: "Wszystkie", value: podmioty.length },
          { label: "Klienci", value: klienciCount },
          { label: "Leady", value: leadCount },
        ].map((stat) => (
          <div key={stat.label} className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
              {stat.value}
            </span>
            <span className="text-[12px] text-muted-foreground/60">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Table */}
      {podmioty.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="flex size-12 items-center justify-center rounded-full bg-foreground/[0.04]">
            <BuildingIcon className="size-5 text-muted-foreground/40" strokeWidth={1.5} />
          </div>
          <p className="mt-4 text-[13px] font-medium text-muted-foreground/70">
            Brak firm
          </p>
        </div>
      ) : (
        <div>
          <div className="overflow-hidden rounded-xl border border-border/40">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/60">
                    Nazwa
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/60">
                    NIP
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/60">
                    Miasto
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/60">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/60">
                    Zgłoszenia
                  </th>
                  <th className="px-4 py-3 text-center text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/60">
                    Projekty
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/60">
                    Wspólny klient
                  </th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {podmioty.map((p) => {
                  const wks = p.wspolneZSpolkami;
                  return (
                    <tr
                      key={p.id}
                      className="group border-b border-border/20 last:border-0 transition-colors duration-100 hover:bg-foreground/[0.025]"
                    >
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/v4/podmioty/${p.id}`}
                          className="text-[13px] font-medium text-foreground hover:underline decoration-foreground/20 underline-offset-2"
                        >
                          {p.nazwa}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-[12px] text-muted-foreground/70 tabular-nums">
                          {p.nip}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[13px] text-muted-foreground/70">
                          {p.miasto ?? "\u2014"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "text-[12px] font-medium",
                            statusStyle(p.status)
                          )}
                        >
                          {STATUS_PODMIOTU_LABELS[p.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-[13px] tabular-nums text-muted-foreground/70">
                          {p.zgloszenCount || "\u2014"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="text-[13px] tabular-nums text-muted-foreground/70">
                          {p.projektCount || "\u2014"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {wks.length > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <UsersIcon className="size-3 text-blue-500/60" strokeWidth={1.75} />
                            <span className="text-[11px] font-medium text-blue-600/70 dark:text-blue-400/70">
                              {wks.map((w) => SPOLKA_CONFIG[w.spolka as SpolkaId]?.shortName ?? w.spolka).join(", ")}
                            </span>
                          </div>
                        ) : null}
                      </td>
                      <td className="px-2 py-3.5">
                        <Link
                          href={`/v4/podmioty/${p.id}`}
                          className="flex items-center justify-center size-6 rounded-md opacity-0 group-hover:opacity-100 hover:bg-foreground/[0.04] transition-all duration-150"
                        >
                          <ArrowUpRightIcon className="size-3.5 text-muted-foreground/50" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2.5 px-1 text-[11px] text-muted-foreground/40">
            {podmioty.length} {podmioty.length === 1 ? "firma" : podmioty.length < 5 ? "firmy" : "firm"}
          </p>
        </div>
      )}
    </div>
  );
}
