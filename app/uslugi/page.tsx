"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { PageHeader } from "@/features/shared/components/page-header";
import { UslugiKatalogTable } from "@/features/uslugi/components/uslugi-katalog-table";
import { UslugiAktywneTable } from "@/features/uslugi/components/uslugi-aktywne-table";
import dynamic from "next/dynamic";

const UslugaForm = dynamic(
  () =>
    import("@/features/uslugi/components/usluga-form").then(
      (m) => m.UslugaForm
    ),
  { ssr: false }
);
import { getUslugi, getAktywneUslugi } from "@/features/uslugi/model/uslugi.data-source";
import { useActiveSystem } from "@/features/shared/context/active-system-context";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function UslugiPage() {
  const [formOpen, setFormOpen] = useState(false);
  const { activeSystem } = useActiveSystem();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tab = searchParams.get("tab") || "katalog";
  const setTab = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  const uslugi = getUslugi(activeSystem);
  const aktywne = getAktywneUslugi(activeSystem);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usługi"
        description="Katalog i aktywne usługi spółki"
      >
        <Button onClick={() => setFormOpen(true)}>
          <PlusIcon className="mr-2 size-4" />
          Dodaj usługę
        </Button>
      </PageHeader>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="katalog">Katalog</TabsTrigger>
          <TabsTrigger value="aktywne">Aktywne usługi</TabsTrigger>
        </TabsList>
        <TabsContent value="katalog" className="mt-4">
          <UslugiKatalogTable uslugi={uslugi} />
        </TabsContent>
        <TabsContent value="aktywne" className="mt-4">
          <UslugiAktywneTable aktywneUslugi={aktywne} />
        </TabsContent>
      </Tabs>

      {formOpen && (
        <UslugaForm open={formOpen} onOpenChange={setFormOpen} />
      )}
    </div>
  );
}
