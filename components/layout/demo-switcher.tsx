"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SPOLKA_CONFIG,
  type SpolkaOperacyjna,
} from "@/features/shared/model/spolki.types";
import { useActiveSystem } from "@/features/shared/context/active-system-context";
import {
  SettingsIcon,
  XIcon,
  Building2Icon,
  GlobeIcon,
  PlugIcon,
} from "lucide-react";

const SYSTEM_ITEMS: { id: SpolkaOperacyjna; icon: string }[] = [
  { id: "sellwise", icon: "/sellwise.png" },
  { id: "adwise", icon: "/adwise.png" },
  { id: "hirewise", icon: "/hirewise.png" },
  { id: "letsautomate", icon: "/letsautomate.png" },
  { id: "finerto", icon: "/finerto.png" },
];

const DEMO_ITEMS = [
  {
    href: "/demo/formularz-spolki",
    label: "Formularz spółki",
    icon: Building2Icon,
  },
  {
    href: "/demo/formularz-wisegroup",
    label: "Formularz WiseGroup",
    icon: GlobeIcon,
  },
  {
    href: "/demo/symulator-hubspot",
    label: "HubSpot (Finerto)",
    icon: PlugIcon,
  },
  {
    href: "/demo/symulator-pipedrive",
    label: "Pipedrive (Let's Automate)",
    icon: PlugIcon,
  },
  {
    href: "/demo/symulator-livespace",
    label: "Livespace",
    icon: PlugIcon,
  },
];

export function DemoSwitcher() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { activeSystem, setActiveSystem } = useActiveSystem();

  const isDemo = pathname.startsWith("/demo");

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Panel */}
      {open && (
        <div className="w-72 rounded-xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Systemy spółek */}
          <div className="p-3 border-b border-border">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Systemy
            </p>
            <div className="grid grid-cols-3 gap-2">
              {SYSTEM_ITEMS.map((item) => {
                const config = SPOLKA_CONFIG[item.id];
                const isActive = !isDemo && activeSystem === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSystem(item.id);
                      if (isDemo) router.push("/");
                      setOpen(false);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors",
                      isActive ? "bg-accent" : "hover:bg-accent"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center w-9 h-9 rounded-lg bg-white overflow-hidden transition-shadow",
                        isActive && "shadow-md"
                      )}
                      style={isActive ? { boxShadow: `0 0 0 2px ${config.color}` } : undefined}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.icon}
                        alt={config.name}
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-medium text-foreground/70 leading-tight text-center">
                      {config.shortName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Symulatory demo */}
          <div className="p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Symulatory demo
            </p>
            <div className="space-y-0.5">
              {DEMO_ITEMS.map((item) => {
                const isDemoActive = pathname === item.href;
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                      isDemoActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-foreground/70 hover:bg-accent"
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-center size-12 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105",
          open
            ? "bg-foreground text-background"
            : "bg-card border border-border text-foreground"
        )}
      >
        {open ? (
          <XIcon className="size-5" />
        ) : (
          <SettingsIcon className="size-5" />
        )}
      </button>
    </div>
  );
}
