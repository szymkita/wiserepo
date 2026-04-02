# Demo Starter

Repo startowe do szybkiego tworzenia dem i prototypow w Next.js.

Glowny cel: budowac wysokiej jakosci frontendowe demo szybko, na mockowanych danych i z dobra struktura, tak aby pozniej latwo podmienic warstwe danych na prawdziwe API/backend.

## Do czego sluzy to repo

- Szybkie prototypowanie i przygotowanie flow demo (bez zaleznosci od backendu).
- Eksploracja UI/UX na czystej, skalowalnej strukturze komponentow.
- Tworzenie funkcji, ktore latwo pokazac, iterowac i potem przeniesc do wersji produkcyjnej.

## Stack technologiczny

- Next.js (App Router) + React + TypeScript
- Tailwind CSS + shadcn/ui
- Zod + react-hook-form (walidacja i typowane formularze)
- Bun jako domyslny runtime/package manager

## Szybki start

```bash
bun install
bun dev
```

Aplikacja uruchomi sie pod `http://localhost:3000`.

## Rekomendowany sposob pracy

1. Buduj tylko zakres, o ktory prosil uzytkownik.
2. Trzymaj dane w mockach i izoluj je tak, by latwo je podmienic.
3. Utrzymuj pelne type safety.
4. Sprawdzaj responsywnosc: telefon/tablet/desktop/szeroki ekran.
5. Dbaj o prosty, estetyczny i "produkcyjny" wyglad UI.

## Zainstalowane skille

Skille sa zainstalowane lokalnie w repo w katalogu `.agents/skills`.

### 1) `vercel-react-best-practices`

- Zrodlo: `vercel-labs/agent-skills`
- Cel: dobre praktyki wydajnosciowe i architektoniczne dla React/Next.

### 2) `web-design-guidelines`

- Zrodlo: `vercel-labs/agent-skills`
- Cel: przeglad UI pod katem nowoczesnych zasad web interface.

### 3) `demo-frontend-only` (custom)

- Lokalny skill przygotowany specjalnie pod to repo.
- Wymusza podejscie frontend-only na etapie demo/analizy.
- Wymaga: mock-first architecture, strict types, walidacji Zod, react-hook-form, modularnych komponentow i responsywnego UI na Tailwind/shadcn.

## Jak uzywac skilli w praktyce

- Trzymaj pliki skilli w repo, zeby kazdy agent/pracujaca osoba miala te same zasady.
- Przed implementacja funkcji najpierw stosuj zasady z `demo-frontend-only`.
- Uzywaj `vercel-react-best-practices` przy refaktorach i optymalizacjach.
- Uzywaj `web-design-guidelines` do review jakosci UI/UX i accessibility.

## Struktura projektu (high level)

```text
app/
components/ui/
features/
lib/
hooks/
.agents/skills/
```

## Uwagi

- Repo jest przeznaczone glownie do etapu demo, nie do integracji backendowej.
- Jesli potrzebny jest backend, traktuj to jako osobny etap z wyrazna decyzja uzytkownika.
