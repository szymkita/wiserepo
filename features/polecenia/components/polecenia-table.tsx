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
import { SearchIcon, InboxIcon } from "lucide-react";
import { SpolkaBadge } from "@/components/layout/spolka-badge";
import { StatusBadge } from "@/features/shared/components/status-badge";
import { EmptyState } from "@/features/shared/components/empty-state";
import { PolecenieSheet } from "./polecenie-sheet";
import type { Polecenie } from "../model/polecenia.types";
import {
  TYP_POLECENIA_LABELS,
  STATUS_POLECENIA_LABELS,
  typPolecenia,
  statusPolecenia,
} from "../model/polecenia.types";
import { getPodmiotById } from "@/features/podmioty/model/podmioty.data-source";
import { getPracownikFullName } from "@/features/zespol/model/zespol.data-source";

interface PoleceniaTableProps {
  polecenia: Polecenie[];
}

export function PoleceniaTable({ polecenia }: PoleceniaTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [typFilter, setTypFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = polecenia.filter((p) => {
    if (typFilter !== "all" && p.typ !== typFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (searchQuery) {
      const podmiot = getPodmiotById(p.podmiotId);
      if (!podmiot?.nazwa.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  const selectedPolecenie = filtered.find((p) => p.id === selectedId);

  if (polecenia.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <InboxIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-1">Brak poleceń</h3>
          <p className="text-muted-foreground text-center">Nie ma jeszcze żadnych poleceń wewnętrznych.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Szukaj..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typFilter} onValueChange={setTypFilter}>
              <SelectTrigger className="w-[160px]" aria-label="Filtr typu">
                <SelectValue placeholder="Typ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie typy</SelectItem>
                {typPolecenia.map((t) => (
                  <SelectItem key={t} value={t}>{TYP_POLECENIA_LABELS[t]}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]" aria-label="Filtr statusu">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie statusy</SelectItem>
                {statusPolecenia.map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_POLECENIA_LABELS[s]}</SelectItem>
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
              <TableHead>Data</TableHead>
              <TableHead>Firma</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Polecający</TableHead>
              <TableHead>Kierunek</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prowizja</TableHead>
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
                  <TableCell className="tabular-nums whitespace-nowrap">
                    {p.data}
                  </TableCell>
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
                  <TableCell>
                    <StatusBadge
                      label={TYP_POLECENIA_LABELS[p.typ]}
                      variant={p.typ === "aktywne" ? "info" : "muted"}
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {getPracownikFullName(p.polecajacyId)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <SpolkaBadge spolka={p.spolkaZrodlowa} />
                      <span className="text-muted-foreground text-xs">→</span>
                      <SpolkaBadge spolka={p.spolkaDocelowa} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      label={STATUS_POLECENIA_LABELS[p.status]}
                      variant={
                        p.status === "wygrana"
                          ? "success"
                          : p.status === "odrzucone"
                            ? "destructive"
                            : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {p.prowizjaNalezna ? (
                      <StatusBadge label="Tak" variant="success" />
                    ) : (
                      <StatusBadge label="Nie" variant="muted" />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <PolecenieSheet
        polecenie={selectedPolecenie ?? null}
        open={!!selectedPolecenie}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      />
    </>
  );
}
