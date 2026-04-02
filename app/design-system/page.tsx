"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FloatingInput } from "@/components/ui/floating-input";
import { FloatingTextarea } from "@/components/ui/floating-textarea";
import { FloatingSelect } from "@/components/ui/floating-select";
import { FloatingDisplay } from "@/components/ui/floating-display";
import { DetailField, DetailGrid } from "@/features/shared/components/detail-field";
import type { FloatingFieldVariant, FloatingFieldState } from "@/components/ui/floating-field.types";
import {
  BellIcon,
  DownloadIcon,
  MailIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";

// ── Helpers ─────────────────────────────────────────────────────────────

type ComponentOrigin = "shadcn" | "custom" | "token";

const originConfig: Record<ComponentOrigin, { label: string; variant: "secondary" | "default" | "outline" }> = {
  shadcn: { label: "shadcn/ui", variant: "secondary" },
  custom: { label: "Custom", variant: "default" },
  token: { label: "Design Token", variant: "outline" },
};

function Section({
  title,
  description,
  origin,
  path,
  children,
}: {
  title: string;
  description?: string;
  origin?: ComponentOrigin;
  path?: string;
  children: React.ReactNode;
}) {
  const cfg = origin ? originConfig[origin] : null;

  return (
    <section className="space-y-6">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
          {cfg && <Badge variant={cfg.variant} className="text-[10px] uppercase tracking-widest">{cfg.label}</Badge>}
        </div>
        {path && (
          <p className="text-xs font-mono text-muted-foreground/50 mt-1">{path}</p>
        )}
        {description && (
          <p className="text-sm text-muted-foreground mt-2 max-w-3xl leading-relaxed">{description}</p>
        )}
      </div>
      <Separator />
      {children}
      <Separator className="mt-8" />
    </section>
  );
}

function SubSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
        {description && <p className="text-xs text-muted-foreground/70 mt-1 max-w-2xl leading-relaxed">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────

export default function DesignSystemPage() {
  const [switchOn, setSwitchOn] = useState(true);
  const [checkboxOn, setCheckboxOn] = useState<boolean | "indeterminate">(true);

  const variants: FloatingFieldVariant[] = ["outlined", "filled", "standard"];
  const states: FloatingFieldState[] = ["default", "error", "success", "warning"];

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <div className="mx-auto max-w-6xl px-8 py-12 space-y-16">

        {/* ── Header ───────────────────────────────────────────── */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="gradient-text">Design System</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Kompletny przegląd komponentów, kolorów i wzorców wizualnych stosowanych w aplikacji WiseGroup.
            System oparty na neutralnej palecie czerni i szarości — tworzy profesjonalne, niezakłócone tło
            dla treści biznesowych i przyszłych przestrzeni brandowych poszczególnych spółek.
          </p>
        </div>

        {/* ── 1. Typografia ──────────────────────────────────────── */}
        <Section
          title="Typografia"
          origin="token"
          path="app/layout.tsx · app/globals.css"
          description="Font Inter z aktywowanymi OpenType features cv02, cv03, cv04 — zmieniają kształt liter a, l, i na bardziej czytelne i charakterystyczne warianty. Hierarchia oparta na skali od 4xl (nagłówki stron) przez base (treść) do xs (meta-dane). Grubości: bold dla nagłówków, semibold dla podsekcji, regular dla treści. Tracking-tight na dużych rozmiarach zwiększa spójność optyczną."
        >
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Heading 1 — 4xl Bold</h1>
            <h2 className="text-3xl font-bold tracking-tight">Heading 2 — 3xl Bold</h2>
            <h3 className="text-2xl font-semibold">Heading 3 — 2xl Semibold</h3>
            <h4 className="text-xl font-semibold">Heading 4 — xl Semibold</h4>
            <p className="text-base text-foreground">Body — Tekst podstawowy, treść artykułów, opisy sekcji i zawartość kart.</p>
            <p className="text-sm text-muted-foreground">Small / Muted — Tekst pomocniczy, daty, opisy pól, informacje drugorzędne.</p>
            <p className="text-base">
              <span className="gradient-text font-semibold">Gradient Text</span>
              {" — "}tekst z gradientem czarny → szary, używany w nagłówkach wyróżnionych
            </p>
          </div>
        </Section>

        {/* ── 2. Kolory ──────────────────────────────────────────── */}
        <Section
          title="Kolory"
          origin="token"
          path="app/globals.css"
          description="Paleta oparta na neutralnych szarościach — od czerni (#0a0c10) po biel (#f9fafb). Świadomy wybór: czerń jako kolor wiodący nadaje aplikacji profesjonalny, poważny charakter i stanowi idealne płótno dla kolorów brandowych spółek. Kolory semantyczne (sukces, ostrzeżenie, błąd) pozostają niezależne od palety brandowej."
        >

          <SubSection
            title="Kolory systemowe — WiseGroup (część wspólna)"
            description="Bazowa paleta wspólnej przestrzeni. Primary to czerń (#111827) — buduje autorytet i kontrast. Kolory pomocnicze (secondary, accent, muted) to jasne szarości, które tworzą oddech i hierarchię."
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { name: "Primary", cls: "bg-primary", hex: "#111827" },
                { name: "Secondary", cls: "bg-secondary", hex: "#f3f4f6" },
                { name: "Accent", cls: "bg-accent", hex: "#f3f4f6" },
                { name: "Muted", cls: "bg-muted", hex: "#f3f4f6" },
                { name: "Destructive", cls: "bg-destructive", hex: "oklch" },
                { name: "Card", cls: "bg-card border", hex: "#ffffff" },
              ].map((c) => (
                <div key={c.name} className="space-y-1.5">
                  <div className={`h-16 rounded-lg ${c.cls}`} />
                  <p className="text-xs font-medium text-muted-foreground">{c.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground/50">{c.hex}</p>
                </div>
              ))}
            </div>
          </SubSection>

          <SubSection
            title="Skala szarości WiseGroup"
            description="11 kroków od najciemniejszego (950) po najjaśniejszy (50). Pozwala precyzyjnie budować głębię — ciemniejsze odcienie na nagłówki i akcenty, jaśniejsze na tła i obramowania. Klasy Tailwinda: bg-wg-900, text-wg-500 itp."
          >
            <div className="grid grid-cols-5 sm:grid-cols-11 gap-2">
              {[
                { name: "950", cls: "bg-wg-950" },
                { name: "900", cls: "bg-wg-900" },
                { name: "800", cls: "bg-wg-800" },
                { name: "700", cls: "bg-wg-700" },
                { name: "600", cls: "bg-wg-600" },
                { name: "500", cls: "bg-wg-500" },
                { name: "400", cls: "bg-wg-400" },
                { name: "300", cls: "bg-wg-300" },
                { name: "200", cls: "bg-wg-200" },
                { name: "100", cls: "bg-wg-100" },
                { name: "50", cls: "bg-wg-50" },
              ].map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className={`h-14 rounded-md ${c.cls} ${Number(c.name) < 300 ? "" : "border border-border/30"}`} />
                  <p className="text-[10px] font-mono text-muted-foreground/60 text-center">{c.name}</p>
                </div>
              ))}
            </div>
          </SubSection>

          <SubSection
            title="Gradienty — WiseGroup"
            description="Gradienty dodają głębię i ruch tam, gdzie płaski kolor nie wystarczy — nagłówki hero, tła kart, przyciski CTA. Oparte na czerni i szarościach, żeby nie konkurować z treścią."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Primary", cls: "gradient-primary", desc: "#111827 → #374151" },
                { name: "Primary Soft", cls: "gradient-primary-soft", desc: "#1f2937 → #4b5563" },
                { name: "Steel", cls: "gradient-steel", desc: "#374151 → #6b7280 → #9ca3af" },
                { name: "Ink", cls: "gradient-ink", desc: "#0a0c10 → #1f2937" },
                { name: "Surface", cls: "gradient-surface border", desc: "Subtelne tło z gradientem" },
                { name: "Glass", cls: "gradient-glass border", desc: "Efekt szkła z rozmyciem" },
              ].map((c) => (
                <div key={c.name} className="space-y-1.5">
                  <div className={`h-24 rounded-lg ${c.cls}`} />
                  <p className="text-xs font-medium text-muted-foreground">.{c.cls.replace(" border", "")}</p>
                  <p className="text-[10px] font-mono text-muted-foreground/50">{c.desc}</p>
                </div>
              ))}
            </div>
          </SubSection>

          <SubSection
            title="Kolory semantyczne"
            description="Niezależne od palety brandowej — zawsze oznaczają to samo. Zieleń = sukces, bursztyn = uwaga, czerwień = błąd/destrukcja. Czytelne na pierwszym spojrzeniu."
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: "Sukces", cls: "bg-emerald-500", hex: "#10b981" },
                { name: "Ostrzeżenie", cls: "bg-amber-500", hex: "#f59e0b" },
                { name: "Błąd", cls: "bg-destructive", hex: "destructive" },
                { name: "Informacja", cls: "bg-wg-900", hex: "#111827" },
              ].map((c) => (
                <div key={c.name} className="space-y-1.5">
                  <div className={`h-16 rounded-lg ${c.cls}`} />
                  <p className="text-xs font-medium text-muted-foreground">{c.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground/50">{c.hex}</p>
                </div>
              ))}
            </div>
          </SubSection>

          <SubSection
            title="Kolory brandowe spółek"
            description="Każda spółka ma swój wyróżniający kolor. Na tym etapie zdefiniowane są tylko kolory bazowe — pełne palety (odcienie, gradienty, stany komponentów) powstają w kolejnym kroku."
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { name: "SellWise", cls: "bg-spolka-sellwise", hex: "#265CE6" },
                { name: "AdWise", cls: "bg-spolka-adwise", hex: "#795BDA" },
                { name: "HireWise", cls: "bg-spolka-hirewise", hex: "#50A07B" },
                { name: "Finerto", cls: "bg-spolka-finerto", hex: "#c2955c" },
                { name: "Let's Automate", cls: "bg-spolka-letsautomate", hex: "#10b981" },
                { name: "WiseGroup", cls: "bg-spolka-wisegroup", hex: "#111827" },
              ].map((c: { name: string; cls: string; hex: string }) => (
                <div key={c.name} className="space-y-1.5">
                  <div className={`h-16 rounded-lg ${c.cls}`} />
                  <p className="text-xs font-medium text-muted-foreground">{c.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground/50">{c.hex}</p>
                </div>
              ))}
            </div>
            <InfoBox>
              Kolorystyka pełnych przestrzeni dla poszczególnych spółek (paleta odcieni, gradienty, stany
              komponentów, warianty przycisków) będzie opracowana w kolejnym etapie — oddzielnie dla każdej spółki.
            </InfoBox>
          </SubSection>
        </Section>

        {/* ── 3. Przyciski ───────────────────────────────────────── */}
        <Section
          title="Button"
          origin="shadcn"
          path="components/ui/button.tsx"
          description="Przyciski w stylu nowoczesnych aplikacji SaaS — gradient top-to-bottom nadaje im głębię i fizyczność, inner glow (inset shadow) symuluje krawędź łapiącą światło, a warstwowe cienie budują efekt uniesienia. Hover rozjaśnia gradient i powiększa cień (przycisk unosi się), active zmniejsza skalę (przycisk wciska się). Wszystko oparte na palecie WiseGroup — czerń i szarości."
        >
          <SubSection
            title="Warianty"
            description="Default — ciemny gradient z inner glow, główne CTA. Destructive — czerwony gradient, akcje nieodwracalne. Outline — obramowanie, akcje drugorzędne. Secondary — jasny gradient, uzupełnienie. Ghost — bez tła, minimalny ślad. Link — tekst z podkreśleniem."
          >
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="default">Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </SubSection>
          <SubSection
            title="Rozmiary"
            description="Trzy standardowe rozmiary: sm (32px), default (36px) i lg (40px). Wariant icon dla przycisków bez tekstu."
          >
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </SubSection>
          <SubSection
            title="Z ikonami"
            description="Ikony Lucide obok tekstu wzmacniają rozpoznawalność akcji. Samodzielne icon buttony w toolbarach i nagłówkach tabel. Ikony automatycznie dostosowują rozmiar do wariantu size."
          >
            <div className="flex flex-wrap items-center gap-3">
              <Button><PlusIcon /> Nowe</Button>
              <Button variant="outline"><DownloadIcon /> Eksport</Button>
              <Button variant="destructive"><TrashIcon /> Usuń</Button>
              <Button variant="ghost"><SearchIcon /> Szukaj</Button>
              <Button size="icon"><BellIcon /></Button>
              <Button size="icon" variant="outline"><MailIcon /></Button>
            </div>
          </SubSection>
          <SubSection
            title="Stany"
            description="Disabled obniża opacity do 50% i blokuje interakcję. Użytkownik rozpoznaje przycisk, ale wie, że jest nieaktywny."
          >
            <div className="flex flex-wrap items-center gap-3">
              <Button>Aktywny</Button>
              <Button disabled>Zablokowany</Button>
            </div>
          </SubSection>
          <InfoBox>
            Powyższe warianty obowiązują w przestrzeni wspólnej WiseGroup (gradient czarny + szarości).
            Warianty kolorystyczne przycisków dla poszczególnych spółek (np. gradient niebieski dla SellWise,
            fioletowy dla AdWise) zostaną zdefiniowane w kolejnym etapie — zgodnie z paletą brandową każdej spółki.
          </InfoBox>
        </Section>

        {/* ── 4. Badge ───────────────────────────────────────────── */}
        <Section
          title="Badge"
          origin="shadcn"
          path="components/ui/badge.tsx"
          description="Kompaktowe etykiety statusów i oznaczeń. Kolor natychmiast komunikuje znaczenie — zieleń (sukces), bursztyn (uwaga), czerwień (błąd/zamknięcie). Default i secondary do neutralnych oznaczeń, outline do subtelnych tagów."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
          </div>
        </Section>

        {/* ── 5. Input ───────────────────────────────────────────── */}
        <Section
          title="Input"
          origin="shadcn"
          path="components/ui/input.tsx"
          description="Bazowe pole tekstowe bez floating label. Stosowany tam, gdzie etykieta jest zbędna lub jest nad polem — wyszukiwarki, filtry, proste formularze. Subtelne obramowanie i cień nadają głębię bez dominowania."
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            <div className="space-y-2">
              <Label>Domyślny</Label>
              <Input placeholder="Wpisz tekst..." />
            </div>
            <div className="space-y-2">
              <Label>Zablokowany</Label>
              <Input placeholder="Disabled" disabled />
            </div>
            <div className="space-y-2">
              <Label>Tylko do odczytu</Label>
              <Input value="Tylko do odczytu" readOnly />
            </div>
          </div>
        </Section>

        {/* ── 6. Floating Input ──────────────────────────────────── */}
        <Section
          title="Floating Input"
          origin="custom"
          path="components/ui/floating-input.tsx"
          description="Pole tekstowe z unoszoną etykietą (floating label) — etykieta przesuwa się w górę po wpisaniu wartości, oszczędzając miejsce bez utraty kontekstu. 3 warianty wizualne inspirowane Flowbite: outlined (klasyczne obramowanie), filled (szare tło), standard (tylko dolna kreska). 4 stany walidacji z kolorowym obramowaniem i podpowiedzią."
        >
          {variants.map((variant) => (
            <SubSection key={variant} title={`Wariant: ${variant}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {states.map((state) => (
                  <FloatingInput
                    key={state}
                    label={state}
                    variant={variant}
                    state={state}
                    defaultValue={state === "default" ? "" : "Wartość"}
                    hint={state !== "default" ? `Podpowiedź dla stanu ${state}` : undefined}
                  />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <FloatingInput label="Zablokowany" variant={variant} defaultValue="Zablokowane" disabled />
                <FloatingInput label="Tylko odczyt" variant={variant} defaultValue="Tylko odczyt" readOnly />
                <FloatingInput label="Pusty (placeholder)" variant={variant} />
              </div>
            </SubSection>
          ))}
        </Section>

        {/* ── 6b. Outlined — stany interakcji ─────────────────────── */}
        <Section
          title="Outlined — stany interakcji"
          origin="custom"
          path="components/ui/floating-input.tsx"
          description="Przegląd stanów wizualnych wariantu outlined: default (do wypełnienia), hover (najedź myszką), read-only, success z podpowiedzią, error z podpowiedzią. Każdy stan ma wyraźne zróżnicowanie obramowania, cienia i koloru etykiety."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <FloatingInput label="Default" variant="outlined" />
            <FloatingInput label="Hover (najedź)" variant="outlined" defaultValue="Wartość" />
            <FloatingInput label="Read-only" variant="outlined" defaultValue="Tylko odczyt" readOnly />
            <FloatingInput label="Success" variant="outlined" state="success" defaultValue="Poprawne" hint="Dane zweryfikowane" />
            <FloatingInput label="Error" variant="outlined" state="error" defaultValue="Błędne" hint="Pole wymagane" />
          </div>
        </Section>

        {/* ── 7. Floating Textarea ───────────────────────────────── */}
        <Section
          title="Floating Textarea"
          origin="custom"
          path="components/ui/floating-textarea.tsx"
          description="Wieloliniowe pole z unoszoną etykietą. Te same 3 warianty i 4 stany walidacji co Floating Input — spójna stylistyka formularzy. Wysokość dostosowuje się do treści (resize-y), minimum 100px."
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {variants.map((variant) => (
              <SubSection key={variant} title={`Wariant: ${variant}`}>
                <div className="space-y-4">
                  <FloatingTextarea label="Opis" variant={variant} defaultValue="Przykładowy tekst w textarea z wieloma liniami..." />
                  <FloatingTextarea label="Z błędem" variant={variant} state="error" hint="Pole wymagane" defaultValue="Błąd" />
                  <FloatingTextarea label="Zablokowany" variant={variant} disabled defaultValue="Zablokowane" />
                </div>
              </SubSection>
            ))}
          </div>
        </Section>

        {/* ── 8. Floating Select ─────────────────────────────────── */}
        <Section
          title="Floating Select"
          origin="custom"
          path="components/ui/floating-select.tsx"
          description="Lista rozwijana z unoszoną etykietą. Wrapper na Radix UI Select — zachowuje dostępność (klawiatura, aria) i dodaje floating label z tymi samymi 3 wariantami i 4 stanami walidacji. Etykieta unosi się gdy wartość jest wybrana."
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {variants.map((variant) => (
              <SubSection key={variant} title={`Wariant: ${variant}`}>
                <div className="space-y-4">
                  <FloatingSelect label="Kategoria" variant={variant} value="a">
                    <SelectItem value="a">Opcja A</SelectItem>
                    <SelectItem value="b">Opcja B</SelectItem>
                    <SelectItem value="c">Opcja C</SelectItem>
                  </FloatingSelect>
                  <FloatingSelect label="Z błędem" variant={variant} state="error" hint="Wybierz wartość" value="">
                    <SelectItem value="x">Opcja X</SelectItem>
                  </FloatingSelect>
                  <FloatingSelect label="Sukces" variant={variant} state="success" value="ok">
                    <SelectItem value="ok">Poprawna wartość</SelectItem>
                  </FloatingSelect>
                  <FloatingSelect label="Zablokowany" variant={variant} disabled value="dis">
                    <SelectItem value="dis">Zablokowane</SelectItem>
                  </FloatingSelect>
                </div>
              </SubSection>
            ))}
          </div>
        </Section>

        {/* ── 9. Floating Display ────────────────────────────────── */}
        <Section
          title="Floating Display"
          origin="custom"
          path="components/ui/floating-display.tsx"
          description="Pole wyłącznie do odczytu z unoszoną etykietą — etykieta zawsze w pozycji uniesionej. Służy do prezentacji danych w sheetach i formularzach podglądu. 4 tryby wyświetlania wartości: domyślny (tekst), link (z lewą kreską primary), badge (przerywana ramka), mono (tabular-nums dla kwot i numerów)."
        >
          <SubSection title="Tryby wyświetlania">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <FloatingDisplay label="Domyślny">Jan Kowalski</FloatingDisplay>
              <FloatingDisplay label="Link" displayVariant="link">jan@example.com</FloatingDisplay>
              <FloatingDisplay label="Badge" displayVariant="badge">Aktywny</FloatingDisplay>
              <FloatingDisplay label="Kwota" displayVariant="mono">PLN 12 500,00</FloatingDisplay>
            </div>
          </SubSection>
          <SubSection title="Warianty i stany specjalne">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <FloatingDisplay label="Puste pole" empty>{null}</FloatingDisplay>
              <FloatingDisplay label="Wariant filled" variant="filled">Wartość</FloatingDisplay>
              <FloatingDisplay label="Wariant standard" variant="standard">Wartość</FloatingDisplay>
            </div>
          </SubSection>
        </Section>

        {/* ── 10. Detail Field ───────────────────────────────────── */}
        <Section
          title="Detail Field + Grid"
          origin="custom"
          path="features/shared/components/detail-field.tsx"
          description="Komponent do prezentacji danych w sheetach szczegółów. Semantyczny HTML (dl/dt/dd) dla dostępności. DetailGrid rozkłada pola w responsywną siatkę — 1 kolumna na mobile, zadana liczba na desktop. Warianty wyświetlania: domyślny, link, badge, mono."
        >
          <DetailGrid columns={3}>
            <DetailField label="Imię i nazwisko">Jan Kowalski</DetailField>
            <DetailField label="Email" variant="link">jan@firma.pl</DetailField>
            <DetailField label="Status" variant="badge">Aktywny</DetailField>
            <DetailField label="Kwota" variant="mono">PLN 15 000,00</DetailField>
            <DetailField label="Puste pole" empty>{null}</DetailField>
            <DetailField label="Telefon">+48 123 456 789</DetailField>
          </DetailGrid>
        </Section>

        {/* ── 11. Select ─────────────────────────────────────────── */}
        <Section
          title="Select"
          origin="shadcn"
          path="components/ui/select.tsx"
          description="Bazowa lista rozwijana z Radix UI — pełna dostępność (klawiatura, screen reader), portal rendering, animowana. Używana samodzielnie w prostszych formularzach lub wewnątrz FloatingSelect jako warstwa logiki."
        >
          <div className="max-w-xs">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz opcję..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">Opcja A</SelectItem>
                <SelectItem value="b">Opcja B</SelectItem>
                <SelectItem value="c">Opcja C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Section>

        {/* ── 12. Textarea ───────────────────────────────────────── */}
        <Section
          title="Textarea"
          origin="shadcn"
          path="components/ui/textarea.tsx"
          description="Bazowe wieloliniowe pole tekstowe bez floating label. Stosowany samodzielnie w prostych formularzach lub jako warstwa bazowa dla FloatingTextarea."
        >
          <div className="max-w-md">
            <Textarea placeholder="Wpisz dłuższy tekst..." />
          </div>
        </Section>

        {/* ── 13. Tabs ───────────────────────────────────────────── */}
        <Section
          title="Tabs"
          origin="shadcn"
          path="components/ui/tabs.tsx"
          description="Zakładki do organizacji treści w jednym widoku — użytkownik przełącza kontekst bez opuszczania strony. Wariant default z subtelnym tłem, pills z wyraźnym podświetleniem aktywnej zakładki."
        >
          <SubSection title="Default">
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">Ogólne</TabsTrigger>
                <TabsTrigger value="tab2">Szczegóły</TabsTrigger>
                <TabsTrigger value="tab3">Historia</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1"><p className="text-sm text-muted-foreground p-4">Treść zakładki Ogólne</p></TabsContent>
              <TabsContent value="tab2"><p className="text-sm text-muted-foreground p-4">Treść zakładki Szczegóły</p></TabsContent>
              <TabsContent value="tab3"><p className="text-sm text-muted-foreground p-4">Treść zakładki Historia</p></TabsContent>
            </Tabs>
          </SubSection>
          <SubSection title="Pills">
            <Tabs defaultValue="tab1">
              <TabsList variant="pills">
                <TabsTrigger value="tab1">Ogólne</TabsTrigger>
                <TabsTrigger value="tab2">Szczegóły</TabsTrigger>
                <TabsTrigger value="tab3">Historia</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1"><p className="text-sm text-muted-foreground p-4">Treść zakładki pills</p></TabsContent>
            </Tabs>
          </SubSection>
        </Section>

        {/* ── 14. Card ───────────────────────────────────────────── */}
        <Section
          title="Card"
          origin="shadcn"
          path="components/ui/card.tsx"
          description="Kontener grupujący powiązane informacje — nagłówek, treść, stopka z akcjami. Białe tło z subtelnym obramowaniem odcina kartę od strony, budując hierarchię wizualną. Stosowane do statystyk, formularzy, podglądów i dashboardów."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle>Tytuł karty</CardTitle>
                <CardDescription>Opis karty z dodatkowym kontekstem</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Treść karty — może zawierać dowolne elementy.</p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button size="sm">Zapisz</Button>
                <Button size="sm" variant="outline">Anuluj</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Karta statystyk</CardTitle>
                <CardDescription>Przykład z liczbami</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tabular-nums">128</p>
                <p className="text-xs text-muted-foreground">+12% do ostatniego miesiąca</p>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* ── 15. Table ──────────────────────────────────────────── */}
        <Section
          title="Table"
          origin="shadcn"
          path="components/ui/table.tsx"
          description="Tabela danych z nagłówkami i wierszami. Kolumny wyrównane kontekstowo — tekst do lewej, kwoty do prawej (tabular-nums dla wyrównania cyfr). Badge'e statusów wewnątrz komórek dla szybkiej orientacji."
        >
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nazwa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Spółka</TableHead>
                  <TableHead className="text-right">Kwota</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Projekt Alpha</TableCell>
                  <TableCell><Badge variant="success">Aktywny</Badge></TableCell>
                  <TableCell>SellWise</TableCell>
                  <TableCell className="text-right tabular-nums">PLN 45 000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Projekt Beta</TableCell>
                  <TableCell><Badge variant="warning">W trakcie</Badge></TableCell>
                  <TableCell>HireWise</TableCell>
                  <TableCell className="text-right tabular-nums">PLN 28 500</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Projekt Gamma</TableCell>
                  <TableCell><Badge variant="destructive">Zamknięty</Badge></TableCell>
                  <TableCell>AdWise</TableCell>
                  <TableCell className="text-right tabular-nums">PLN 12 000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
        </Section>

        {/* ── 16. Checkbox i Switch ──────────────────────────────── */}
        <Section
          title="Checkbox i Switch"
          origin="shadcn"
          path="components/ui/checkbox.tsx · switch.tsx"
          description="Pola wyboru i przełączniki oparte na Radix UI — pełna dostępność (klawiatura, aria, fokus). Checkbox dla opcji wielokrotnych (lista uprawnień, filtrów), switch dla przełączania stanów on/off (ustawienia, flagi)."
        >
          <div className="flex flex-wrap items-start gap-12">
            <SubSection title="Checkbox">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox id="c1" checked={checkboxOn} onCheckedChange={setCheckboxOn} />
                  <Label htmlFor="c1">Zaznaczony</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="c2" />
                  <Label htmlFor="c2">Odznaczony</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="c3" disabled checked />
                  <Label htmlFor="c3" className="text-muted-foreground">Zablokowany</Label>
                </div>
              </div>
            </SubSection>
            <SubSection title="Switch">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Switch id="s1" checked={switchOn} onCheckedChange={setSwitchOn} />
                  <Label htmlFor="s1">{switchOn ? "Włączony" : "Wyłączony"}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="s2" />
                  <Label htmlFor="s2">Domyślnie wyłączony</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="s3" disabled checked />
                  <Label htmlFor="s3" className="text-muted-foreground">Zablokowany</Label>
                </div>
              </div>
            </SubSection>
          </div>
        </Section>

        {/* ── 17. Separator ──────────────────────────────────────── */}
        <Section
          title="Separator"
          origin="shadcn"
          path="components/ui/separator.tsx"
          description="Wizualne oddzielenie sekcji i grup treści. Kolor border (#e5e7eb) — subtelny, nie dominuje. Dostępny w orientacji poziomej (między sekcjami) i pionowej (między elementami inline)."
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Poziomy</p>
            <Separator />
            <div className="flex items-center gap-4 h-8">
              <span className="text-sm">Element A</span>
              <Separator orientation="vertical" />
              <span className="text-sm">Element B</span>
              <Separator orientation="vertical" />
              <span className="text-sm">Element C</span>
            </div>
          </div>
        </Section>

        {/* ── 18. Skeleton ───────────────────────────────────────── */}
        <Section
          title="Skeleton"
          origin="shadcn"
          path="components/ui/skeleton.tsx"
          description="Placeholder ładowania — animowany puls odwzorowuje kształt oczekiwanej treści. Zmniejsza perceived loading time i zapobiega layout shift. Stosowany zamiast spinnera przy ładowaniu kart, list i profili."
        >
          <div className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </Section>

        {/* ── 19. Spinner ────────────────────────────────────────── */}
        <Section
          title="Spinner"
          origin="custom"
          path="components/ui/spinner.tsx"
          description="Obracająca się ikona ładowania — stosowany przy krótkich operacjach (zapis, wysyłka) gdzie skeleton byłby nadmiarowy. Rozmiar przez klasy size-*. Kolor dziedziczy z rodzica lub ustawiany bezpośrednio."
        >
          <div className="flex items-center gap-6">
            <Spinner className="size-4" />
            <Spinner className="size-6" />
            <Spinner className="size-8" />
            <Spinner className="size-10 text-primary" />
          </div>
        </Section>

      </div>
    </div>
  );
}
