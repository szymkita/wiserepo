"use client";

import { PageHeader } from "@/features/shared/components/page-header";
import { WspolniKlienciList } from "@/features/widok-wspolny/components/wspolni-klienci-list";
import { getWspolniKlienciForSpolka } from "@/features/widok-wspolny/model/wspolni-klienci.data-source";
import { useActiveSystem } from "@/features/shared/context/active-system-context";

export default function WidokWspolnyPage() {
  const { activeSystem } = useActiveSystem();
  const wspolniKlienci = getWspolniKlienciForSpolka(activeSystem);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wspólni klienci"
        description="Firmy wykryte w systemach wielu spółek grupy"
      />
      <WspolniKlienciList wspolniKlienci={wspolniKlienci} />
    </div>
  );
}
