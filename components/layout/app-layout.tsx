"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { DemoSwitcher } from "./demo-switcher";
import { AuthGuard } from "./auth-guard";
import { ActiveSystemProvider } from "@/features/shared/context/active-system-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";

// main sidebar only (no workspace strip)
const SIDEBAR_EXPANDED = "14rem"; // 224px
const SIDEBAR_COLLAPSED = "3.5rem"; // 56px

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isDesignSystem = pathname === "/design-system";
  const isDemoPage = pathname.startsWith("/demo");
  const { collapsed } = useSidebarCollapsed();

  if (isLoginPage) {
    return (
      <AuthGuard>
        <Suspense>{children}</Suspense>
        <Toaster />
      </AuthGuard>
    );
  }

  if (isDesignSystem) {
    return (
      <AuthGuard>
        <Suspense>{children}</Suspense>
        <Toaster />
      </AuthGuard>
    );
  }

  if (isDemoPage) {
    return (
      <AuthGuard>
        <ActiveSystemProvider>
          <main className="min-h-screen">
            <Suspense>{children}</Suspense>
          </main>
          <DemoSwitcher />
        </ActiveSystemProvider>
        <Toaster />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <ActiveSystemProvider>
        <TooltipProvider delayDuration={0}>
          <AppSidebar />
          <div
            className="min-h-screen transition-[margin-left] duration-200"
            style={{ marginLeft: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED }}
          >
            <Suspense>
              <AppHeader />
            </Suspense>
            <main className="p-6 lg:p-8">
              <div className="animate-fade-in">
                <Suspense>{children}</Suspense>
              </div>
            </main>
          </div>
          <DemoSwitcher />
        </TooltipProvider>
      </ActiveSystemProvider>
      <Toaster />
    </AuthGuard>
  );
}
