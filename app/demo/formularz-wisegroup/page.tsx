"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/features/shared/components/page-header";
import { StatusBadge } from "@/features/shared/components/status-badge";
import { SpolkaBadge } from "@/components/layout/spolka-badge";
import { CheckCircle2Icon, ZapIcon, AlertCircleIcon, GlobeIcon } from "lucide-react";
import { mockZgloszenia } from "@/features/zgloszenia/model/zgloszenia.mock";

const GUS_MOCK: Record<string, { nip: string; nazwa: string; branza: string }> = {
  "techventure.pl": { nip: "1234567890", nazwa: "TechVenture Sp. z o.o.", branza: "IT / Software" },
  "probuild.pl": { nip: "9876543210", nazwa: "ProBuild S.A.", branza: "Budownictwo" },
  "datastream.io": { nip: "3322114455", nazwa: "DataStream Sp. z o.o.", branza: "Data / Analytics" },
};

interface FormResult {
  gus: { found: boolean; data?: typeof GUS_MOCK[string] };
  crossSell: { found: boolean; spolki: string[] };
  numer: string;
}

export default function FormularzWiseGroupPage() {
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [wiadomosc, setWiadomosc] = useState("");
  const [result, setResult] = useState<FormResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const domain = email.split("@")[1] ?? "";
    const gusData = GUS_MOCK[domain];
    const isPublicDomain = ["gmail.com", "outlook.com", "yahoo.com", "wp.pl"].includes(domain);

    let crossSellSpolki: string[] = [];
    if (gusData) {
      const matches = mockZgloszenia.filter((z) => z.nip === gusData.nip);
      crossSellSpolki = [...new Set(matches.map((z) => z.spolka).filter(Boolean))] as string[];
    }

    setResult({
      gus: { found: !isPublicDomain && !!gusData, data: gusData },
      crossSell: { found: crossSellSpolki.length > 0, spolki: crossSellSpolki },
      numer: `ZGL-WG-${String(Date.now()).slice(-4)}`,
    });
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Symulator — Formularz WiseGroup"
        description="Symuluje formularz kontaktowy na stronie grupy wisegroup.pl. Lead nie wie do której spółki trafia — zgłoszenie wymaga przypisania przez WiseGroup Hub."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <GlobeIcon className="size-4 text-muted-foreground" />
              wisegroup.pl — formularz kontaktowy
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2Icon className="size-5" />
                  <span className="font-medium">Wiadomość wysłana!</span>
                </div>
                <p className="text-sm text-muted-foreground">Numer: <span className="font-mono font-medium text-foreground">{result.numer}</span></p>
                <div className="rounded-lg border border-blue-200/70 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20 p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Zgłoszenie trafi do weryfikacji przez handlowca <strong>WiseGroup Hub</strong>, który przypisze je do właściwej spółki.
                  </p>
                </div>
                <Button variant="outline" onClick={() => setResult(null)} className="w-full">
                  Wyślij kolejne
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="telefon" value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="Twój numer telefonu" />
                <div>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Twój adres e-mail" required />
                  <p className="mt-1.5 text-xs text-muted-foreground">Wpisz np. <code>anna@techventure.pl</code> aby zobaczyć auto-wyszukiwanie GUS</p>
                </div>
                <Textarea id="wiadomosc" value={wiadomosc} onChange={(e) => setWiadomosc(e.target.value)} placeholder="Twoja Wiadomość" rows={4} />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Wysyłanie..." : "Wyślij wiadomość"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {result ? (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ZapIcon className="size-4 text-primary" />
                    Auto-lookup GUS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.gus.found && result.gus.data ? (
                    <div className="space-y-2">
                      <StatusBadge label="Znaleziono" variant="success" />
                      <div className="rounded-lg border bg-muted/30 p-3 space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Firma:</span> <strong>{result.gus.data.nazwa}</strong></p>
                        <p><span className="text-muted-foreground">NIP:</span> <span className="font-mono">{result.gus.data.nip}</span></p>
                        <p><span className="text-muted-foreground">Branża:</span> {result.gus.data.branza}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <StatusBadge label="Brak danych" variant="muted" />
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <AlertCircleIcon className="size-4 mt-0.5 shrink-0" />
                        <p>Domena publiczna lub nierozpoznana — WiseGroup Hub uzupełni dane ręcznie.</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <ZapIcon className="size-4 text-primary" />
                    Cross-sell check
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result.crossSell.found ? (
                    <div className="space-y-2">
                      <StatusBadge label="Podmiot znany" variant="warning" />
                      <p className="text-sm text-muted-foreground">Aktywne zgłoszenia w:</p>
                      <div className="flex gap-2 flex-wrap">
                        {result.crossSell.spolki.map((s) => <SpolkaBadge key={s} spolka={s} />)}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <StatusBadge label="Nowy podmiot" variant="success" />
                      <p className="text-xs text-muted-foreground">Podmiot nieznany w systemie.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-dashed">
                <CardContent className="pt-4">
                  <p className="text-xs text-muted-foreground">
                    Zgłoszenie trafiło do systemu ze źródłem <strong>formularz_wisegroup</strong> bez przypisanej spółki. Czeka na weryfikację WiseGroup Hub.
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <ZapIcon className="mx-auto size-8 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">Wynik pojawi się po wysłaniu formularza</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
