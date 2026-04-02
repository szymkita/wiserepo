"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { PageHeader } from "@/features/shared/components/page-header";
import { PoleceniaTable } from "@/features/polecenia/components/polecenia-table";
import { getPolecenia } from "@/features/polecenia/model/polecenia.data-source";
import { useActiveSystem } from "@/features/shared/context/active-system-context";

const PolecenieForm = dynamic(
  () =>
    import("@/features/polecenia/components/polecenie-form").then(
      (m) => m.PolecenieForm
    ),
  { ssr: false }
);

export default function PoleceniaPage() {
  const [formOpen, setFormOpen] = useState(false);
  const { activeSystem } = useActiveSystem();
  const polecenia = getPolecenia(activeSystem);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Polecenia"
        description="Polecenia wewnętrzne między spółkami grupy"
      >
        <Button onClick={() => setFormOpen(true)}>
          <PlusIcon className="mr-2 size-4" />
          Nowe polecenie
        </Button>
      </PageHeader>

      <PoleceniaTable polecenia={polecenia} />
      {formOpen && (
        <PolecenieForm open={formOpen} onOpenChange={setFormOpen} />
      )}
    </div>
  );
}
