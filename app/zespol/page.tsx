"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { PageHeader } from "@/features/shared/components/page-header";
import { ZespolTable } from "@/features/zespol/components/zespol-table";
import { getPracownicyBySpolka } from "@/features/zespol/model/zespol.data-source";
import { useActiveSystem } from "@/features/shared/context/active-system-context";

const PracownikForm = dynamic(
  () =>
    import("@/features/zespol/components/pracownik-form").then(
      (m) => m.PracownikForm
    ),
  { ssr: false }
);

export default function ZespolPage() {
  const [formOpen, setFormOpen] = useState(false);
  const { activeSystem } = useActiveSystem();
  const pracownicy = getPracownicyBySpolka(activeSystem);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Zespół"
        description="Pracownicy spółki"
      >
        <Button onClick={() => setFormOpen(true)}>
          <PlusIcon className="mr-2 size-4" />
          Dodaj pracownika
        </Button>
      </PageHeader>

      <ZespolTable pracownicy={pracownicy} />
      {formOpen && (
        <PracownikForm open={formOpen} onOpenChange={setFormOpen} />
      )}
    </div>
  );
}
