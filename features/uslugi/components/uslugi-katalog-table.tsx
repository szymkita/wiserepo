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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { SpolkaBadge } from "@/components/layout/spolka-badge";
import { StatusBadge } from "@/features/shared/components/status-badge";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/features/shared/components/empty-state";
import type { Usluga } from "../model/uslugi.types";
import { TYP_USLUGI_LABELS } from "../model/uslugi.types";
import { getProjektyDlaUslugi } from "@/features/projekty/model/projekty.data-source";
import { getPodmiotById } from "@/features/podmioty/model/podmioty.data-source";
import Link from "next/link";

interface UslugiKatalogTableProps {
  uslugi: Usluga[];
}

export function UslugiKatalogTable({ uslugi }: UslugiKatalogTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = uslugi.find((u) => u.id === selectedId);

  if (uslugi.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState title="Brak usług" description="Katalog usług jest pusty." />
        </CardContent>
      </Card>
    );
  }

  const projekty = selected ? getProjektyDlaUslugi(selected.id) : [];
  const podmiotIds = [...new Set(projekty.map((p) => p.podmiotId))];

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nazwa</TableHead>
              <TableHead>Spółka</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Opis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uslugi.map((u) => (
              <TableRow key={u.id} className="cursor-pointer group hover:bg-muted/50 transition-colors" onClick={() => setSelectedId(u.id)}>
                <TableCell className="font-medium">{u.nazwa}</TableCell>
                <TableCell><SpolkaBadge spolka={u.spolka} /></TableCell>
                <TableCell>
                  <StatusBadge
                    label={TYP_USLUGI_LABELS[u.typ]}
                    variant={u.typ === "abonamentowa" ? "info" : "muted"}
                  />
                </TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground text-sm">
                  {u.opis || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Sheet open={!!selected} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <SheetContent className="sm:max-w-2xl">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.nazwa}</SheetTitle>
                <SheetDescription>
                  {TYP_USLUGI_LABELS[selected.typ]} · <SpolkaBadge spolka={selected.spolka} />
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {selected.opis ? (
                  <section>
                    <h4 className="mb-2 text-sm font-semibold text-muted-foreground">Opis</h4>
                    <p className="text-sm">{selected.opis}</p>
                  </section>
                ) : null}
                <Separator />
                <section>
                  <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
                    Projekty ({projekty.length})
                  </h4>
                  {projekty.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Brak powiązanych projektów</p>
                  ) : (
                    <div className="space-y-1">
                      {projekty.map((p) => (
                        <p key={p.id} className="text-sm">{p.nazwa}</p>
                      ))}
                    </div>
                  )}
                </section>
                <Separator />
                <section>
                  <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
                    Podmioty ({podmiotIds.length})
                  </h4>
                  <div className="space-y-1">
                    {podmiotIds.map((pid) => {
                      const p = getPodmiotById(pid);
                      return p ? (
                        <Link key={pid} href={`/podmioty/${p.id}`} className="block text-sm text-primary underline">
                          {p.nazwa}
                        </Link>
                      ) : null;
                    })}
                  </div>
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
