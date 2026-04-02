"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SpolkaBadge } from "@/components/layout/spolka-badge";
import { StatusBadge } from "@/features/shared/components/status-badge";
import { SPOLKA_CONFIG, type SpolkaId } from "@/features/shared/model/spolki.types";
import {
  BuildingIcon,
  LockIcon,
  UserIcon,
  FolderIcon,
  InboxIcon,
  ArrowUpRightIcon,
  ClockIcon,
  PackageIcon,
  UsersIcon,
} from "lucide-react";
import type { WspolnyKlient, InnaSpolkaInfo } from "../model/wspolni-klienci.types";

interface WspolnyKlientCardProps {
  wspolnyKlient: WspolnyKlient;
}

function statusVariant(status: string) {
  if (status === "klient" || status === "jest klientem") return "success" as const;
  if (status === "w sprzedaży") return "info" as const;
  if (status === "lead" || status === "nowe") return "default" as const;
  if (status === "aktywny") return "success" as const;
  return "muted" as const;
}

function InnaSpolkaCard({ info }: { info: InnaSpolkaInfo }) {
  const config = SPOLKA_CONFIG[info.spolka as SpolkaId];
  const hasAnyData = info.zgloszenia.length > 0 || info.osobyKontaktowe.length > 0 || info.projekty.length > 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SpolkaBadge spolka={info.spolka as SpolkaId} />
            <CardTitle className="text-base">{config?.name ?? info.spolka}</CardTitle>
          </div>
          <StatusBadge label={info.status} variant={statusVariant(info.status)} />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Relacja od: <span className="tabular-nums">{info.dataOd}</span></p>
      </CardHeader>
      <CardContent className="space-y-5">
        {!hasAnyData && (
          <div className="flex items-center gap-2 text-muted-foreground rounded-lg border border-dashed px-3 py-2.5">
            <LockIcon className="size-3.5" />
            <span className="text-xs">Szczegóły nieudostępnione</span>
          </div>
        )}

        {/* Zgłoszenia */}
        {info.zgloszenia.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <InboxIcon className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Zgłoszenia ({info.zgloszenia.length})
              </span>
            </div>
            <div className="space-y-1.5">
              {info.zgloszenia.map((z, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm">
                  <span className="font-mono text-xs text-muted-foreground">{z.numer}</span>
                  <StatusBadge label={z.status} variant={statusVariant(z.status)} />
                  <span className="text-xs text-muted-foreground">{z.zrodlo}</span>
                  <span className="ml-auto text-xs text-muted-foreground tabular-nums">{z.data}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Osoby kontaktowe */}
        {info.osobyKontaktowe.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <UsersIcon className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Osoby kontaktowe ({info.osobyKontaktowe.length})
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {info.osobyKontaktowe.map((o, i) => (
                <div key={i} className="rounded-lg border px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <UserIcon className="size-3 text-muted-foreground" />
                    <span className="text-sm font-medium">{o.imie} {o.nazwisko}</span>
                  </div>
                  {o.stanowisko && <p className="text-xs text-muted-foreground ml-[18px]">{o.stanowisko}</p>}
                  {o.email && <p className="text-xs text-muted-foreground ml-[18px]">{o.email}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projekty */}
        {info.projekty.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <FolderIcon className="size-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Projekty ({info.projekty.length})
              </span>
            </div>
            <div className="space-y-3">
              {info.projekty.map((p, i) => (
                <div key={i} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{p.nazwa}</span>
                    <StatusBadge label={p.status} variant={statusVariant(p.status)} />
                  </div>
                  {p.zakres && (
                    <p className="text-xs text-muted-foreground">{p.zakres}</p>
                  )}
                  {p.wykonawcy.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <UserIcon className="size-3 shrink-0" />
                      {p.wykonawcy.join(", ")}
                    </div>
                  )}
                  {p.uslugi.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <PackageIcon className="size-3 shrink-0" />
                      {p.uslugi.map((u) => `${u.nazwa} (${u.typ})`).join(", ")}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground tabular-nums">od {p.dataOd}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function WspolnyKlientCard({ wspolnyKlient }: WspolnyKlientCardProps) {
  const wk = wspolnyKlient;
  const myConfig = SPOLKA_CONFIG[wk.mojaSpolka.spolka as SpolkaId];

  return (
    <div className="space-y-6">
      {/* Header — dane firmy */}
      <div className="flex items-start gap-4">
        <BuildingIcon className="size-8 text-muted-foreground mt-1" />
        <div>
          <h1 className="text-2xl font-bold">{wk.nazwaFirmy}</h1>
          <p className="text-muted-foreground text-sm">
            NIP: <span className="font-mono tabular-nums">{wk.nip}</span> · {wk.miasto}
          </p>
        </div>
      </div>

      {/* Moja spółka — skrót */}
      <Card className="border-primary/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SpolkaBadge spolka={wk.mojaSpolka.spolka as SpolkaId} />
              <div>
                <p className="text-sm font-medium">Moja spółka — {myConfig?.name}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                  <StatusBadge label={wk.mojaSpolka.status} variant={statusVariant(wk.mojaSpolka.status)} />
                  <span>·</span>
                  <span>{wk.mojaSpolka.aktywneProjektyCount} aktywnych projektów</span>
                  <span>·</span>
                  <span className="tabular-nums">od {wk.mojaSpolka.dataOd}</span>
                </div>
              </div>
            </div>
            <Link
              href={`/podmioty/${wk.nip}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Karta firmy
              <ArrowUpRightIcon className="size-3" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Historia matchów */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ClockIcon className="size-4 text-muted-foreground" />
            Historia matchów
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {wk.matchTimeline.map((m, i) => {
              const spolkaConfig = SPOLKA_CONFIG[m.spolka as SpolkaId];
              return (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="tabular-nums text-muted-foreground w-24 shrink-0">{m.data}</span>
                  <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                  <span>
                    Wykryto match z <span className="font-medium">{spolkaConfig?.name ?? m.spolka}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Inne spółki */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Dane od innych spółek
        </h2>
        {wk.inneSpolki.map((s, i) => (
          <InnaSpolkaCard key={i} info={s} />
        ))}
      </div>
    </div>
  );
}
