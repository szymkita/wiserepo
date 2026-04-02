"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SPOLKA_CONFIG } from "@/features/shared/model/spolki.types";
import { useActiveSystem } from "@/features/shared/context/active-system-context";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { PowiadomieniaPanel } from "@/features/powiadomienia/components/powiadomienia-panel";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  InboxIcon,
  BuildingIcon,
  FolderIcon,
  PackageIcon,
  ArrowRightLeftIcon,
  UserCircleIcon,
  Sun,
  Moon,
  LogOutIcon,
  SettingsIcon,
  EllipsisVerticalIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  PaletteIcon,
  NetworkIcon,
  EyeIcon,
  ShieldCheckIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// Nawigacja dla systemów operacyjnych (SellWise, AdWise, HireWise)
const NAV_OPERACYJNE: NavItem[] = [
  { href: "/zgloszenia", label: "Zgłoszenia", icon: InboxIcon },
  { href: "/podmioty", label: "Firmy", icon: BuildingIcon },
  { href: "/projekty", label: "Projekty", icon: FolderIcon },
  { href: "/uslugi", label: "Usługi", icon: PackageIcon },
  { href: "/polecenia", label: "Polecenia", icon: ArrowRightLeftIcon },
  { href: "/zespol", label: "Zespół", icon: UserCircleIcon },
];

// Nawigacja dla systemów CRM (Finerto, Let's Automate)
const NAV_CRM: NavItem[] = [
  { href: "/zgloszenia", label: "Zgłoszenia", icon: InboxIcon },
  { href: "/podmioty", label: "Firmy", icon: BuildingIcon },
  { href: "/projekty", label: "Projekty", icon: FolderIcon },
  { href: "/polecenia", label: "Polecenia", icon: ArrowRightLeftIcon },
];

// Nawigacja dla widoku wspólnego (WiseGroup)
const NAV_WIDOK_WSPOLNY: NavItem[] = [
  { href: "/widok-wspolny", label: "Wspólni klienci", icon: UsersIcon },
];

const SPOLKA_ICONS: Record<string, string> = {
  sellwise: "/sellwise.png",
  adwise: "/adwise.png",
  hirewise: "/hirewise.png",
  letsautomate: "/letsautomate.png",
  finerto: "/finerto.png",
};

export function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, toggle: toggleCollapsed } = useSidebarCollapsed();
  const { activeSystem, viewMode, setViewMode } = useActiveSystem();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const savedTheme = localStorage.getItem("wisegroup-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return savedTheme === "dark" || (!savedTheme && prefersDark);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("wisegroup-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("wisegroup-theme", "light");
    }
  };

  const initials = user ? `${user.imie[0]}${user.nazwisko[0]}` : "?";
  const activeConfig = SPOLKA_CONFIG[activeSystem];
  const isCrmSystem = activeSystem === "finerto" || activeSystem === "letsautomate";
  const navItems = viewMode === "widok-wspolny"
    ? NAV_WIDOK_WSPOLNY
    : isCrmSystem
      ? NAV_CRM
      : NAV_OPERACYJNE;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen">
      <div
        className={cn(
          "bg-sidebar border-r border-sidebar-border flex flex-col h-full transition-all duration-200",
          collapsed ? "w-14" : "w-56"
        )}
      >
        {/* Logo spółki + collapse toggle */}
        <div className="flex h-14 items-center border-b border-sidebar-border px-3 justify-between">
          {collapsed ? (
            <button
              onClick={toggleCollapsed}
              className="mx-auto p-1 rounded-md hover:bg-sidebar-accent transition-colors"
              aria-label="Rozwiń menu"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SPOLKA_ICONS[activeSystem]}
                alt={activeConfig.name}
                className="h-7 w-7 object-contain"
              />
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={SPOLKA_ICONS[activeSystem]}
                  alt={activeConfig.name}
                  className="h-7 w-7 object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-sidebar-foreground leading-tight">
                    {activeConfig.name}
                  </span>
                  <span className="text-[10px] text-sidebar-foreground/40 leading-tight">
                    {activeConfig.description}
                  </span>
                </div>
              </div>
              <button
                onClick={toggleCollapsed}
                className="p-1.5 rounded-md text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                aria-label="Zwiń menu"
              >
                <ChevronsLeftIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Przełącznik Mój system / Widok wspólny */}
        <div className="px-2 py-2 border-b border-sidebar-border">
          {collapsed ? (
            <div className="flex flex-col gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setViewMode("moj-system")}
                    className={cn(
                      "flex items-center justify-center rounded-lg py-2 transition-colors",
                      viewMode === "moj-system"
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/50 hover:bg-sidebar-accent/50"
                    )}
                  >
                    <BuildingIcon className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Mój system</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => { setViewMode("widok-wspolny"); router.push("/widok-wspolny"); }}
                    className={cn(
                      "relative flex items-center justify-center rounded-lg py-2 transition-colors",
                      viewMode === "widok-wspolny"
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/50 hover:bg-sidebar-accent/50"
                    )}
                  >
                    <UsersIcon className="h-4 w-4" />
                    <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-blue-500 text-[8px] font-bold text-white flex items-center justify-center">
                      2
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Widok wspólny</TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div className="flex rounded-lg bg-sidebar-accent/50 p-0.5">
              <button
                onClick={() => setViewMode("moj-system")}
                className={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  viewMode === "moj-system"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
                )}
              >
                Mój system
              </button>
              <button
                onClick={() => { setViewMode("widok-wspolny"); router.push("/widok-wspolny"); }}
                className={cn(
                  "relative flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  viewMode === "widok-wspolny"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
                )}
              >
                Widok wspólny
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 text-[9px] font-bold text-white flex items-center justify-center">
                  2
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            const link = (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (viewMode === "widok-wspolny" && !item.href.startsWith("/widok-wspolny")) {
                    setViewMode("moj-system");
                  }
                }}
                className={cn(
                  "flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                  collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{link}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return link;
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-sidebar-border px-2 py-3 space-y-0.5">
          {/* Settings (dropdown) */}
          {(() => {
            const settingsBtn = (
              <button
                className={cn(
                  "flex w-full items-center rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors",
                  collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2"
                )}
              >
                <SettingsIcon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span>Ustawienia</span>}
              </button>
            );

            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>{settingsBtn}</DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="end" className="w-52">
                  <DropdownMenuItem onClick={() => router.push("/ustawienia/udostepnianie")}>
                    <ShieldCheckIcon className="mr-2 h-4 w-4" />
                    Udostępnianie danych
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/ustawienia/podglad")}>
                    <EyeIcon className="mr-2 h-4 w-4" />
                    Podgląd co widzi WG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/ustawienia/crm-mapowanie")}>
                    <NetworkIcon className="mr-2 h-4 w-4" />
                    Mapowanie CRM
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/design-system")}>
                    <PaletteIcon className="mr-2 h-4 w-4" />
                    Design System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })()}

          {/* Notifications */}
          <PowiadomieniaPanel collapsed={collapsed} />

          {/* Separator */}
          <div className="!my-2 h-px bg-sidebar-border" />

          {/* User */}
          <div
            className={cn(
              "flex items-center rounded-lg",
              collapsed ? "justify-center px-0 py-1" : "gap-3 px-3 py-2"
            )}
          >
            {collapsed ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 shrink-0 rounded-full bg-sidebar-accent flex items-center justify-center text-[11px] font-semibold text-sidebar-foreground/70 hover:ring-2 hover:ring-sidebar-accent-foreground/20 transition-all">
                    {initials}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user ? `${user.imie} ${user.nazwisko}` : ""}</p>
                    <p className="text-xs text-muted-foreground">{user?.email ?? ""}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleTheme}>
                    {isDark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                    {isDark ? "Tryb jasny" : "Tryb ciemny"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => { logout(); router.push("/login"); }}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Wyloguj
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <div className="h-8 w-8 shrink-0 rounded-full bg-sidebar-accent flex items-center justify-center text-[11px] font-semibold text-sidebar-foreground/70">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate leading-tight">
                    {user ? `${user.imie} ${user.nazwisko}` : ""}
                  </p>
                  <p className="text-xs text-sidebar-foreground/40 truncate">
                    {user?.email ?? ""}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-md text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
                      <EllipsisVerticalIcon className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="top" align="end" className="w-48">
                    <DropdownMenuItem onClick={toggleTheme}>
                      {isDark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                      {isDark ? "Tryb jasny" : "Tryb ciemny"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => { logout(); router.push("/login"); }}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      Wyloguj
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Expand button when collapsed */}
          {collapsed && (
            <button
              onClick={toggleCollapsed}
              className="flex w-full items-center justify-center rounded-lg py-2 text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              aria-label="Rozwiń menu"
            >
              <ChevronsRightIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
