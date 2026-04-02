"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { uslugaFormSchema, type UslugaFormValues } from "../model/uslugi.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface UslugaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UslugaForm({ open, onOpenChange }: UslugaFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UslugaFormValues>({
    resolver: zodResolver(uslugaFormSchema),
    defaultValues: {
      nazwa: "",
      spolka: "sellwise",
      typ: "jednorazowa",
      opis: "",
    },
  });

  const onSubmit = (data: UslugaFormValues) => {
    toast.success(`Dodano usługę: ${data.nazwa}`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dodaj usługę</DialogTitle>
          <DialogDescription>Wprowadź dane nowej usługi</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="nazwa">Nazwa</Label>
            <Input id="nazwa" {...register("nazwa")} aria-invalid={!!errors.nazwa} />
            {errors.nazwa && <p className="text-xs text-destructive">{errors.nazwa.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
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
            <div className="space-y-1">
              <Label>Typ</Label>
              <Select value={watch("typ")} onValueChange={(v) => setValue("typ", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="jednorazowa">Jednorazowa</SelectItem>
                  <SelectItem value="abonamentowa">Abonamentowa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="opis">Opis</Label>
            <Textarea id="opis" rows={3} {...register("opis")} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button type="submit">Dodaj usługę</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
