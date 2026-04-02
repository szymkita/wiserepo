import { SPOLKA_CONFIG, type SpolkaId } from "@/features/shared/model/spolki.types";
import { ConstructionIcon } from "lucide-react";

interface ModulePlaceholderProps {
  spolka: SpolkaId;
}

export function ModulePlaceholder({ spolka }: ModulePlaceholderProps) {
  const config = SPOLKA_CONFIG[spolka];

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <ConstructionIcon className="text-muted-foreground size-16" />
      <div className="text-center">
        <h2 className="text-xl font-semibold">
          Moduł {config.name}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Wkrótce dostępny
        </p>
      </div>
    </div>
  );
}
