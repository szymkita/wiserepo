"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { PodmiotDetail } from "@/features/podmioty/components/podmiot-detail";
import { getPodmiotById } from "@/features/podmioty/model/podmioty.data-source";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function PodmiotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const podmiot = getPodmiotById(id);

  if (!podmiot) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <Link href="/podmioty">
        <Button variant="ghost" size="sm">
          <ArrowLeftIcon className="mr-1 size-4" />
          Podmioty
        </Button>
      </Link>
      <PodmiotDetail podmiot={podmiot} />
    </div>
  );
}
