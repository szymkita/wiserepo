"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SPOLKA_CONFIG,
  SPOLKI,
  type SpolkaId,
} from "@/features/shared/model/spolki.types";
import type { SpolkaFilterValue } from "@/hooks/use-spolka-filter";

interface SpolkaFilterProps {
  value: SpolkaFilterValue;
  onChange: (value: SpolkaFilterValue) => void;
}

export function SpolkaFilter({ value, onChange }: SpolkaFilterProps) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as SpolkaFilterValue)}
    >
      <SelectTrigger className="w-[200px] bg-card" aria-label="Filtr spółki">
        <SelectValue placeholder="Wszystkie spółki" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Wszystkie spółki</SelectItem>
        {SPOLKI.filter((s) => s !== "wisegroup").map((spolkaId) => {
          const config = SPOLKA_CONFIG[spolkaId];
          return (
            <SelectItem key={spolkaId} value={spolkaId}>
              <span className="flex items-center gap-2">
                <span
                  className="inline-block size-2 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                {config.name}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
