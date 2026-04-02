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
import { SpolkaBadge } from "@/components/layout/spolka-badge";
import { StatusBadge } from "@/features/shared/components/status-badge";
import { EmptyState } from "@/features/shared/components/empty-state";
import type { AktywnaUsluga } from "../model/uslugi.types";
import { getUslugaById } from "../model/uslugi.data-source";
import { getPodmiotById } from "@/features/podmioty/model/podmioty.data-source";
import { getProjektById } from "@/features/projekty/model/projekty.data-source";

interface UslugiAktywneTableProps {
  aktywneUslugi: AktywnaUsluga[];
}

export function UslugiAktywneTable({ aktywneUslugi }: UslugiAktywneTableProps) {
  if (aktywneUslugi.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState title="Brak aktywnych usług" description="Żadna usługa nie jest aktywnie realizowana." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Usługa</TableHead>
            <TableHead>Podmiot</TableHead>
            <TableHead>Projekt</TableHead>
            <TableHead>Spółka</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {aktywneUslugi.map((au, i) => {
            const usluga = getUslugaById(au.uslugaId);
            const podmiot = getPodmiotById(au.podmiotId);
            const projekt = getProjektById(au.projektId);
            return (
              <TableRow key={`${au.uslugaId}-${au.projektId}-${i}`}>
                <TableCell className="font-medium">
                  {usluga?.nazwa ?? "—"}
                </TableCell>
                <TableCell>
                  {podmiot ? (
                    <Link href={`/podmioty/${podmiot.id}`} className="text-primary underline">
                      {podmiot.nazwa}
                    </Link>
                  ) : "—"}
                </TableCell>
                <TableCell>{projekt?.nazwa ?? "—"}</TableCell>
                <TableCell>
                  {usluga ? <SpolkaBadge spolka={usluga.spolka} /> : "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
