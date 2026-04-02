"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SpolkaBadge } from "@/components/layout/spolka-badge";
import { StatusBadge } from "@/features/shared/components/status-badge";
import { SPOLKI_BEZ_WISEGROUP, SPOLKA_CONFIG } from "@/features/shared/model/spolki.types";
import type { WspolnyKlient } from "../model/wspolni-klienci.types";
import type { SpolkaId } from "@/features/shared/model/spolki.types";

interface WspolniKlienciListProps {
  wspolniKlienci: WspolnyKlient[];
}

function statusVariant(status: string) {
  if (status === "klient") return "success" as const;
  if (status === "w sprzedaży") return "info" as const;
  if (status === "lead") return "default" as const;
  if (status === "nowe") return "default" as const;
  return "muted" as const;
}

export function WspolniKlienciList({ wspolniKlienci }: WspolniKlienciListProps) {
  const [spolkaFilter, setSpolkaFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (spolkaFilter === "all") return wspolniKlienci;
    return wspolniKlienci.filter(
      (wk) =>
        wk.mojaSpolka.spolka === spolkaFilter ||
        wk.inneSpolki.some((s) => s.spolka === spolkaFilter)
    );
  }, [wspolniKlienci, spolkaFilter]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <Select value={spolkaFilter} onValueChange={setSpolkaFilter}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Filtruj po spółce" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie spółki</SelectItem>
              {SPOLKI_BEZ_WISEGROUP.map((s) => (
                <SelectItem key={s} value={s}>{SPOLKA_CONFIG[s].name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Firma</TableHead>
              <TableHead>NIP</TableHead>
              <TableHead>Miasto</TableHead>
              <TableHead>Moja spółka</TableHead>
              <TableHead>Status u mnie</TableHead>
              <TableHead>Inne spółki</TableHead>
              <TableHead>Wykryto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((wk) => (
              <TableRow key={wk.nip}>
                <TableCell>
                  <Link
                    href={`/widok-wspolny/${wk.nip}`}
                    className="font-medium hover:underline"
                  >
                    {wk.nazwaFirmy}
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground tabular-nums">
                  {wk.nip}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {wk.miasto}
                </TableCell>
                <TableCell>
                  <SpolkaBadge spolka={wk.mojaSpolka.spolka as SpolkaId} />
                </TableCell>
                <TableCell>
                  <StatusBadge
                    label={wk.mojaSpolka.status}
                    variant={statusVariant(wk.mojaSpolka.status)}
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {wk.inneSpolki.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <SpolkaBadge spolka={s.spolka as SpolkaId} />
                        <StatusBadge
                          label={s.status}
                          variant={statusVariant(s.status)}
                        />
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm tabular-nums text-muted-foreground">
                  {wk.matchTimeline[0]?.data ?? "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
