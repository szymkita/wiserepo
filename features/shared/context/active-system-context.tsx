"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { SpolkaOperacyjna, ViewMode } from "../model/spolki.types";

interface ActiveSystemContextValue {
  activeSystem: SpolkaOperacyjna;
  viewMode: ViewMode;
  setActiveSystem: (id: SpolkaOperacyjna) => void;
  setViewMode: (mode: ViewMode) => void;
}

const ActiveSystemContext = createContext<ActiveSystemContextValue | null>(null);

const STORAGE_KEY_SYSTEM = "wisegroup_active_system";
const STORAGE_KEY_VIEW = "wisegroup_view_mode";

function getInitialSystem(): SpolkaOperacyjna {
  if (typeof window === "undefined") return "sellwise";
  const stored = localStorage.getItem(STORAGE_KEY_SYSTEM);
  if (
    stored === "sellwise" ||
    stored === "adwise" ||
    stored === "hirewise" ||
    stored === "letsautomate" ||
    stored === "finerto"
  ) {
    return stored;
  }
  return "sellwise";
}

function getInitialView(): ViewMode {
  if (typeof window === "undefined") return "moj-system";
  const stored = localStorage.getItem(STORAGE_KEY_VIEW);
  if (stored === "moj-system" || stored === "widok-wspolny") return stored;
  return "moj-system";
}

export function ActiveSystemProvider({ children }: { children: ReactNode }) {
  const [activeSystem, setActiveSystemState] = useState<SpolkaOperacyjna>(getInitialSystem);
  const [viewMode, setViewModeState] = useState<ViewMode>(getInitialView);

  const setActiveSystem = useCallback((id: SpolkaOperacyjna) => {
    setActiveSystemState(id);
    localStorage.setItem(STORAGE_KEY_SYSTEM, id);
    // Reset to "moj-system" when switching companies
    setViewModeState("moj-system");
    localStorage.setItem(STORAGE_KEY_VIEW, "moj-system");
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem(STORAGE_KEY_VIEW, mode);
  }, []);

  return (
    <ActiveSystemContext.Provider
      value={{ activeSystem, viewMode, setActiveSystem, setViewMode }}
    >
      {children}
    </ActiveSystemContext.Provider>
  );
}

export function useActiveSystem() {
  const ctx = useContext(ActiveSystemContext);
  if (!ctx) {
    throw new Error("useActiveSystem must be used within ActiveSystemProvider");
  }
  return ctx;
}
