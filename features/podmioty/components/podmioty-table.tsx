"use client";

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
import { InboxIcon, UsersIcon } from "lucide-react";
import { SpolkaBadge } from "@/components/layout/spolka-badge";
import { StatusBadge } from "@/features/shared/components/status-badge";
import { EmptyState } from "@/features/shared/components/empty-state";
import { SPOLKA_CONFIG, type SpolkaId } from "@/features/shared/model/spolki.types";
import { STATUS_PODMIOTU_LABELS } from "../model/podmioty.types";
import type { PodmiotWithRelations } from "../model/podmioty.types";

interface PodmiotyTableProps {
  podmioty: PodmiotWithRelations[];
}

export function PodmiotyTable({ podmioty }: PodmiotyTableProps) {
  if (podmioty.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <InboxIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-1">Brak firm</h3>
          <p className="text-muted-foreground text-center">Nie znaleziono żadnych firm.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nazwa</TableHead>
            <TableHead>NIP</TableHead>
            <TableHead>Miasto</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Zgłoszenia</TableHead>
            <TableHead className="text-center">Projekty</TableHead>
            <TableHead>Wspólny klient</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {podmioty.map((p) => {
            const wks = p.wspolneZSpolkami;
            return (
              <TableRow key={p.id}>
                <TableCell>
                  <Link
                    href={`/podmioty/${p.id}`}
                    className="font-medium hover:underline"
                  >
                    {p.nazwa}
                  </Link>
                </TableCell>
                <TableCell className="tabular-nums font-mono text-sm text-muted-foreground">
                  {p.nip}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {p.miasto ?? "—"}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    label={STATUS_PODMIOTU_LABELS[p.status]}
                    variant={p.status === "klient" ? "success" : p.status === "lead" ? "info" : "muted"}
                  />
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {p.zgloszenCount}
                </TableCell>
                <TableCell className="text-center tabular-nums">
                  {p.projektCount}
                </TableCell>
                <TableCell>
                  {wks.length > 0 ? (
                    <div className="flex items-center gap-1.5">
                      <UsersIcon className="size-3.5 text-blue-500 shrink-0" />
                      <span className="text-xs text-blue-600 font-medium">
                        {wks.map((w) => SPOLKA_CONFIG[w.spolka as SpolkaId]?.shortName ?? w.spolka).join(", ")}
                      </span>
                    </div>
                  ) : null}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
