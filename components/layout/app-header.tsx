"use client";

import { usePathname } from "next/navigation";
import { SPOLKA_CONFIG } from "@/features/shared/model/spolki.types";
import { useActiveSystem } from "@/features/shared/context/active-system-context";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
  "/zgloszenia": "Zgłoszenia",
  "/podmioty": "Firmy",
  "/projekty": "Projekty",
  "/uslugi": "Usługi",
  "/polecenia": "Polecenia",
  "/zespol": "Zespół",
  "/widok-wspolny": "Wspólni klienci",
  "/ustawienia/udostepnianie": "Udostępnianie danych",
  "/ustawienia/podglad": "Podgląd co widzi WG",
  "/ustawienia/crm-mapowanie": "Mapowanie CRM",
};

function getBreadcrumb(pathname: string): { parent?: string; current: string } {
  if (pathname === "/") return { current: "Zgłoszenia" };

  // Check exact match first (for nested routes like /widok-wspolny/ustawienia)
  if (ROUTE_LABELS[pathname]) return { current: ROUTE_LABELS[pathname] };

  const segments = pathname.split("/").filter(Boolean);
  const base = "/" + segments[0];
  const current = ROUTE_LABELS[base] ?? segments[0];
  if (segments.length > 1) {
    return { parent: current, current: ROUTE_LABELS[pathname] ?? "Szczegóły" };
  }
  return { current };
}

export function AppHeader() {
  const pathname = usePathname();
  const { activeSystem, viewMode } = useActiveSystem();
  const config = SPOLKA_CONFIG[activeSystem];

  const breadcrumb = getBreadcrumb(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-6">
      {/* Left: Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2">
          {breadcrumb.parent && (
            <>
              <span className="text-sm text-muted-foreground">
                {breadcrumb.parent}
              </span>
              <span className="text-muted-foreground/40">/</span>
            </>
          )}
          <h1 className="text-sm font-semibold text-foreground">
            {breadcrumb.current}
          </h1>
        </div>
      </div>

      {/* Right: Search + System indicator */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Szukaj..."
            className="w-64 pl-9 bg-muted/50 border-transparent focus:border-border"
          />
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <span className="text-xs font-medium text-muted-foreground">
            {config.name}
          </span>
          {viewMode === "widok-wspolny" && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-xs font-medium text-blue-500">
                Widok wspólny
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
