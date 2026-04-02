"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboardIcon, Building2Icon, GlobeIcon, PlugIcon } from "lucide-react";

const DEMO_TABS = [
  {
    href: "/",
    label: "System",
    icon: LayoutDashboardIcon,
    matchPrefix: false,
  },
  {
    href: "/demo/formularz-spolki",
    label: "Formularz spółki",
    icon: Building2Icon,
    matchPrefix: false,
  },
  {
    href: "/demo/formularz-wisegroup",
    label: "Formularz WiseGroup",
    icon: GlobeIcon,
    matchPrefix: false,
  },
  {
    href: "/demo/symulator-hubspot",
    label: "HubSpot (Finerto)",
    icon: PlugIcon,
    matchPrefix: false,
  },
  {
    href: "/demo/symulator-pipedrive",
    label: "Pipedrive (Let's Automate)",
    icon: PlugIcon,
    matchPrefix: false,
  },
  {
    href: "/demo/symulator-livespace",
    label: "Livespace",
    icon: PlugIcon,
    matchPrefix: false,
  },
] as const;

export function DemoBrowserBar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-muted border-b border-border px-2 pt-2 flex items-end gap-0.5 overflow-x-auto scrollbar-none">
      {DEMO_TABS.map((tab) => {
        const isActive =
          tab.href === "/"
            ? !pathname.startsWith("/demo")
            : pathname === tab.href;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap shrink-0",
              isActive
                ? "bg-background text-foreground border-t border-l border-r border-border shadow-[0_1px_0_0_hsl(var(--background))]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
            )}
          >
            <Icon className="size-3.5 shrink-0" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
