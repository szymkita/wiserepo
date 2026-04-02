"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { SpolkaBadge } from "@/components/layout/spolka-badge";
import { StatusBadge } from "@/features/shared/components/status-badge";
import dynamic from "next/dynamic";

const OsobaKontaktowaForm = dynamic(
  () =>
    import("./osoba-kontaktowa-form").then((m) => m.OsobaKontaktowaForm),
  { ssr: false }
);
import type { Podmiot } from "../model/podmioty.types";
import { getOsobyKontaktowe } from "../model/podmioty.data-source";
import { getZgloszeniaDlaPodmiotu } from "@/features/zgloszenia/model/zgloszenia.data-source";
import { getProjektyDlaPodmiotu } from "@/features/projekty/model/projekty.data-source";
import { getPracownikFullName } from "@/features/zespol/model/zespol.data-source";
import { useActiveSystem } from "@/features/shared/context/active-system-context";
import { STATUS_PODMIOTU_LABELS } from "../model/podmioty.types";
import { STATUS_LABELS } from "@/features/zgloszenia/model/zgloszenia.types";
import { SPOLKA_CONFIG, type SpolkaId } from "@/features/shared/model/spolki.types";
import { toast } from "sonner";
import {
  BuildingIcon,
  PlusIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
  UsersIcon,
  InfoIcon,
} from "lucide-react";

interface PodmiotDetailProps {
  podmiot: Podmiot;
}

const ProjektForm = dynamic(
  () => import("@/features/projekty/components/projekt-form").then((m) => m.ProjektForm),
  { ssr: false }
);

export function PodmiotDetail({ podmiot }: PodmiotDetailProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [projektFormOpen, setProjektFormOpen] = useState(false);
  const { activeSystem } = useActiveSystem();
  const osoby = getOsobyKontaktowe(podmiot.id);
  const zgloszenia = getZgloszeniaDlaPodmiotu(podmiot.id, activeSystem);
  const projekty = getProjektyDlaPodmiotu(podmiot.id, activeSystem);
  const wks = podmiot.wspolneZSpolkami;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <BuildingIcon className="size-8 text-muted-foreground" />
            <div>
              <h1 className="text-2xl font-bold">{podmiot.nazwa}</h1>
              <p className="text-muted-foreground text-sm">
                NIP: <span className="font-mono tabular-nums">{podmiot.nip}</span>
              </p>
            </div>
          </div>
        </div>
        <StatusBadge
          label={STATUS_PODMIOTU_LABELS[podmiot.status]}
          variant={podmiot.status === "klient" ? "success" : podmiot.status === "lead" ? "info" : "muted"}
        />
      </div>

      {/* Dane firmy */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Dane firmy</CardTitle>
          <Button size="sm" variant="outline" onClick={() => toast("Edycja danych firmy (demo)")}>
            Edytuj
          </Button>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {podmiot.adres && (
              <div>
                <dt className="text-muted-foreground">Adres</dt>
                <dd className="font-medium">{podmiot.adres}</dd>
              </div>
            )}
            {podmiot.miasto && (
              <div>
                <dt className="text-muted-foreground">Miasto</dt>
                <dd className="font-medium">{podmiot.miasto}</dd>
              </div>
            )}
            {podmiot.branza && (
              <div>
                <dt className="text-muted-foreground">Branża</dt>
                <dd className="font-medium">{podmiot.branza}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted-foreground">Spółka</dt>
              <dd><SpolkaBadge spolka={podmiot.spolka} /></dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Badge wspólny klient */}
      {wks.length > 0 && (
        <Link href={`/widok-wspolny/${podmiot.nip}`} className="block">
          <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer">
            <CardContent className="py-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UsersIcon className="size-5 text-blue-500 shrink-0" />
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    Wspólny klient
                  </p>
                </div>
                <span className="text-xs text-blue-500 font-medium">Zobacz szczegóły →</span>
              </div>
              {wks.map((wk, i) => (
                <div key={i} className="ml-7 text-sm text-blue-600/80 dark:text-blue-400/80">
                  {SPOLKA_CONFIG[wk.spolka as SpolkaId]?.name ?? wk.spolka} — {wk.status} (od {wk.dataOd})
                </div>
              ))}
            </CardContent>
          </Card>
        </Link>
      )}

      <Separator />

      {/* Osoby kontaktowe */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Osoby kontaktowe</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setFormOpen(true)}>
            <PlusIcon className="mr-1 size-3.5" />
            Dodaj
          </Button>
        </CardHeader>
        <CardContent>
          {osoby.length === 0 ? (
            <p className="text-sm text-muted-foreground">Brak osób kontaktowych</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {osoby.map((o) => (
                <div key={o.id} className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <UserIcon className="size-4 text-muted-foreground" />
                    <span className="font-medium text-sm">
                      {o.imie} {o.nazwisko}
                    </span>
                  </div>
                  {o.stanowisko ? (
                    <p className="ml-6 text-xs text-muted-foreground">{o.stanowisko}</p>
                  ) : null}
                  <div className="mt-1.5 ml-6 space-y-0.5">
                    {o.email ? (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MailIcon className="size-3" />
                        {o.email}
                      </div>
                    ) : null}
                    {o.telefon ? (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <PhoneIcon className="size-3" />
                        {o.telefon}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Zgłoszenia */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Zgłoszenia ({zgloszenia.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {zgloszenia.length === 0 ? (
            <p className="text-sm text-muted-foreground">Brak zgłoszeń</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Spółka</TableHead>
                    <TableHead>Handlowiec</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {zgloszenia.map((z) => (
                    <TableRow key={z.id}>
                      <TableCell className="tabular-nums">{z.data}</TableCell>
                      <TableCell>{z.spolka ? <SpolkaBadge spolka={z.spolka} /> : "—"}</TableCell>
                      <TableCell>{z.handlowiecId ? getPracownikFullName(z.handlowiecId) : "—"}</TableCell>
                      <TableCell>
                        <StatusBadge
                          label={STATUS_LABELS[z.status]}
                          variant={
                            z.status === "jest_klientem"
                              ? "success"
                              : z.status === "odrzucone" || z.status === "przegrane"
                                ? "destructive"
                                : z.status === "w_sprzedazy"
                                  ? "info"
                                  : "default"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projekty */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">Projekty ({projekty.length})</CardTitle>
          {podmiot.status === "klient" && (
            <Button size="sm" variant="outline" onClick={() => setProjektFormOpen(true)}>
              <PlusIcon className="mr-1 size-3.5" />
              Dodaj projekt
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {projekty.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {podmiot.status === "klient"
                ? "Brak projektów — dodaj projekt opisujący współpracę z klientem"
                : "Projekty można dodawać po zmianie statusu na klienta"}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nazwa</TableHead>
                    <TableHead>Charakter</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Od</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projekty.map((pr) => (
                    <TableRow key={pr.id}>
                      <TableCell>
                        <Link href={`/projekty/${pr.id}`} className="font-medium hover:underline">
                          {pr.nazwa}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {pr.charakter === "staly" ? "Stały" : pr.charakter === "jednorazowy" ? "Jednorazowy" : "Planowany"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          label={pr.status === "aktywny" ? "Aktywny" : "Zakończony"}
                          variant={pr.status === "aktywny" ? "success" : "muted"}
                        />
                      </TableCell>
                      <TableCell className="tabular-nums">{pr.dataOd}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {formOpen && (
        <OsobaKontaktowaForm
          podmiotId={podmiot.id}
          open={formOpen}
          onOpenChange={setFormOpen}
        />
      )}

      {projektFormOpen && (
        <ProjektForm
          open={projektFormOpen}
          onOpenChange={setProjektFormOpen}
          defaultPodmiotId={podmiot.id}
        />
      )}
    </div>
  );
}
