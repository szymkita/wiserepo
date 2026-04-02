"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { PageHeader } from "@/features/shared/components/page-header";
import { ZgloszeniaTable } from "@/features/zgloszenia/components/zgloszenia-table";
import { getZgloszenia } from "@/features/zgloszenia/model/zgloszenia.data-source";
import { useActiveSystem } from "@/features/shared/context/active-system-context";

const ZgloszenieForm = dynamic(
  () =>
    import("@/features/zgloszenia/components/zgloszenie-form").then(
      (m) => m.ZgloszenieForm
    ),
  { ssr: false }
);

export default function ZgloszeniaPage() {
  const [formOpen, setFormOpen] = useState(false);
  const { activeSystem } = useActiveSystem();
  const zgloszenia = getZgloszenia(activeSystem);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Zgłoszenia"
        description="Zarządzaj zgłoszeniami od potencjalnych klientów"
      >
        <Button onClick={() => setFormOpen(true)}>
          <PlusIcon className="mr-2 size-4" />
          Dodaj zgłoszenie
        </Button>
      </PageHeader>

      <ZgloszeniaTable zgloszenia={zgloszenia} />
      {formOpen && (
        <ZgloszenieForm open={formOpen} onOpenChange={setFormOpen} />
      )}
    </div>
  );
}
