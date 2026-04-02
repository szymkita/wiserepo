"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { SPOLKA_CONFIG, SPOLKI_BEZ_WISEGROUP, type SpolkaOperacyjna, hexToRgba } from "@/features/shared/model/spolki.types";
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
  UsersIcon,
  ChevronsUpDownIcon,
  CheckIcon,
  type LucideIcon,
} from "lucide-react";
import { ActiveSystemProvider } from "@/features/shared/context/active-system-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthGuard } from "@/components/layout/auth-guard";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

/* ─── Nav config ─── */
interface NavItem { href: string; label: string; icon: LucideIcon }

const NAV_OPERACYJNE: NavItem[] = [
  { href: "/v5/zgloszenia", label: "Zgłoszenia", icon: InboxIcon },
  { href: "/v5/podmioty", label: "Firmy", icon: BuildingIcon },
  { href: "/v5/projekty", label: "Projekty", icon: FolderIcon },
  { href: "/v5/uslugi", label: "Usługi", icon: PackageIcon },
  { href: "/v5/polecenia", label: "Polecenia", icon: ArrowRightLeftIcon },
  { href: "/v5/zespol", label: "Zespół", icon: UserCircleIcon },
];

const NAV_CRM: NavItem[] = [
  { href: "/v5/zgloszenia", label: "Zgłoszenia", icon: InboxIcon },
  { href: "/v5/podmioty", label: "Firmy", icon: BuildingIcon },
  { href: "/v5/projekty", label: "Projekty", icon: FolderIcon },
  { href: "/v5/polecenia", label: "Polecenia", icon: ArrowRightLeftIcon },
];

const NAV_WIDOK_WSPOLNY: NavItem[] = [
  { href: "/v5/widok-wspolny", label: "Wspólni klienci", icon: UsersIcon },
];

const SPOLKA_ICONS: Record<string, string> = {
  sellwise: "/sellwise.png",
  adwise: "/adwise.png",
  hirewise: "/hirewise.png",
  letsautomate: "/letsautomate.png",
  finerto: "/finerto.png",
};

const SPOLKA_FULL_LOGOS: Record<string, string> = {
  adwise: "/adwise-full.png",
};

/* ─── Sidebar ─── */
function V5Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeSystem, viewMode, setViewMode, setActiveSystem } = useActiveSystem();
  const config = SPOLKA_CONFIG[activeSystem];
  const isCrmSystem = activeSystem === "finerto" || activeSystem === "letsautomate";
  const navItems = viewMode === "widok-wspolny"
    ? NAV_WIDOK_WSPOLNY
    : isCrmSystem ? NAV_CRM : NAV_OPERACYJNE;

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[232px] flex-col border-r border-border/40 bg-background">
      {/* Brand */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 px-4 h-12 border-b border-border/30 w-full transition-colors text-left hover:bg-foreground/[0.02]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {SPOLKA_FULL_LOGOS[activeSystem] ? (
              <img
                src={SPOLKA_FULL_LOGOS[activeSystem]}
                alt={config.name}
                className="h-4 object-contain shrink-0"
              />
            ) : (
              <>
                <img
                  src={SPOLKA_ICONS[activeSystem]}
                  alt={config.name}
                  className="h-6 w-6 object-contain shrink-0"
                />
                <p className="flex-1 min-w-0 text-[13px] font-semibold text-foreground truncate">
                  {config.name}
                </p>
              </>
            )}
            <ChevronsUpDownIcon className="size-3.5 text-muted-foreground/40 shrink-0 ml-auto" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[208px]">
          {SPOLKI_BEZ_WISEGROUP.map((id) => {
            const s = SPOLKA_CONFIG[id];
            const isActive = id === activeSystem;
            return (
              <DropdownMenuItem
                key={id}
                onClick={() => setActiveSystem(id)}
                className="flex items-center gap-2.5 py-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={SPOLKA_ICONS[id] ?? ""}
                  alt={s.name}
                  className="h-5 w-5 object-contain shrink-0"
                />
                <p className={cn("flex-1 text-[13px] leading-tight truncate", isActive ? "font-semibold" : "font-medium")}>
                  {s.name}
                </p>
                {isActive && <CheckIcon className="size-3.5 text-foreground shrink-0" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View switcher — symmetric segmented */}
      <div className="px-3 py-2 border-b border-border/25">
        <div className="flex h-8 rounded-lg bg-foreground/[0.04] p-[3px]">
          <button
            onClick={() => setViewMode("moj-system")}
            className={cn(
              "flex-1 flex items-center justify-center rounded-md text-[11px] font-medium transition-all duration-150",
              viewMode === "moj-system"
                ? "bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                : "text-muted-foreground hover:text-foreground/70"
            )}
          >
            Mój system
          </button>
          <button
            onClick={() => { setViewMode("widok-wspolny"); router.push("/v5/widok-wspolny"); }}
            className={cn(
              "flex-1 flex items-center justify-center rounded-md text-[11px] font-medium transition-all duration-150 relative",
              viewMode === "widok-wspolny"
                ? "bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                : "text-muted-foreground hover:text-foreground/70"
            )}
          >
            Wspólny
            <span className="ml-1.5 flex items-center justify-center size-4 rounded-full bg-blue-500 text-[8px] font-bold text-white leading-none">
              2
            </span>
          </button>
        </div>
      </div>

      {/* Nav — active item uses brand color */}
      <nav className="flex-1 px-3 pt-3 pb-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (viewMode === "widok-wspolny" && !item.href.includes("widok-wspolny")) {
                  setViewMode("moj-system");
                }
              }}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium transition-colors duration-150",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
              )}
              style={isActive ? { backgroundColor: hexToRgba(config.color, 0.08) } : undefined}
            >
              <item.icon
                className={cn(
                  "size-[15px] shrink-0 transition-colors duration-150",
                  isActive ? "" : "text-muted-foreground/70 group-hover:text-muted-foreground"
                )}
                style={isActive ? { color: config.color } : undefined}
                strokeWidth={isActive ? 2 : 1.75}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4">
        <button
          onClick={() => router.push("/v5/ustawienia")}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03] transition-colors duration-150"
        >
          <SettingsIcon className="size-[15px] shrink-0 text-muted-foreground/70" strokeWidth={1.75} />
          Ustawienia
        </button>
      </div>
    </aside>
  );
}

/* ─── Header ─── */
function V5Header() {
  const { activeSystem } = useActiveSystem();
  const { user, logout } = useAuth();
  const router = useRouter();
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
    <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-border/30 bg-background/90 backdrop-blur-md px-10 lg:px-12">
      {/* Left: search */}
      <button className="flex items-center gap-2 rounded-lg border border-border/40 bg-foreground/[0.02] px-3 py-1.5 text-[12px] text-muted-foreground/60 hover:text-muted-foreground hover:border-border/60 transition-colors w-64">
        <SearchIcon className="size-3.5" strokeWidth={1.75} />
        <span>Szukaj...</span>
        <kbd className="ml-auto text-[10px] font-mono text-muted-foreground/40 border border-border/40 rounded px-1 py-0.5">/</kbd>
      </button>

      {/* Right: theme + user */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-foreground/[0.03] transition-colors"
          title={isDark ? "Tryb jasny" : "Tryb ciemny"}
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-foreground/[0.03] transition-colors">
              <div
                className="flex size-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: hexToRgba(config.color, 0.7) }}
              >
                {initials}
              </div>
              <span className="text-[13px] font-medium text-foreground hidden sm:block">
                {user ? `${user.imie} ${user.nazwisko}` : ""}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user ? `${user.imie} ${user.nazwisko}` : ""}</p>
              <p className="text-xs text-muted-foreground">{user?.email ?? ""}</p>
            </div>
            <DropdownMenuItem
              onClick={() => { logout(); router.push("/login"); }}
              className="text-destructive focus:text-destructive"
            >
              <LogOutIcon className="mr-2 size-4" />
              Wyloguj
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

/* ─── Layout ─── */
export default function V5Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <ActiveSystemProvider>
        <TooltipProvider delayDuration={0}>
          <V5Sidebar />
          <div className="min-h-screen ml-[232px]">
            <V5Header />
            <main className="px-10 py-8 lg:px-12">
              <div className="animate-fade-in">
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
