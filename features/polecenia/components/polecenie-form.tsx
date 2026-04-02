"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  polecenieFormSchema,
  type PolecenieFormValues,
} from "../model/polecenia.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { getPodmioty } from "@/features/podmioty/model/podmioty.data-source";
import { toast } from "sonner";

interface PolecenieFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PolecenieForm({ open, onOpenChange }: PolecenieFormProps) {
  const podmioty = getPodmioty();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PolecenieFormValues>({
    resolver: zodResolver(polecenieFormSchema),
    defaultValues: {
      typ: "aktywne",
      spolkaDocelowa: "sellwise",
      podmiotId: "",
      opis: "",
      prowizjaNalezna: true,
    },
  });

  const typ = watch("typ");

  const onSubmit = (data: PolecenieFormValues) => {
    toast.success("Polecenie utworzone — zgłoszenie w spółce docelowej automatycznie utworzone");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nowe polecenie</DialogTitle>
          <DialogDescription>
            Poleć firmę do innej spółki
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Typ</Label>
              <Select value={typ} onValueChange={(v) => {
                setValue("typ", v as any);
                setValue("prowizjaNalezna", v === "aktywne");
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktywne">Aktywne</SelectItem>
                  <SelectItem value="przekierowanie">Przekierowanie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Spółka docelowa</Label>
              <Select
                value={watch("spolkaDocelowa")}
                onValueChange={(v) => setValue("spolkaDocelowa", v as any)}
              >
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
            <Label>Firma</Label>
            <Select value={watch("podmiotId")} onValueChange={(v) => setValue("podmiotId", v)}>
              <SelectTrigger aria-invalid={!!errors.podmiotId}>
                <SelectValue placeholder="Wybierz firmę" />
              </SelectTrigger>
              <SelectContent>
                {podmioty.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nazwa} (NIP: {p.nip})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.podmiotId && <p className="text-xs text-destructive">{errors.podmiotId.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="opis">Opis potrzeby klienta</Label>
            <Textarea id="opis" rows={3} {...register("opis")} aria-invalid={!!errors.opis} />
            {errors.opis && <p className="text-xs text-destructive">{errors.opis.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Osoba kontaktowa (opcjonalnie)</Label>
            <Input placeholder="Kogo w firmie polecamy" {...register("osobaKontaktowa" as any)} />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={watch("prowizjaNalezna")}
              onCheckedChange={(checked) => setValue("prowizjaNalezna", !!checked)}
            />
            Prowizja należna
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Anuluj
            </Button>
            <Button type="submit">Utwórz polecenie</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
