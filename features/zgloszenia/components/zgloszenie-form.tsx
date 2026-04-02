"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zgloszenieFormSchema, type ZgloszenieFormValues } from "../model/zgloszenia.types";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { FloatingSelect } from "@/components/ui/floating-select";
import { SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useActiveSystem } from "@/features/shared/context/active-system-context";
import { getHandlowcy } from "@/features/zespol/model/zespol.data-source";
import { toast } from "sonner";

interface ZgloszenieFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ZgloszenieForm({ open, onOpenChange }: ZgloszenieFormProps) {
  const { activeSystem } = useActiveSystem();
  const handlowcy = getHandlowcy(activeSystem);

  const {
    register, handleSubmit, watch, setValue, reset, formState: { errors },
  } = useForm<ZgloszenieFormValues>({
    resolver: zodResolver(zgloszenieFormSchema),
    defaultValues: {
      email: "",
      telefon: "",
      wiadomosc: "",
      zrodlo: "telefon",
      handlowiecId: "",
    },
  });

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      reset();
    }, 200);
  };

  const onSubmit = (_data: ZgloszenieFormValues) => {
    toast.success("Zgłoszenie dodane pomyślnie");
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        <DialogHeader className="px-8 pt-6 pb-5 border-b bg-muted/30">
          <DialogTitle className="text-lg">Dodaj zgłoszenie</DialogTitle>
          <DialogDescription>Wprowadź dane nowego zgłoszenia</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6">
          <div className="space-y-4">
            <FloatingInput
              label="Email"
              type="email"
              {...register("email")}
              state={errors.email ? "error" : "default"}
              hint={errors.email?.message}
            />

            <FloatingInput
              label="Telefon"
              type="tel"
              {...register("telefon")}
            />

            <FloatingTextarea
              label="Wiadomość"
              {...register("wiadomosc")}
            />

            <FloatingSelect
              label="Źródło"
              value={watch("zrodlo")}
              onValueChange={(v) => setValue("zrodlo", v as "telefon" | "email")}
            >
              <SelectItem value="telefon">Telefon</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </FloatingSelect>

            <FloatingSelect
              label="Handlowiec"
              value={watch("handlowiecId")}
              onValueChange={(v) => setValue("handlowiecId", v)}
              state={errors.handlowiecId ? "error" : "default"}
              hint={errors.handlowiecId?.message}
            >
              {handlowcy.map((h) => (
                <SelectItem key={h.id} value={h.id}>{h.imie} {h.nazwisko}</SelectItem>
              ))}
            </FloatingSelect>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
            <Button type="button" variant="ghost" onClick={handleClose}>Anuluj</Button>
            <Button type="submit" size="lg">Dodaj zgłoszenie</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
