"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pracownikFormSchema, type PracownikFormValues } from "../model/zespol.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SPOLKI_BEZ_WISEGROUP, SPOLKA_CONFIG } from "@/features/shared/model/spolki.types";
import { toast } from "sonner";

interface PracownikFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PracownikForm({ open, onOpenChange }: PracownikFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PracownikFormValues>({
    resolver: zodResolver(pracownikFormSchema),
    defaultValues: {
      imie: "",
      nazwisko: "",
      email: "",
      telefon: "",
      spolka: "sellwise",
      role: [],
      stanowisko: "",
    },
  });

  const roles = watch("role");

  const toggleRole = (role: "handlowiec" | "wykonawca") => {
    const current = watch("role");
    if (current.includes(role)) {
      setValue("role", current.filter((r) => r !== role));
    } else {
      setValue("role", [...current, role]);
    }
  };

  const onSubmit = (data: PracownikFormValues) => {
    toast.success(`Dodano pracownika: ${data.imie} ${data.nazwisko}`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dodaj pracownika</DialogTitle>
          <DialogDescription>Wprowadź dane nowego pracownika</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="imie">Imię</Label>
              <Input id="imie" {...register("imie")} aria-invalid={!!errors.imie} />
              {errors.imie && <p className="text-xs text-destructive">{errors.imie.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="nazwisko">Nazwisko</Label>
              <Input id="nazwisko" {...register("nazwisko")} aria-invalid={!!errors.nazwisko} />
              {errors.nazwisko && <p className="text-xs text-destructive">{errors.nazwisko.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} aria-invalid={!!errors.email} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="telefon">Telefon</Label>
              <Input id="telefon" type="tel" {...register("telefon")} aria-invalid={!!errors.telefon} />
              {errors.telefon && <p className="text-xs text-destructive">{errors.telefon.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Spółka</Label>
              <Select value={watch("spolka")} onValueChange={(v) => setValue("spolka", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SPOLKI_BEZ_WISEGROUP.map((s) => (
                    <SelectItem key={s} value={s}>{SPOLKA_CONFIG[s].name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Role</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={roles.includes("handlowiec")}
                  onCheckedChange={() => toggleRole("handlowiec")}
                />
                Handlowiec
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={roles.includes("wykonawca")}
                  onCheckedChange={() => toggleRole("wykonawca")}
                />
                Wykonawca
              </label>
            </div>
            {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="stanowisko">Stanowisko</Label>
            <Input id="stanowisko" {...register("stanowisko")} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button type="submit">Dodaj pracownika</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
