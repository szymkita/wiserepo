export interface WspolnaUsluga {
  nazwa: string;
  typ: "jednorazowa" | "abonamentowa";
}

export interface WspolnyProjekt {
  nazwa: string;
  zakres?: string;
  wykonawcy: string[];
  uslugi: WspolnaUsluga[];
  status: string;
  dataOd: string;
}

export interface WspolnaOsobaKontaktowa {
  imie: string;
  nazwisko: string;
  stanowisko?: string;
  email?: string;
}

export interface WspolneZgloszenie {
  numer: string;
  data: string;
  status: string;
  zrodlo: string;
}

export interface MojaSpolkaSkrot {
  spolka: string;
  status: string;
  aktywneProjektyCount: number;
  dataOd: string;
}

export interface InnaSpolkaInfo {
  spolka: string;
  status: string;
  zgloszenia: WspolneZgloszenie[];
  osobyKontaktowe: WspolnaOsobaKontaktowa[];
  projekty: WspolnyProjekt[];
  dataOd: string;
}

export interface MatchEvent {
  spolka: string;
  data: string;
}

export interface WspolnyKlient {
  nip: string;
  nazwaFirmy: string;
  miasto: string;
  mojaSpolka: MojaSpolkaSkrot;
  inneSpolki: InnaSpolkaInfo[];
  matchTimeline: MatchEvent[];
}
