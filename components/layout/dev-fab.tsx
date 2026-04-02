"use client";

import { useRouter } from "next/navigation";
import { PaletteIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function DevFab() {
  const router = useRouter();

  return (
    <div className="fixed top-4 left-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="size-10 rounded-full shadow-lg bg-card border-border/60 hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <PaletteIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={8}>
          <DropdownMenuItem onSelect={() => router.push("/design-system")}>
            <PaletteIcon className="size-4" />
            Wygląd
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
