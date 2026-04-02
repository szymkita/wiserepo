"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SpolkaBadge } from "@/components/layout/spolka-badge";
import { StatusBadge } from "@/features/shared/components/status-badge";
import { EmptyState } from "@/features/shared/components/empty-state";
import { ProjektSheet } from "./projekt-sheet";
import type { Projekt } from "../model/projekty.types";
import {
  CHARAKTER_LABELS,
  STATUS_PROJEKTU_LABELS,
  statusProjektu,
} from "../model/projekty.types";
import { getPodmiotById } from "@/features/podmioty/model/podmioty.data-source";
import { SearchIcon } from "lucide-react";

interface ProjektyTableProps {
  projekty: Projekt[];
}

export function ProjektyTable({ projekty }: ProjektyTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = projekty.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const podmiot = getPodmiotById(p.podmiotId);
      if (
        !p.nazwa.toLowerCase().includes(q) &&
        !(podmiot?.nazwa.toLowerCase().includes(q))
      )
        return false;
    }
    return true;
  });

  const selectedProjekt = filtered.find((p) => p.id === selectedId);

  if (projekty.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState title="Brak projektów" description="Nie znaleziono żadnych projektów." />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Szukaj projektu lub klienta..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-[250px]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]" aria-label="Filtr statusu">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie statusy</SelectItem>
                {statusProjektu.map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_PROJEKTU_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nazwa</TableHead>
              <TableHead>Firma</TableHead>
              <TableHead>Spółka</TableHead>
              <TableHead>Charakter</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Okres</TableHead>
              <TableHead className="text-center">Usługi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => {
              const podmiot = getPodmiotById(p.podmiotId);
              return (
                <TableRow
                  key={p.id}
                  className="cursor-pointer group hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedId(p.id)}
                >
                  <TableCell className="font-medium">{p.nazwa}</TableCell>
                  <TableCell>
                    {podmiot ? (
                      <Link
                        href={`/podmioty/${podmiot.id}`}
                        className="text-primary underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {podmiot.nazwa}
                      </Link>
                    ) : "—"}
                  </TableCell>
                  <TableCell><SpolkaBadge spolka={p.spolka} /></TableCell>
                  <TableCell>{CHARAKTER_LABELS[p.charakter]}</TableCell>
                  <TableCell>
                    <StatusBadge
                      label={STATUS_PROJEKTU_LABELS[p.status]}
                      variant={p.status === "aktywny" ? "success" : "muted"}
                    />
                  </TableCell>
                  <TableCell className="tabular-nums whitespace-nowrap text-xs">
                    {p.dataOd}{p.dataDo ? ` → ${p.dataDo}` : " → …"}
                  </TableCell>
                  <TableCell className="text-center tabular-nums">
                    {p.uslugaIds.length}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <ProjektSheet
        projekt={selectedProjekt ?? null}
        open={!!selectedProjekt}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      />
    </>
  );
}
