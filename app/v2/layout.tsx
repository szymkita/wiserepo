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
  type LucideIcon,
} from "lucide-react";
import { ActiveSystemProvider } from "@/features/shared/context/active-system-context";
import { AuthGuard } from "@/components/layout/auth-guard";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

/* ─── Nav config ─── */
interface NavItem { href: string; label: string; icon: LucideIcon }

const NAV: NavItem[] = [
  { href: "/v2/zgloszenia", label: "Zgloszenia", icon: InboxIcon },
  { href: "/v2/podmioty", label: "Firmy", icon: BuildingIcon },
  { href: "/v2/projekty", label: "Projekty", icon: FolderIcon },
  { href: "/v2/uslugi", label: "Uslugi", icon: PackageIcon },
  { href: "/v2/polecenia", label: "Polecenia", icon: ArrowRightLeftIcon },
  { href: "/v2/zespol", label: "Zespol", icon: UserCircleIcon },
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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col border-r border-border/40 bg-background">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-8">
        <div
          className="h-7 w-7 rounded-lg"
          style={{ backgroundColor: config.color }}
        />
        <span className="text-[13px] font-semibold tracking-tight text-foreground">
          {config.name}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        <p className="px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground/60">
          Menu
        </p>
        {NAV.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium transition-colors duration-150",
                isActive
                  ? "bg-foreground/[0.05] text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
              )}
            >
              <item.icon
                className={cn(
                  "size-[15px] shrink-0 transition-colors duration-150",
                  isActive ? "text-foreground" : "text-muted-foreground/70 group-hover:text-muted-foreground"
                )}
                strokeWidth={1.75}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-1">
        <button
          onClick={() => router.push("/v2/ustawienia")}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03] transition-colors duration-150"
        >
          <SettingsIcon className="size-[15px] shrink-0 text-muted-foreground/70" strokeWidth={1.75} />
          Ustawienia
        </button>

        <div className="mx-3 my-2 h-px bg-border/40" />

        <div className="flex items-center gap-2.5 px-3 py-1">
          <div className="flex size-7 items-center justify-center rounded-full bg-foreground/[0.06] text-[10px] font-semibold text-muted-foreground">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-foreground truncate leading-tight">
              {user ? `${user.imie} ${user.nazwisko}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={toggleTheme}
              className="p-1 rounded-md text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              {isDark ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </button>
            <button
              onClick={() => { logout(); router.push("/login"); }}
              className="p-1 rounded-md text-muted-foreground/50 hover:text-destructive transition-colors"
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
  "/v2/zgloszenia": "Zgloszenia",
  "/v2/podmioty": "Firmy",
  "/v2/projekty": "Projekty",
  "/v2/uslugi": "Uslugi",
  "/v2/polecenia": "Polecenia",
  "/v2/zespol": "Zespol",
};

function V2Header() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const base = "/" + segments.slice(0, 2).join("/");
  const label = ROUTE_LABELS[base] ?? segments[1] ?? "";
  const isDetail = segments.length > 2;

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center justify-between bg-background/90 backdrop-blur-md px-8">
      <div className="flex items-center gap-1.5 text-[13px]">
        {isDetail && (
          <>
            <Link href={base} className="text-muted-foreground/60 hover:text-muted-foreground transition-colors">
              {label}
            </Link>
            <span className="text-muted-foreground/30">/</span>
          </>
        )}
        <span className="font-medium text-foreground">
          {isDetail ? "Szczegoly" : label}
        </span>
      </div>
      <div className="flex items-center">
        <button className="flex items-center gap-2 rounded-lg border border-border/40 bg-foreground/[0.02] px-3 py-1.5 text-[12px] text-muted-foreground/60 hover:text-muted-foreground transition-colors w-56">
          <SearchIcon className="size-3.5" strokeWidth={1.75} />
          <span>Szukaj...</span>
          <kbd className="ml-auto text-[10px] font-mono text-muted-foreground/40 border border-border/40 rounded px-1 py-0.5">/</kbd>
        </button>
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
          <div className="min-h-screen ml-[220px]">
            <V2Header />
            <main className="px-8 py-6">
              <div className="mx-auto max-w-5xl animate-fade-in">
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
