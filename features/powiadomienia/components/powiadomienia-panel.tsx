"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, UsersIcon, ArrowRightLeftIcon, RefreshCwIcon, CheckCheckIcon } from "lucide-react";
import { useActiveSystem } from "@/features/shared/context/active-system-context";
import { getPowiadomienia, getNieprzeczytaneCount } from "../model/powiadomienia.data-source";
import type { TypPowiadomienia } from "../model/powiadomienia.types";
import { TYP_LABELS } from "../model/powiadomienia.types";

const TYP_ICONS: Record<TypPowiadomienia, typeof UsersIcon> = {
  match: UsersIcon,
  polecenie: ArrowRightLeftIcon,
  zmiana_statusu: RefreshCwIcon,
};

const TYP_COLORS: Record<TypPowiadomienia, string> = {
  match: "text-blue-500",
  polecenie: "text-purple-500",
  zmiana_statusu: "text-amber-500",
};

interface PowiadomieniaPanelProps {
  collapsed?: boolean;
}

export function PowiadomieniaPanel({ collapsed }: PowiadomieniaPanelProps) {
  const { activeSystem } = useActiveSystem();
  const allPowiadomienia = getPowiadomienia(activeSystem);
  const [markedRead, setMarkedRead] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);

  const powiadomienia = useMemo(
    () =>
      allPowiadomienia.map((p) => ({
        ...p,
        przeczytane: p.przeczytane || markedRead.has(p.id),
      })),
    [allPowiadomienia, markedRead]
  );

  const nieprzeczytane = powiadomienia.filter((p) => !p.przeczytane).length;

  const markAllRead = () => {
    setMarkedRead(new Set(allPowiadomienia.map((p) => p.id)));
  };

  const markRead = (id: string) => {
    setMarkedRead((prev) => new Set([...prev, id]));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors",
            collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2"
          )}
        >
          <div className="relative shrink-0">
            <Bell className="h-[18px] w-[18px]" />
            {nieprzeczytane > 0 && (
              <span className="absolute -top-1 -right-1.5 h-3.5 w-3.5 rounded-full bg-destructive text-[9px] font-bold text-white flex items-center justify-center">
                {nieprzeczytane}
              </span>
            )}
          </div>
          {!collapsed && <span>Powiadomienia</span>}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="end"
        className="w-96 p-0"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Powiadomienia</h3>
          {nieprzeczytane > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={markAllRead}
            >
              <CheckCheckIcon className="mr-1 size-3" />
              Oznacz wszystkie
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {powiadomienia.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Brak powiadomień
            </div>
          ) : (
            powiadomienia.map((p) => {
              const Icon = TYP_ICONS[p.typ];
              const color = TYP_COLORS[p.typ];
              return (
                <Link
                  key={p.id}
                  href={p.href}
                  onClick={() => { markRead(p.id); setOpen(false); }}
                  className={cn(
                    "flex gap-3 px-4 py-3 border-b last:border-b-0 transition-colors hover:bg-accent",
                    !p.przeczytane && "bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                >
                  <div className={cn("mt-0.5 shrink-0", color)}>
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {TYP_LABELS[p.typ]}
                      </span>
                      {!p.przeczytane && (
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-sm mt-0.5 leading-snug">{p.tresc}</p>
                    <p className="text-xs text-muted-foreground mt-1 tabular-nums">{p.data}</p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
