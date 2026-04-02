import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/features/shared/components/page-header";
import { StatusBadge } from "@/features/shared/components/status-badge";
import { LockIcon } from "lucide-react";

const HUBSPOT_MAPPING = [
  { stage: "Nowy", wisegroupStatus: "nowe", variant: "default" },
  { stage: "Kwalifikacja", wisegroupStatus: "w_sprzedazy", variant: "info" },
  { stage: "Oferta wysłana", wisegroupStatus: "w_sprzedazy", variant: "info" },
  { stage: "Klient", wisegroupStatus: "jest_klientem", variant: "success" },
  { stage: "Zamknięty wygrany", wisegroupStatus: "jest_klientem", variant: "success" },
  { stage: "Zamknięty przegrany", wisegroupStatus: "przegrane", variant: "destructive" },
] as const;

const PIPEDRIVE_MAPPING = [
  { stage: "Nowy", wisegroupStatus: "nowe", variant: "default" },
  { stage: "Kwalifikacja", wisegroupStatus: "w_sprzedazy", variant: "info" },
  { stage: "Demo umówione", wisegroupStatus: "w_sprzedazy", variant: "info" },
  { stage: "Propozycja", wisegroupStatus: "w_sprzedazy", variant: "info" },
  { stage: "Klient", wisegroupStatus: "jest_klientem", variant: "success" },
  { stage: "Wygrany", wisegroupStatus: "jest_klientem", variant: "success" },
  { stage: "Przegrany", wisegroupStatus: "przegrane", variant: "destructive" },
] as const;

const LIVESPACE_MAPPING = [
  { stage: "Nowy lead", wisegroupStatus: "nowe", variant: "default" },
  { stage: "Kontakt", wisegroupStatus: "w_sprzedazy", variant: "info" },
  { stage: "Analiza potrzeb", wisegroupStatus: "w_sprzedazy", variant: "info" },
  { stage: "Oferta", wisegroupStatus: "w_sprzedazy", variant: "info" },
  { stage: "Klient", wisegroupStatus: "jest_klientem", variant: "success" },
  { stage: "Zamknięty", wisegroupStatus: "jest_klientem", variant: "success" },
  { stage: "Stracony", wisegroupStatus: "przegrane", variant: "destructive" },
] as const;

const STATUS_LABELS: Record<string, string> = {
  nowe: "Nowe",
  w_sprzedazy: "W sprzedaży",
  jest_klientem: "Jest klientem",
  przegrane: "Przegrane",
};

type StatusVariant = "default" | "info" | "success" | "destructive" | "muted";

export default function CrmMapowaniePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Ustawienia — Mapowanie statusów CRM"
        description="Konfiguracja mapowania etapów pipeline w zewnętrznych CRM na statusy zgłoszeń w systemie WiseGroup."
      />

      <div className="rounded-lg border border-amber-200/70 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20 p-4">
        <div className="flex items-start gap-3">
          <LockIcon className="size-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Mapowanie konfigurowane przez developera.{" "}
            <strong>Widok tylko do odczytu.</strong> Zmiany wymagają modyfikacji
            konfiguracji systemowej.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* HubSpot */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#FF7A59] text-white text-[10px] font-bold shrink-0">
                HS
              </span>
              HubSpot — Finerto
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">
                    Etap pipeline (HubSpot)
                  </TableHead>
                  <TableHead className="text-xs">Status WiseGroup</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {HUBSPOT_MAPPING.map((row) => (
                  <TableRow key={row.stage}>
                    <TableCell className="text-sm font-mono">
                      {row.stage}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        label={STATUS_LABELS[row.wisegroupStatus]}
                        variant={row.variant as StatusVariant}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pipedrive */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#1A73E8] text-white text-[10px] font-bold shrink-0">
                PD
              </span>
              Pipedrive — Let&apos;s Automate
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">
                    Etap pipeline (Pipedrive)
                  </TableHead>
                  <TableHead className="text-xs">Status WiseGroup</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PIPEDRIVE_MAPPING.map((row) => (
                  <TableRow key={row.stage}>
                    <TableCell className="text-sm font-mono">
                      {row.stage}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        label={STATUS_LABELS[row.wisegroupStatus]}
                        variant={row.variant as StatusVariant}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Livespace */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[#00B0FF] text-white text-[10px] font-bold shrink-0">
                LS
              </span>
              Livespace — SellWise / AdWise / HireWise
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">
                    Etap pipeline (Livespace)
                  </TableHead>
                  <TableHead className="text-xs">Status WiseGroup</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LIVESPACE_MAPPING.map((row) => (
                  <TableRow key={row.stage}>
                    <TableCell className="text-sm font-mono">
                      {row.stage}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        label={STATUS_LABELS[row.wisegroupStatus]}
                        variant={row.variant as StatusVariant}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
