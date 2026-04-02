import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  haslo: z.string().min(1, "Hasło jest wymagane"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export interface AuthUser {
  id: string;
  imie: string;
  nazwisko: string;
  email: string;
  spolka: string;
  avatarUrl?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}
