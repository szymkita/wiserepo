"use client";

import { useState } from "react";
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
import { PracownikSheet } from "./pracownik-sheet";
import type { Pracownik } from "../model/zespol.types";
import { SearchIcon } from "lucide-react";

interface ZespolTableProps {
  pracownicy: Pracownik[];
}

export function ZespolTable({ pracownicy }: ZespolTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rolaFilter, setRolaFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = pracownicy.filter((p) => {
    if (rolaFilter !== "all" && !p.role.includes(rolaFilter as any)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !`${p.imie} ${p.nazwisko}`.toLowerCase().includes(q) &&
        !p.email.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const selectedPracownik = filtered.find((p) => p.id === selectedId);

  if (pracownicy.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState title="Brak pracowników" description="Nie znaleziono żadnych pracowników." />
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
                placeholder="Szukaj pracownika..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-[250px]"
              />
            </div>
            <Select value={rolaFilter} onValueChange={setRolaFilter}>
              <SelectTrigger className="w-[160px]" aria-label="Filtr roli">
                <SelectValue placeholder="Rola" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie role</SelectItem>
                <SelectItem value="handlowiec">Handlowiec</SelectItem>
                <SelectItem value="wykonawca">Wykonawca</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imię i nazwisko</TableHead>
              <TableHead>Spółka</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefon</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow
                key={p.id}
                className="cursor-pointer group hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedId(p.id)}
              >
                <TableCell className="font-medium">
                  {p.imie} {p.nazwisko}
                </TableCell>
                <TableCell><SpolkaBadge spolka={p.spolka} /></TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {p.role.map((r) => (
                      <StatusBadge
                        key={r}
                        label={r === "handlowiec" ? "Handlowiec" : "Wykonawca"}
                        variant={r === "handlowiec" ? "info" : "success"}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {p.email}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {p.telefon}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <PracownikSheet
        pracownik={selectedPracownik ?? null}
        open={!!selectedPracownik}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      />
    </>
  );
}
