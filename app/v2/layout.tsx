"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { SPOLKA_CONFIG } from "@/features/shared/model/spolki.types";
import { useActiveSystem } from "@/features/shared/context/active-system-context";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  InboxIcon,
  BuildingIcon,
  FolderIcon,
  PackageIcon,
  ArrowRightLeftIcon,
  UserCircleIcon,
  SearchIcon,
  SettingsIcon,
  LogOutIcon,
  Sun,
  Moon,
  BellIcon,
  type LucideIcon,
} from "lucide-react";
import { ActiveSystemProvider } from "@/features/shared/context/active-system-context";
import { AuthGuard } from "@/components/layout/auth-guard";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

/* ─── Nav ─── */
interface NavItem { href: string; label: string; icon: LucideIcon }

const NAV: NavItem[] = [
  { href: "/v2/zgloszenia", label: "Zgłoszenia", icon: InboxIcon },
  { href: "/v2/podmioty", label: "Firmy", icon: BuildingIcon },
  { href: "/v2/projekty", label: "Projekty", icon: FolderIcon },
  { href: "/v2/uslugi", label: "Usługi", icon: PackageIcon },
  { href: "/v2/polecenia", label: "Polecenia", icon: ArrowRightLeftIcon },
  { href: "/v2/zespol", label: "Zespół", icon: UserCircleIcon },
];

/* ─── V2 Sidebar ─── */
function V2Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeSystem } = useActiveSystem();
  const { user, logout } = useAuth();
  const config = SPOLKA_CONFIG[activeSystem];
  const initials = user ? `${user.imie[0]}${user.nazwisko[0]}` : "?";

  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("wisegroup-theme", next ? "dark" : "light");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[232px] flex-col bg-muted/40 dark:bg-card/60 border-r border-border/50">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 h-[60px] border-b border-border/30">
        <div
          className="size-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold"
          style={{ backgroundColor: config.color }}
        >
          {config.shortName}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{config.name}</p>
          <p className="text-[11px] text-muted-foreground truncate leading-tight">{config.description}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-4 pb-2 space-y-1">
        <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Menu
        </p>
        {NAV.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                isActive
                  ? "bg-background text-foreground font-medium shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/60"
              )}
            >
              <item.icon
                className={cn(
                  "size-4 shrink-0",
                  isActive ? "text-foreground" : "text-muted-foreground/80 group-hover:text-foreground/70"
                )}
                strokeWidth={isActive ? 2 : 1.75}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-3 space-y-1">
        <button
          onClick={() => router.push("/v2/ustawienia")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-background/60 transition-all duration-150"
        >
          <SettingsIcon className="size-4 text-muted-foreground/80" strokeWidth={1.75} />
          Ustawienia
        </button>

        <div className="mx-2 my-1.5 h-px bg-border/40" />

        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-foreground/[0.07] text-[11px] font-semibold text-foreground/70">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate leading-tight">
              {user ? `${user.imie} ${user.nazwisko}` : ""}
            </p>
            <p className="text-[11px] text-muted-foreground truncate leading-tight">
              {user?.email ?? ""}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-background/60 transition-colors"
              title={isDark ? "Tryb jasny" : "Tryb ciemny"}
            >
              {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </button>
            <button
              onClick={() => { logout(); router.push("/login"); }}
              className="p-1.5 rounded-md text-muted-foreground/60 hover:text-destructive hover:bg-background/60 transition-colors"
              title="Wyloguj"
            >
              <LogOutIcon className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ─── V2 Header ─── */
const ROUTE_LABELS: Record<string, string> = {
  "/v2/zgloszenia": "Zgłoszenia",
  "/v2/podmioty": "Firmy",
  "/v2/projekty": "Projekty",
  "/v2/uslugi": "Usługi",
  "/v2/polecenia": "Polecenia",
  "/v2/zespol": "Zespół",
};

function V2Header() {
  const pathname = usePathname();
  const { activeSystem } = useActiveSystem();
  const config = SPOLKA_CONFIG[activeSystem];
  const segments = pathname.split("/").filter(Boolean);
  const base = "/" + segments.slice(0, 2).join("/");
  const label = ROUTE_LABELS[base] ?? segments[1] ?? "";
  const isDetail = segments.length > 2;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/30 bg-background/80 backdrop-blur-xl px-8">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        {isDetail ? (
          <>
            <Link href={base} className="text-muted-foreground hover:text-foreground transition-colors">
              {label}
            </Link>
            <span className="text-border">/</span>
            <span className="font-medium text-foreground">Szczegóły</span>
          </>
        ) : (
          <span className="font-medium text-foreground">{label}</span>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-muted/30 px-3.5 py-1.5 text-sm text-muted-foreground hover:bg-muted/50 transition-colors w-60">
          <SearchIcon className="size-4 text-muted-foreground/60" strokeWidth={1.75} />
          <span>Szukaj...</span>
          <kbd className="ml-auto text-[10px] font-mono text-muted-foreground/50 bg-background border border-border/50 rounded px-1.5 py-0.5 leading-none">/</kbd>
        </button>
        <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
          <BellIcon className="size-4" strokeWidth={1.75} />
        </button>
        <div className="flex items-center gap-2 pl-2 border-l border-border/30">
          <div
            className="size-2 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <span className="text-xs font-medium text-muted-foreground">{config.shortName}</span>
        </div>
      </div>
    </header>
  );
}

/* ─── V2 Layout ─── */
export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ActiveSystemProvider>
        <TooltipProvider delayDuration={0}>
          <V2Sidebar />
          <div className="min-h-screen ml-[232px] bg-background">
            <V2Header />
            <main className="px-8 py-8 lg:px-10">
              <div className="mx-auto max-w-[960px] animate-fade-in">
                {children}
              </div>
            </main>
          </div>
        </TooltipProvider>
      </ActiveSystemProvider>
      <Toaster />
    </AuthGuard>
  );
}
