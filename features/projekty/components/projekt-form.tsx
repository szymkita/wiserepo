"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  projektFormSchema,
  type ProjektFormValues,
  charakterProjektu,
  CHARAKTER_LABELS,
} from "../model/projekty.types";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { FloatingSelect } from "@/components/ui/floating-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SelectItem } from "@/components/ui/select";
import { useActiveSystem } from "@/features/shared/context/active-system-context";
import { getUslugiDlaSpolki } from "@/features/uslugi/model/uslugi.data-source";
import { TYP_USLUGI_LABELS } from "@/features/uslugi/model/uslugi.types";
import { getWykonawcy } from "@/features/zespol/model/zespol.data-source";
import { getPodmiotyByStatus } from "@/features/podmioty/model/podmioty.data-source";
import { getOsobyKontaktowe } from "@/features/podmioty/model/podmioty.data-source";
import { toast } from "sonner";
import { useMemo } from "react";

interface ProjektFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPodmiotId?: string;
}

export function ProjektForm({ open, onOpenChange, defaultPodmiotId }: ProjektFormProps) {
  const { activeSystem } = useActiveSystem();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjektFormValues>({
    resolver: zodResolver(projektFormSchema),
    defaultValues: {
      nazwa: "",
      charakter: "staly",
      podmiotId: defaultPodmiotId ?? "",
      opiekunId: "",
      uslugaIds: [],
      wykonawcaIds: [],
      osobyKontaktoweIds: [],
      zakres: "",
      dataOd: "",
      dataDo: "",
    },
  });

  const charakter = watch("charakter");
  const podmiotId = watch("podmiotId");
  const uslugaIdsValue = watch("uslugaIds");
  const wykonawcaIdsValue = watch("wykonawcaIds");
  const osobyKontaktoweIdsValue = watch("osobyKontaktoweIds");

  const klienci = useMemo(
    () => getPodmiotyByStatus("klient").filter((p) => p.spolka === activeSystem),
    [activeSystem]
  );

  const uslugi = useMemo(
    () => getUslugiDlaSpolki(activeSystem),
    [activeSystem]
  );

  const wykonawcy = useMemo(
    () => getWykonawcy(activeSystem),
    [activeSystem]
  );

  const osobyKontaktowe = useMemo(
    () => (podmiotId ? getOsobyKontaktowe(podmiotId) : []),
    [podmiotId]
  );

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => reset(), 200);
  };

  const onSubmit = (_data: ProjektFormValues) => {
    toast.success("Projekt utworzony");
    handleClose();
  };

  const toggleArray = (
    field: "uslugaIds" | "wykonawcaIds" | "osobyKontaktoweIds",
    id: string,
    current: string[]
  ) => {
    const next = current.includes(id) ? current.filter((v) => v !== id) : [...current, id];
    setValue(field, next, { shouldValidate: true });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl p-0 gap-0">
        <DialogHeader className="px-8 pt-6 pb-5 border-b bg-muted/30">
          <DialogTitle className="text-lg">Nowy projekt</DialogTitle>
          <DialogDescription>
            Utwórz projekt dla klienta
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6">
          <div className="space-y-6">
            {/* Nazwa */}
            <FloatingInput
              label="Nazwa projektu"
              {...register("nazwa")}
              state={errors.nazwa ? "error" : "default"}
              hint={errors.nazwa?.message}
            />

            {/* Firma + Charakter */}
            <div className="grid grid-cols-2 gap-4">
              <FloatingSelect
                label="Firma"
                value={podmiotId}
                onValueChange={(v) => {
                  setValue("podmiotId", v, { shouldValidate: true });
                  setValue("osobyKontaktoweIds", []);
                }}
                state={errors.podmiotId ? "error" : "default"}
                hint={errors.podmiotId?.message}
              >
                {klienci.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nazwa}
                  </SelectItem>
                ))}
              </FloatingSelect>

              <FloatingSelect
                label="Charakter"
                value={charakter}
                onValueChange={(v) => setValue("charakter", v as ProjektFormValues["charakter"], { shouldValidate: true })}
              >
                {charakterProjektu.map((c) => (
                  <SelectItem key={c} value={c}>
                    {CHARAKTER_LABELS[c]}
                  </SelectItem>
                ))}
              </FloatingSelect>
            </div>

            {/* Opiekun */}
            <FloatingSelect
              label="Opiekun projektu"
              value={watch("opiekunId")}
              onValueChange={(v) => setValue("opiekunId", v, { shouldValidate: true })}
              state={errors.opiekunId ? "error" : "default"}
              hint={errors.opiekunId?.message}
            >
              {wykonawcy.map((w) => (
                <SelectItem key={w.id} value={w.id}>
                  {w.imie} {w.nazwisko}
                </SelectItem>
              ))}
            </FloatingSelect>

            {/* Zakres */}
            <FloatingTextarea
              label="Zakres współpracy"
              {...register("zakres")}
            />

            {/* Osoby kontaktowe z firmy */}
            {podmiotId && osobyKontaktowe.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Osoby kontaktowe (ze strony klienta)</h3>
                <div className="rounded-lg border border-border/60 p-4 space-y-2">
                  {osobyKontaktowe.map((o) => (
                    <div key={o.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`osoba-${o.id}`}
                        checked={osobyKontaktoweIdsValue.includes(o.id)}
                        onCheckedChange={() => toggleArray("osobyKontaktoweIds", o.id, osobyKontaktoweIdsValue)}
                      />
                      <Label htmlFor={`osoba-${o.id}`} className="text-sm font-normal cursor-pointer">
                        {o.imie} {o.nazwisko}
                        {o.stanowisko && <span className="text-muted-foreground"> — {o.stanowisko}</span>}
                      </Label>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Usługi */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Usługi</h3>
              <div className="rounded-lg border border-border/60 p-4 space-y-2">
                {uslugi.length > 0 ? (
                  uslugi.map((u) => (
                    <div key={u.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`usluga-${u.id}`}
                        checked={uslugaIdsValue.includes(u.id)}
                        onCheckedChange={() => toggleArray("uslugaIds", u.id, uslugaIdsValue)}
                      />
                      <Label htmlFor={`usluga-${u.id}`} className="text-sm font-normal cursor-pointer">
                        {u.nazwa}
                        <span className="text-muted-foreground ml-1.5 text-xs">
                          ({TYP_USLUGI_LABELS[u.typ]})
                        </span>
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Brak usług dla spółki</p>
                )}
              </div>
            </section>

            {/* Wykonawcy */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Zespół (wykonawcy)</h3>
              <div className="rounded-lg border border-border/60 p-4 space-y-2">
                {wykonawcy.length > 0 ? (
                  wykonawcy.map((w) => (
                    <div key={w.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`wykonawca-${w.id}`}
                        checked={wykonawcaIdsValue.includes(w.id)}
                        onCheckedChange={() => toggleArray("wykonawcaIds", w.id, wykonawcaIdsValue)}
                      />
                      <Label htmlFor={`wykonawca-${w.id}`} className="text-sm font-normal cursor-pointer">
                        {w.imie} {w.nazwisko}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Brak wykonawców dla spółki</p>
                )}
              </div>
            </section>

            {/* Daty */}
            <div className="grid grid-cols-2 gap-4">
              <FloatingInput
                label="Data rozpoczęcia"
                type="date"
                {...register("dataOd")}
                state={errors.dataOd ? "error" : "default"}
                hint={errors.dataOd?.message}
              />
              <FloatingInput
                label={charakter === "jednorazowy" ? "Data zakończenia" : "Data zakończenia (opcjonalne)"}
                type="date"
                {...register("dataDo")}
              />
            </div>
            {charakter === "staly" && (
              <p className="text-xs text-muted-foreground -mt-4">
                Dla projektu stałego data zakończenia uzupełniana gdy współpraca się kończy.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
            <Button type="button" variant="ghost" onClick={handleClose}>Anuluj</Button>
            <Button type="submit" size="lg">Utwórz projekt</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
