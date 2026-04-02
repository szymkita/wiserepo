import type { AuthUser } from "./auth.types";

export const DEFAULT_USER: AuthUser = {
  id: "prac-1",
  imie: "Jan",
  nazwisko: "Kowalski",
  email: "jan.kowalski@wisegroup.pl",
  spolka: "wisegroup",
};

export function findUserByEmail(email: string): AuthUser {
  return {
    ...DEFAULT_USER,
    email,
  };
}
