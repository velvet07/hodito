# Hódító Calculator

Hódító.hu online stratégia játék számítási eszköze - Modern React + TypeScript implementáció

## Funkciók

- **Épületlista kalkulátor**: Népesség, foglalkoztatottság, termelés, raktár kapacitás számítások
- **Háború kalkulátor**: Védőerő és támadóerő számítások

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Webpack** - Build tool
- **Tailwind CSS** - Styling
- **JavaScript Obfuscator** - Code protection (production build)

## Fejlesztés

### Telepítés

```bash
npm install
```

### Development mód

```bash
npm run dev
```

A fejlesztői szerver a `http://localhost:3000` címen indul el.

### Production build

```bash
npm run build
```

A buildelt fájlok a `dist/` mappába kerülnek, minifikálva és obfuszkálva.

### Type checking

```bash
npm run type-check
```

## Projekt struktúra

```
src/
├── calculations/      # Számítási logikák (védett)
│   ├── building-calculator.ts
│   └── war-calculator.ts
├── components/        # React komponensek
│   ├── BuildingCalculator.tsx
│   └── WarCalculator.tsx
├── constants/         # Konstansok
│   └── constants.ts
├── types/            # TypeScript típusok
│   └── types.ts
├── utils/            # Segédfüggvények
│   ├── formatters.ts
│   └── parsers.ts
├── styles/           # CSS fájlok
│   └── main.css
├── templates/        # HTML template-ek
│   ├── index.html
│   └── war.html
├── main.tsx          # Fő belépési pont (épületlista)
└── war.tsx           # Háború kalkulátor belépési pont
```

## Build output

A production build tartalmazza:
- Minifikált JavaScript fájlok
- Obfuszkált kód (reverse engineering védelem)
- Optimalizált CSS
- Source maps (csak development módban)

## Licenc

Privát projekt - Minden jog fenntartva

