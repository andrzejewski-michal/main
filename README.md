# Alert App - Aplikacja do zapamiętywania imion

Aplikacja React + TypeScript + Vite do zapamiętywania i zbierania imion.

## Instalacja lokalnie

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment na Heroku

### Wymagania:
- Konto na [Heroku](https://www.heroku.com)
- Zainstalowany [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

### Kroki deploymentu:

1. Zaloguj się do Heroku:
```bash
heroku login
```

2. Stwórz nową aplikację na Heroku:
```bash
heroku create nazwa-twojej-aplikacji
```

3. Wyślij kod do Heroku:
```bash
git push heroku main
```
(Jeśli używasz innej nazwy brancha niż `main`, zamień `main` na nazwę swojego brancha)

4. Otwórz aplikację:
```bash
heroku open
```

### Zmienne środowiskowe (jeśli będą potrzebne):
```bash
heroku config:set NAZWA_ZMIENNEJ=wartość
```

### Podgląd logów:
```bash
heroku logs --tail
```

## Struktura projektu

```
src/
├── components/      # Komponenty React
├── data/           # Dane statyczne
├── hooks/          # Custom hooks
├── assets/         # Assets (CSS, obrazy)
└── App.tsx         # Główny komponent
```

## Pliki konfiguracyjne do Heroku:

- `Procfile` - Instrukcje uruchomienia aplikacji
- `.nvmrc` - Wersja Node.js
- `server.js` - Serwer Express do serwowania aplikacji

## Technologie

- React 19
- TypeScript
- Vite
- TailwindCSS
- Framer Motion

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
