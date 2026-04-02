"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SearchIcon,
  InboxIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUpDownIcon,
  CalendarIcon,
  XIcon,
  FilterIcon,
  UsersIcon,
} from "lucide-react";
import { StatusBadge } from "@/features/shared/components/status-badge";
import type { Zgloszenie } from "../model/zgloszenia.types";
import {
  ZRODLO_LABELS,
  STATUS_LABELS,
} from "../model/zgloszenia.types";
import { getPodmiotById } from "@/features/podmioty/model/podmioty.data-source";
import { getPracownikFullName, getHandlowcy } from "@/features/zespol/model/zespol.data-source";
import { useActiveSystem } from "@/features/shared/context/active-system-context";
import { ZgloszenieSheet } from "./zgloszenie-sheet";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

const STATUS_VARIANT_MAP: Record<string, "default" | "success" | "destructive" | "info" | "muted"> = {
  nowe: "default",
  spam: "muted",
  odrzucone: "destructive",
  w_sprzedazy: "info",
  jest_klientem: "success",
  przegrane: "destructive",
};

const ZRODLO_VARIANT_MAP: Record<string, "info" | "muted" | "warning"> = {
  formularz: "info",
  formularz_wisegroup: "info",
  telefon: "muted",
  email: "muted",
  polecenie: "warning",
  hubspot: "warning",
  pipedrive: "warning",
};

type SortKey = "numer" | "data" | "firma" | "zrodlo" | "handlowiec" | "status";
type SortDir = "asc" | "desc";

function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split(".");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function formatDateRange(range: DateRange | undefined): string {
  if (!range?.from) return "";
  const fmt = (d: Date) =>
    d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit", year: "numeric" });
  if (!range.to) return fmt(range.from);
  return `${fmt(range.from)} — ${fmt(range.to)}`;
}


interface ZgloszeniaTableProps {
  zgloszenia: Zgloszenie[];
}

// Statusy per typ systemu
const STATUS_OPERACYJNE = ["nowe", "spam", "odrzucone", "w_sprzedazy", "jest_klientem", "przegrane"] as const;
const STATUS_CRM = ["w_sprzedazy", "jest_klientem", "przegrane"] as const;

// Źródła per typ systemu
const ZRODLO_OPERACYJNE = ["formularz", "formularz_wisegroup", "telefon", "email", "polecenie"] as const;
const ZRODLO_FINERTO = ["hubspot", "polecenie"] as const;
const ZRODLO_LETSAUTOMATE = ["pipedrive", "polecenie"] as const;

export function ZgloszeniaTable({ zgloszenia }: ZgloszeniaTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [zrodloFilter, setZrodloFilter] = useState<string>("all");
  const [handlowiecFilter, setHandlowiecFilter] = useState<string>("all");
  const { activeSystem } = useActiveSystem();
  const isCrmSystem = activeSystem === "finerto" || activeSystem === "letsautomate";
  const availableStatuses = isCrmSystem ? STATUS_CRM : STATUS_OPERACYJNE;
  const availableZrodla = activeSystem === "finerto" ? ZRODLO_FINERTO : activeSystem === "letsautomate" ? ZRODLO_LETSAUTOMATE : ZRODLO_OPERACYJNE;
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [sortKey, setSortKey] = useState<SortKey>("data");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const allHandlowcy = useMemo(() => getHandlowcy(), []);

  const uniqueHandlowcy = useMemo(() => {
    const ids = [...new Set(zgloszenia.map((z) => z.handlowiecId).filter(Boolean))] as string[];
    return ids.map((id) => ({ id, name: getPracownikFullName(id) })).filter((h) => h.name !== "—");
  }, [zgloszenia]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    return zgloszenia.filter((z) => {
      if (statusFilter !== "all" && z.status !== statusFilter) return false;
      if (zrodloFilter !== "all" && z.zrodlo !== zrodloFilter) return false;
      if (handlowiecFilter !== "all" && z.handlowiecId !== handlowiecFilter) return false;
      if (dateRange?.from) {
        const d = parseDate(z.data);
        if (d < dateRange.from) return false;
        if (dateRange.to && d > dateRange.to) return false;
      }
      if (searchQuery) {
        const podmiot = z.podmiotId ? getPodmiotById(z.podmiotId) : undefined;
        const q = searchQuery.toLowerCase();
        if (
          !podmiot?.nazwa.toLowerCase().includes(q) &&
          !z.numer.toLowerCase().includes(q) &&
          !(podmiot?.nip ?? "").includes(q)
        ) return false;
      }
      return true;
    });
  }, [zgloszenia, statusFilter, zrodloFilter, handlowiecFilter, dateRange, searchQuery]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      switch (sortKey) {
        case "numer":
          return dir * a.numer.localeCompare(b.numer);
        case "data":
          return dir * (parseDate(a.data).getTime() - parseDate(b.data).getTime());
        case "firma": {
          const pa = (a.podmiotId ? getPodmiotById(a.podmiotId)?.nazwa : null) ?? "";
          const pb = (b.podmiotId ? getPodmiotById(b.podmiotId)?.nazwa : null) ?? "";
          return dir * pa.localeCompare(pb, "pl");
        }
        case "zrodlo":
          return dir * ZRODLO_LABELS[a.zrodlo].localeCompare(ZRODLO_LABELS[b.zrodlo], "pl");
        case "handlowiec":
          return dir * (a.handlowiecId ? getPracownikFullName(a.handlowiecId) : "").localeCompare(b.handlowiecId ? getPracownikFullName(b.handlowiecId) : "", "pl");
        case "status":
          return dir * STATUS_LABELS[a.status].localeCompare(STATUS_LABELS[b.status], "pl");
        default:
          return 0;
      }
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const selectedZgloszenie = sorted.find((z) => z.id === selectedId);

  const activeFiltersCount = [
    statusFilter !== "all",
    zrodloFilter !== "all",
    handlowiecFilter !== "all",
    !!dateRange?.from,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setStatusFilter("all");
    setZrodloFilter("all");
    setHandlowiecFilter("all");
    setDateRange(undefined);
    setSearchQuery("");
  };

  if (zgloszenia.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <InboxIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-1">Brak zgłoszeń</h3>
          <p className="text-muted-foreground text-center">Nie ma jeszcze żadnych zgłoszeń.</p>
        </CardContent>
      </Card>
    );
  }

  function SortableHead({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) {
    const isActive = sortKey === sortKeyName;
    return (
      <TableHead>
        <button
          type="button"
          onClick={() => handleSort(sortKeyName)}
          className={cn(
            "inline-flex items-center gap-1 hover:text-foreground transition-colors",
            isActive && "text-foreground",
          )}
        >
          {label}
          {isActive ? (
            sortDir === "asc" ? (
              <ArrowUpIcon className="size-3" />
            ) : (
              <ArrowDownIcon className="size-3" />
            )
          ) : (
            <ArrowUpDownIcon className="size-3 opacity-30" />
          )}
        </button>
      </TableHead>
    );
  }

  return (
    <>
      {/* Filters */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Szukaj po nazwie, NIP lub numerze..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Date range */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-9 gap-2 text-sm font-normal",
                    dateRange?.from ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="size-3.5" />
                  {dateRange?.from ? formatDateRange(dateRange) : "Zakres dat"}
                  {dateRange?.from && (
                    <span
                      role="button"
                      className="ml-1 rounded-full p-0.5 hover:bg-muted"
                      onClick={(e) => { e.stopPropagation(); setDateRange(undefined); }}
                    >
                      <XIcon className="size-3" />
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] h-9" aria-label="Status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie statusy</SelectItem>
                {availableStatuses.map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={zrodloFilter} onValueChange={setZrodloFilter}>
              <SelectTrigger className="w-[160px] h-9" aria-label="Źródło">
                <SelectValue placeholder="Źródło" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie źródła</SelectItem>
                {availableZrodla.map((z) => (
                  <SelectItem key={z} value={z}>{ZRODLO_LABELS[z]}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={handlowiecFilter} onValueChange={setHandlowiecFilter}>
              <SelectTrigger className="w-[170px] h-9" aria-label="Handlowiec">
                <SelectValue placeholder="Handlowiec" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszyscy handlowcy</SelectItem>
                {uniqueHandlowcy.map((h) => (
                  <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={clearAllFilters}
              >
                <XIcon className="size-3.5" />
                Wyczyść ({activeFiltersCount})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHead label="Numer" sortKeyName="numer" />
              <SortableHead label="Data" sortKeyName="data" />
              <SortableHead label="Firma" sortKeyName="firma" />
              <SortableHead label="Źródło" sortKeyName="zrodlo" />
              <SortableHead label="Handlowiec" sortKeyName="handlowiec" />
              <SortableHead label="Status" sortKeyName="status" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <FilterIcon className="size-8 text-muted-foreground/40" />
                    <p className="text-sm">Brak wyników dla wybranych filtrów</p>
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs">
                      Wyczyść filtry
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((z) => {
                const podmiot = z.podmiotId ? getPodmiotById(z.podmiotId) : null;
                return (
                  <TableRow
                    key={z.id}
                    className="cursor-pointer group hover:bg-primary/[0.04] transition-colors"
                    onClick={() => setSelectedId(z.id)}
                  >
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {z.numer}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums whitespace-nowrap">
                      {z.data}
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="text-sm font-medium">{podmiot?.nazwa ?? "—"}</span>
                        <br />
                        <span className="text-xs text-muted-foreground">
                          NIP: {z.nip ?? podmiot?.nip ?? "—"}
                        </span>
                        {z.status === "nowe" && !z.nip && !podmiot?.nip && (
                          <span className="ml-1.5 inline-flex items-center rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                            Uzupełnij NIP
                          </span>
                        )}
                        {podmiot && podmiot.wspolneZSpolkami.length > 0 && (
                          <span className="ml-1.5 inline-flex items-center gap-1 rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            <UsersIcon className="size-2.5" />
                            Wspólny ({podmiot.wspolneZSpolkami.length})
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        label={ZRODLO_LABELS[z.zrodlo]}
                        variant={ZRODLO_VARIANT_MAP[z.zrodlo] ?? "muted"}
                      />
                    </TableCell>
                    <TableCell className="text-sm whitespace-nowrap">
                      {z.handlowiecId ? getPracownikFullName(z.handlowiecId) : "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        label={STATUS_LABELS[z.status]}
                        variant={STATUS_VARIANT_MAP[z.status] ?? "default"}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Footer with count */}
        <div className="border-t border-border/40 px-4 py-2.5">
          <p className="text-xs text-muted-foreground">
            {sorted.length} z {zgloszenia.length} zgłoszeń
          </p>
        </div>
      </Card>

      <ZgloszenieSheet
        zgloszenie={selectedZgloszenie ?? null}
        open={!!selectedZgloszenie}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      />
    </>
  );
}
