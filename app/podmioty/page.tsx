"use client";

import { PageHeader } from "@/features/shared/components/page-header";
import { PodmiotyTable } from "@/features/podmioty/components/podmioty-table";
import { getPodmiotyWithRelations } from "@/features/podmioty/model/podmioty.data-source";
import { useActiveSystem } from "@/features/shared/context/active-system-context";

export default function PodmiotyPage() {
  const { activeSystem } = useActiveSystem();
  const allPodmioty = getPodmiotyWithRelations(activeSystem);
  const podmioty = allPodmioty.filter((p) => p.spolka === activeSystem);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Firmy"
        description="Rejestr firm z potwierdzonymi NIP-ami"
      />
      <PodmiotyTable podmioty={podmioty} />
    </div>
  );
}
