"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { PageHeader } from "@/features/shared/components/page-header";
import { ProjektyTable } from "@/features/projekty/components/projekty-table";
import { getProjekty } from "@/features/projekty/model/projekty.data-source";
import { useActiveSystem } from "@/features/shared/context/active-system-context";

const ProjektForm = dynamic(
  () => import("@/features/projekty/components/projekt-form").then((m) => m.ProjektForm),
  { ssr: false }
);

export default function ProjektyPage() {
  const [formOpen, setFormOpen] = useState(false);
  const { activeSystem } = useActiveSystem();
  const projekty = getProjekty(activeSystem);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projekty"
        description="Projekty realizowane dla klientów"
      >
        <Button onClick={() => setFormOpen(true)}>
          <PlusIcon className="mr-2 size-4" />
          Nowy projekt
        </Button>
      </PageHeader>
      <ProjektyTable projekty={projekty} />
      {formOpen && (
        <ProjektForm open={formOpen} onOpenChange={setFormOpen} />
      )}
    </div>
  );
}
