"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SpolkaBadge } from "@/components/layout/spolka-badge";
import { StatusBadge } from "@/features/shared/components/status-badge";
import { getProjektById } from "@/features/projekty/model/projekty.data-source";
import { getPodmiotById } from "@/features/podmioty/model/podmioty.data-source";
import { getPracownikFullName } from "@/features/zespol/model/zespol.data-source";
import { STATUS_PROJEKTU_LABELS, CHARAKTER_LABELS } from "@/features/projekty/model/projekty.types";
import { FolderIcon, BuildingIcon } from "lucide-react";

export default function ProjektDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projekt = getProjektById(id);

  if (!projekt) {
    notFound();
  }

  const podmiot = getPodmiotById(projekt.podmiotId);
  const opiekun = getPracownikFullName(projekt.opiekunId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <FolderIcon className="size-8 text-muted-foreground mt-1" />
        <div>
          <h1 className="text-2xl font-bold">{projekt.nazwa}</h1>
          <div className="flex items-center gap-3 mt-1">
            <SpolkaBadge spolka={projekt.spolka} />
            <StatusBadge
              label={STATUS_PROJEKTU_LABELS[projekt.status]}
              variant={projekt.status === "aktywny" ? "success" : "muted"}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Dane projektu */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Dane projektu</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Firma</dt>
              <dd>
                {podmiot ? (
                  <Link href={`/podmioty/${podmiot.id}`} className="font-medium text-primary hover:underline">
                    {podmiot.nazwa}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Charakter</dt>
              <dd className="font-medium">{CHARAKTER_LABELS[projekt.charakter]}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Opiekun</dt>
              <dd className="font-medium">{opiekun}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Zespół</dt>
              <dd className="font-medium">
                {projekt.wykonawcaIds.map((id) => getPracownikFullName(id)).join(", ") || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Data rozpoczęcia</dt>
              <dd className="font-medium tabular-nums">{projekt.dataOd}</dd>
            </div>
            {projekt.dataDo && (
              <div>
                <dt className="text-muted-foreground">Data zakończenia</dt>
                <dd className="font-medium tabular-nums">{projekt.dataDo}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Zakres */}
      {projekt.zakres && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Zakres</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{projekt.zakres}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
