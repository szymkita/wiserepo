"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../model/auth.types";
import { useAuth } from "../hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircleIcon } from "lucide-react";
import Image from "next/image";

export function LoginForm() {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "jan.kowalski@wisegroup.pl",
      haslo: "demo1234",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    const result = await login(data.email);

    if (result.success) {
      window.location.href = "/";
    } else {
      setServerError(result.error ?? "Błąd logowania");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel — brand */}
      <div className="hidden w-1/2 items-center justify-center bg-[#111827] lg:flex">
        <div className="max-w-md px-12 text-center">
          <div className="mb-8 flex items-center justify-center">
            <Image
              src="/logo.webp"
              alt="WiseGroup"
              width={280}
              height={48}
              className="brightness-0 invert"
              priority
            />
          </div>
          <p className="text-lg font-medium text-white/80">
            System do współpracy między spółkami WiseGroup
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center lg:hidden">
            <Image
              src="/logo.webp"
              alt="WiseGroup"
              width={200}
              height={34}
              className="dark:brightness-0 dark:invert"
              priority
            />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Zaloguj się</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Wprowadź dane aby przejść do systemu
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError ? (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
                <AlertCircleIcon className="size-4 shrink-0" />
                {serverError}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="jan.kowalski@wisegroup.pl"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email ? (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="haslo">Hasło</Label>
              <Input
                id="haslo"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                {...register("haslo")}
                aria-invalid={!!errors.haslo}
              />
              {errors.haslo ? (
                <p className="text-sm text-destructive">{errors.haslo.message}</p>
              ) : null}
            </div>

            <Button type="submit" className="w-full h-10" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 size-4" />
                  Logowanie...
                </>
              ) : (
                "Zaloguj się"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
