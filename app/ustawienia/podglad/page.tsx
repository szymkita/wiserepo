"use client";

import { PageHeader } from "@/features/shared/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SpolkaBadge } from "@/components/layout/spolka-badge";
import { useActiveSystem } from "@/features/shared/context/active-system-context";
import { SPOLKA_CONFIG, type SpolkaId } from "@/features/shared/model/spolki.types";
import { getWspolniKlienciForSpolka } from "@/features/widok-wspolny/model/wspolni-klienci.data-source";

export default function PodgladWiseGroupPage() {
  const { activeSystem } = useActiveSystem();
  const config = SPOLKA_CONFIG[activeSystem];
  const wspolni = getWspolniKlienciForSpolka(activeSystem);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Podgląd co widzi WiseGroup"
        description={`Co WiseGroup aktualnie wie o firmach ${config.name}`}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Firmy z matchem ({wspolni.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {wspolni.length === 0 ? (
            <p className="text-sm text-muted-foreground">Brak firm ze wspólnymi klientami.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Firma</TableHead>
                  <TableHead>NIP</TableHead>
                  <TableHead>Mój status</TableHead>
                  <TableHead>Projekty</TableHead>
                  <TableHead>Match z</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wspolni.map((wk) => (
                    <TableRow key={wk.nip}>
                      <TableCell className="font-medium">{wk.nazwaFirmy}</TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">{wk.nip}</TableCell>
                      <TableCell className="text-sm">{wk.mojaSpolka.status}</TableCell>
                      <TableCell className="text-sm tabular-nums">{wk.mojaSpolka.aktywneProjektyCount}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {wk.inneSpolki.map((s, i) => (
                            <SpolkaBadge key={i} spolka={s.spolka as SpolkaId} />
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
