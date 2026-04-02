"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import type { SpolkaId } from "@/features/shared/model/spolki.types";

export type SpolkaFilterValue = SpolkaId | "all";

export function useSpolkaFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const current: SpolkaFilterValue =
    (searchParams.get("spolka") as SpolkaFilterValue) || "all";

  const setFilter = useCallback(
    (value: SpolkaFilterValue) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete("spolka");
      } else {
        params.set("spolka", value);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [searchParams, router, pathname]
  );

  return { spolkaFilter: current, setSpolkaFilter: setFilter };
}
