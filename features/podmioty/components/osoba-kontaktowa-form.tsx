"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  osobaKontaktowaFormSchema,
  type OsobaKontaktowaFormValues,
} from "../model/podmioty.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface OsobaKontaktowaFormProps {
  podmiotId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OsobaKontaktowaForm({
  podmiotId,
  open,
  onOpenChange,
}: OsobaKontaktowaFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OsobaKontaktowaFormValues>({
    resolver: zodResolver(osobaKontaktowaFormSchema),
    defaultValues: {
      podmiotId,
      imie: "",
      nazwisko: "",
      email: "",
      telefon: "",
      stanowisko: "",
    },
  });

  const onSubmit = (data: OsobaKontaktowaFormValues) => {
    toast.success(`Dodano osobę kontaktową: ${data.imie} ${data.nazwisko}`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dodaj osobę kontaktową</DialogTitle>
          <DialogDescription>
            Wprowadź dane nowej osoby kontaktowej
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="imie">Imię</Label>
              <Input id="imie" {...register("imie")} aria-invalid={!!errors.imie} />
              {errors.imie && (
                <p className="text-xs text-destructive">{errors.imie.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="nazwisko">Nazwisko</Label>
              <Input id="nazwisko" {...register("nazwisko")} aria-invalid={!!errors.nazwisko} />
              {errors.nazwisko && (
                <p className="text-xs text-destructive">{errors.nazwisko.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="telefon">Telefon</Label>
              <Input id="telefon" type="tel" {...register("telefon")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="stanowisko">Stanowisko</Label>
              <Input id="stanowisko" {...register("stanowisko")} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button type="submit">Dodaj</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
