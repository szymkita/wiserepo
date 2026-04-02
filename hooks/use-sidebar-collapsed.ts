"use client";

import { useSyncExternalStore, useCallback } from "react";

const STORAGE_KEY = "sidebar-collapsed";

let listeners: (() => void)[] = [];

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function setCollapsed(value: boolean) {
  localStorage.setItem(STORAGE_KEY, String(value));
  listeners.forEach((l) => l());
}

export function useSidebarCollapsed() {
  const collapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = useCallback(() => {
    setCollapsed(!getSnapshot());
  }, []);

  return { collapsed, toggle };
}
