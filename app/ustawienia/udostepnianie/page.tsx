"use client";

import { useState } from "react";
import { PageHeader } from "@/features/shared/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useActiveSystem } from "@/features/shared/context/active-system-context";
import { SPOLKA_CONFIG } from "@/features/shared/model/spolki.types";

const POLA_DO_UDOSTEPNIENIA = [
  { id: "opiekun", label: "Opiekun klienta" },
  { id: "nazwa_projektu", label: "Nazwa projektu" },
  { id: "status_projektu", label: "Status projektu" },
  { id: "zakres", label: "Zakres usługi" },
  { id: "kontakt_opiekun", label: "Kontakt do opiekuna" },
];

export default function UstawieniaUdostepnianiaPage() {
  const { activeSystem } = useActiveSystem();
  const config = SPOLKA_CONFIG[activeSystem];
  const [trybOtwarty, setTrybOtwarty] = useState(true);
  const [selectedPola, setSelectedPola] = useState<string[]>(["opiekun", "nazwa_projektu", "status_projektu"]);

  const togglePole = (poleId: string) => {
    setSelectedPola((prev) =>
      prev.includes(poleId) ? prev.filter((p) => p !== poleId) : [...prev, poleId]
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ustawienia udostępniania"
        description={`Polityka udostępniania danych ${config.name} do grupy WiseGroup`}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tryb udostępniania</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">
                {trybOtwarty ? "Otwarty" : "Zamknięty"}
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                {trybOtwarty
                  ? "Wybrane pola udostępniane automatycznie przy każdym matchu"
                  : "Dane udostępniane ręcznie per klient"}
              </p>
            </div>
            <Switch checked={trybOtwarty} onCheckedChange={setTrybOtwarty} />
          </div>
        </CardContent>
      </Card>

      {trybOtwarty && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pola do udostępnienia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Zaznacz które informacje o Twoich klientach druga spółka zobaczy przy matchu.
            </p>
            <div className="space-y-3">
              {POLA_DO_UDOSTEPNIENIA.map((pole) => (
                <div key={pole.id} className="flex items-center gap-3">
                  <Checkbox
                    id={pole.id}
                    checked={selectedPola.includes(pole.id)}
                    onCheckedChange={() => togglePole(pole.id)}
                  />
                  <Label htmlFor={pole.id} className="text-sm">{pole.label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <OptOutCard />
    </div>
  );
}

function OptOutCard() {
  const [wyjatki, setWyjatki] = useState<string[]>([]);
  const [nipInput, setNipInput] = useState("");

  const handleDodaj = () => {
    const nip = nipInput.replace(/\D/g, "");
    if (nip.length !== 10) return;
    if (wyjatki.includes(nip)) return;
    setWyjatki((prev) => [...prev, nip]);
    setNipInput("");
  };

  const handleUsun = (nip: string) => {
    setWyjatki((prev) => prev.filter((w) => w !== nip));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Wyjątki (opt-out)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Firmy na tej liście nie będą udostępniać szczegółów niezależnie od trybu.
        </p>
        <div className="flex gap-2">
          <input
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="NIP firmy (10 cyfr)"
            value={nipInput}
            onChange={(e) => setNipInput(e.target.value)}
            maxLength={10}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleDodaj}
            disabled={nipInput.replace(/\D/g, "").length !== 10}
          >
            Dodaj
          </Button>
        </div>
        {wyjatki.length > 0 ? (
          <div className="space-y-1">
            {wyjatki.map((nip) => (
              <div key={nip} className="flex items-center justify-between rounded-md border px-3 py-2">
                <span className="text-sm font-mono">{nip}</span>
                <button
                  onClick={() => handleUsun(nip)}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Usuń
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">Brak wyjątków</p>
        )}
      </CardContent>
    </Card>
  );
}
