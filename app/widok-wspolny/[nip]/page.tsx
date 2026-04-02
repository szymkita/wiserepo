"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { WspolnyKlientCard } from "@/features/widok-wspolny/components/wspolny-klient-card";
import { getWspolnyKlientByNip } from "@/features/widok-wspolny/model/wspolni-klienci.data-source";

export default function WspolnyKlientPage({ params }: { params: Promise<{ nip: string }> }) {
  const { nip } = use(params);
  const wspolnyKlient = getWspolnyKlientByNip(nip);

  if (!wspolnyKlient) {
    notFound();
  }

  return <WspolnyKlientCard wspolnyKlient={wspolnyKlient} />;
}
