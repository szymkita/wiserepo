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

/* ─── Sidebar ─── */
function V5Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeSystem, viewMode, setViewMode, setActiveSystem } = useActiveSystem();
  const { user, logout } = useAuth();
  const config = SPOLKA_CONFIG[activeSystem];
  const initials = user ? `${user.imie[0]}${user.nazwisko[0]}` : "?";
  const isCrmSystem = activeSystem === "finerto" || activeSystem === "letsautomate";
  const navItems = viewMode === "widok-wspolny"
    ? NAV_WIDOK_WSPOLNY
    : isCrmSystem ? NAV_CRM : NAV_OPERACYJNE;

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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[232px] flex-col border-r border-border/40 bg-background">
      {/* Brand with company switcher — tinted with brand color */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-2.5 px-4 h-[60px] border-b border-border/30 w-full transition-colors text-left"
            style={{ backgroundColor: hexToRgba(config.color, 0.04) }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SPOLKA_ICONS[activeSystem]}
              alt={config.name}
              className="h-8 w-8 object-contain shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-foreground leading-tight truncate">
                {config.name}
              </p>
              <p className="text-[10px] text-muted-foreground/50 leading-tight truncate">
                {config.description}
              </p>
            </div>
            <ChevronsUpDownIcon className="size-3.5 text-muted-foreground/40 shrink-0" />
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
                <div className="flex-1 min-w-0">
                  <p className={cn("text-[13px] leading-tight truncate", isActive ? "font-semibold" : "font-medium")}>
                    {s.name}
                  </p>
                </div>
                {isActive && <CheckIcon className="size-3.5 text-foreground shrink-0" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* System switcher */}
      <div className="px-3 py-2.5 border-b border-border/25">
        <div className="flex rounded-lg bg-foreground/[0.04] p-0.5">
          <button
            onClick={() => setViewMode("moj-system")}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-[11px] font-medium transition-all duration-150",
              viewMode === "moj-system"
                ? "bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                : "text-muted-foreground/70 hover:text-muted-foreground"
            )}
          >
            Mój system
          </button>
          <button
            onClick={() => { setViewMode("widok-wspolny"); router.push("/v5/widok-wspolny"); }}
            className={cn(
              "relative flex-1 rounded-md px-3 py-1.5 text-[11px] font-medium transition-all duration-150",
              viewMode === "widok-wspolny"
                ? "bg-background text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                : "text-muted-foreground/70 hover:text-muted-foreground"
            )}
          >
            Widok wspólny
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-blue-500 text-[8px] font-bold text-white flex items-center justify-center">
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
                "group relative flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium transition-colors duration-150",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
              )}
              style={isActive ? { backgroundColor: hexToRgba(config.color, 0.08) } : undefined}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2.5px] rounded-r-full"
                  style={{ backgroundColor: config.color }}
                />
              )}
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
      <div className="px-3 pb-4 space-y-1">
        <button
          onClick={() => router.push("/v5/ustawienia")}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03] transition-colors duration-150"
        >
          <SettingsIcon className="size-[15px] shrink-0 text-muted-foreground/70" strokeWidth={1.75} />
          Ustawienia
        </button>

        <div className="mx-3 my-2 h-px bg-border/30" />

        <div className="flex items-center gap-2.5 px-3 py-1">
          <div
            className="flex size-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: hexToRgba(config.color, 0.7) }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-foreground truncate leading-tight">
              {user ? `${user.imie} ${user.nazwisko}` : ""}
            </p>
            <p className="text-[11px] text-muted-foreground/50 truncate leading-tight">
              {user?.email ?? ""}
            </p>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={toggleTheme}
              className="p-1 rounded-md text-muted-foreground/50 hover:text-foreground transition-colors"
              title={isDark ? "Tryb jasny" : "Tryb ciemny"}
            >
              {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </button>
            <button
              onClick={() => { logout(); router.push("/login"); }}
              className="p-1 rounded-md text-muted-foreground/50 hover:text-destructive transition-colors"
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

/* ─── Header ─── */
function V5Header() {
  const { activeSystem } = useActiveSystem();
  const config = SPOLKA_CONFIG[activeSystem];

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center justify-between bg-background/90 backdrop-blur-md px-10 lg:px-12">
      <button className="flex items-center gap-2 rounded-lg border border-border/40 bg-foreground/[0.02] px-3 py-1.5 text-[12px] text-muted-foreground/60 hover:text-muted-foreground hover:border-border/60 transition-colors w-64">
        <SearchIcon className="size-3.5" strokeWidth={1.75} />
        <span>Szukaj...</span>
        <kbd className="ml-auto text-[10px] font-mono text-muted-foreground/40 border border-border/40 rounded px-1 py-0.5">/</kbd>
      </button>
      <div className="flex items-center gap-2">
        <div className="size-2 rounded-full" style={{ backgroundColor: config.color }} />
        <span className="text-[11px] font-medium text-muted-foreground/60">{config.name}</span>
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
