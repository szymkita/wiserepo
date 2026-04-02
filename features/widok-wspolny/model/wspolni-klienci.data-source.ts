import type { WspolnyKlient } from "./wspolni-klienci.types";
import { mockWspolniKlienciRaw } from "./wspolni-klienci.mock";

export function getWspolniKlienci(): WspolnyKlient[] {
  return mockWspolniKlienciRaw;
}

export function getWspolnyKlientByNip(nip: string): WspolnyKlient | undefined {
  return mockWspolniKlienciRaw.find((wk) => wk.nip === nip);
}

export function getWspolniKlienciForSpolka(spolka: string): WspolnyKlient[] {
  return mockWspolniKlienciRaw.filter(
    (wk) =>
      wk.mojaSpolka.spolka === spolka ||
      wk.inneSpolki.some((s) => s.spolka === spolka)
  );
}

export function getWspolniKlienciCount(): number {
  return mockWspolniKlienciRaw.length;
}
