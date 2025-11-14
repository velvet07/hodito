# Kód refaktorálás és optimalizálás terv

## Jelenlegi helyzet elemzése

### Fő problémák:
1. **Számítási logikák szétszórva**: A számítások közvetlenül a DOM manipulációval keverednek
2. **Nincs moduláris struktúra**: Minden egy nagy fájlban, nehéz karbantartani
3. **Forráskód nem védett**: Könnyen olvasható, nincs minifikáció/obfuszkáció
4. **Régi függőségek**: jQuery 1.3.2 (2009-es verzió), modern alternatívák hiánya
5. **Inline event handlerek**: onKeyUp, onChange közvetlenül a HTML-ben
6. **Ismétlődő kód**: Hasonló számítások többször megjelennek
7. **Nincs build rendszer**: Nincs minifikáció, bundling, tree-shaking

## Javasolt megoldás

### 1. Moduláris struktúra létrehozása

**Új fájlstruktúra:**
```
app/
├── src/
│   ├── calculations/          # Számítási logikák (védett)
│   │   ├── building-calculator.js
│   │   ├── war-calculator.js
│   │   └── constants.js       # Konstansok (fajok, bónuszok, stb.)
│   ├── utils/                 # Segédfüggvények
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── parsers.js
│   ├── ui/                    # UI kezelés
│   │   ├── building-ui.js
│   │   └── war-ui.js
│   └── main.js                # Fő belépési pont
├── dist/                      # Buildelt fájlok (védett)
│   ├── index.html
│   ├── war.html
│   ├── app.min.js            # Minifikált, obfuszkált JS
│   └── app.min.css
├── build/                     # Build scriptek
│   ├── webpack.config.js
│   └── obfuscator.config.js
└── package.json
```

### 2. Számítási logikák külön fájlokba szervezése

**calculations/building-calculator.js:**
- Népesség számítás
- Foglalkoztatottság számítás
- Termelés számítások
- Raktár kapacitás számítások
- Gabonaszükséglet számítás
- Érték számítás

**calculations/war-calculator.js:**
- Védőerő számítás
- Támadóerő számítás
- Gabonaszükséglet számítás
- Bónusz számítások

**calculations/constants.js:**
- Faji bónuszok
- Egység értékek
- Tábornok bónuszok
- Élőhalott szint bónuszok
- Tekercs maximum értékek

### 3. Forráskód védelem

**Stratégia:**
- **Webpack** bundling és minifikáció
- **javascript-obfuscator** kód obfuszkáció
- **Source maps** csak development módban
- **Code splitting** külön bundle-ök épületek/háború számításhoz

**Obfuscator beállítások:**
- String array encoding
- Control flow flattening
- Dead code injection
- Self-defending code

### 4. Teljesítmény optimalizálás

**Módosítások:**
- Debounce/throttle input mezőknél (nem minden billentyűnyomásra számol)
- Memoizáció számításoknál (cache-elés)
- Virtual DOM használata (opcionális, ha szükséges)
- Lazy loading moduloknál
- Event delegation (nem minden input-hoz külön listener)

### 5. Modern build rendszer

**Webpack konfiguráció:**
- ES6+ transpilálás (Babel)
- CSS minifikáció
- Asset optimization
- Development és production build
- Hot module replacement (HMR) fejlesztéshez

**NPM scriptek:**
- `npm run dev` - Development mód, source maps-sel
- `npm run build` - Production build, minifikált és obfuszkált
- `npm run build:analyze` - Bundle méret analízis

### 6. Kód tisztítás

**Refaktorálások:**
- jQuery eltávolítása (vanilla JS vagy modern framework)
- Inline event handlerek eltávolítása
- Ismétlődő kód kiemelése függvényekbe
- Konstansok kiemelése
- Error handling javítása
- TypeScript bevezetése (opcionális, de ajánlott)

### 7. Dokumentáció és konfiguráció

**Fájlok:**
- `README.md` - Build és fejlesztési útmutató
- `.gitignore` - dist/ és node_modules/ kizárása
- `package.json` - Függőségek és scriptek
- `tsconfig.json` - TypeScript konfiguráció (ha TS-t használunk)

## Implementációs lépések

### FÁZIS 0: Jelenlegi funkcionalitás tesztelése (KRITIKUS - ÁTALAKÍTÁS ELŐTT)

**Cél**: Biztosítani, hogy az átalakítás után minden működjön ugyanúgy.

#### 0.1 Épületlista számító tesztelés

**Alapadatok:**
- [ ] Hektár számítás helyes
- [ ] Szabad terület számítás helyes
- [ ] Százalékos megjelenítés helyes

**Lakóépületek:**
- [ ] Ház számítás és százalék
- [ ] Barakk számítás és százalék
- [ ] Kovácsműhely számítás és százalék
- [ ] Tanya számítás és százalék
- [ ] Könyvtár számítás és százalék
- [ ] Raktár számítás és százalék
- [ ] Őrtorony számítás és százalék
- [ ] Kocsma számítás és százalék
- [ ] Templom számítás és százalék
- [ ] Kórház számítás és százalék
- [ ] Piac számítás és százalék
- [ ] Bank számítás és százalék

**Bányák:**
- [ ] Bányák összesített számítás
- [ ] Fatelep számítás és százalék
- [ ] Kőbánya számítás és százalék
- [ ] Fémbánya számítás és százalék
- [ ] Agyagbánya számítás és százalék
- [ ] Drágakőbánya számítás és százalék

**Lelőhelyek:**
- [ ] Erdő számítás és százalék
- [ ] Kőlelőhely számítás és százalék
- [ ] Fémlelőhely számítás és százalék
- [ ] Agyaglelőhely számítás és százalék
- [ ] Drágakőlelőhely számítás és százalék

**Eredmények:**
- [ ] Népesség számítás helyes
- [ ] Foglalkoztatottság számítás helyes (bankkal és bank nélkül)
- [ ] Érték számítás helyes
- [ ] Férőhelyek számítás helyes (barakk, templom, kocsma, őrtorony)
- [ ] Raktárférőhelyek számítás helyes (gabona, agyag, fa, kő, fém, fegyver, drágakő)
- [ ] Termelés számítás helyes (gabona, agyag, fa, kő, fém, fegyver, drágakő)
- [ ] Bankadatok számítás helyes (ellopható pénz, kamat)
- [ ] Gabonaszükséglet számítás helyes

**Fajok:**
- [ ] None (nincs faj) - alapértelmezett értékek
- [ ] Elf - gabona +30%, nyersanyag -30%
- [ ] Ork - gabona +40%, nyersanyag alap
- [ ] Félelf - gabona -10%, lakáshelyzet +40%
- [ ] Törpe - fegyver x3, raktár x1.5, nyersanyag x3
- [ ] Gnóm - raktár x0.9, lakáshelyzet +50%, tudomány +50%
- [ ] Óriás - gabona +20%, lakáshelyzet +40%
- [ ] Élőhalott - szint alapján módosítók
- [ ] Ember - alapértelmezett

**Személyiségek:**
- [ ] Kereskedő hatása
- [ ] Tolvaj hatása
- [ ] Varázsló hatása
- [ ] Harcos hatása
- [ ] Tábornok hatása
- [ ] Vándor hatása
- [ ] Tudós hatása (tekercsek +5%)
- [ ] Gazdálkodó hatása (+10% termelés)
- [ ] Túlélő hatása

**Időszakok:**
- [ ] Bő termés (+20% gabona)
- [ ] Rágcsálók (-10% gabona)
- [ ] Nyersanyag+ (+20% nyersanyag)
- [ ] Nyersanyag- (-10% nyersanyag)
- [ ] Tudomány hónapja (tekercsek +5%)
- [ ] Zsugoráru (raktár x3)

**Tekercsek:**
- [ ] Mezőgazdaság tekercs számítás
- [ ] Lakáshelyzet tekercs számítás
- [ ] Bányászat tekercs számítás
- [ ] Skip tekercs funkció (max értékek automatikus beállítása)

**Beillesztés funkció:**
- [ ] Épületlista beillesztés és feldolgozás
- [ ] Formátum támogatás (kettőspont és tab elválasztás)
- [ ] Számok kinyerése (pontok, szóközök kezelése)

**Törlés funkció:**
- [ ] Minden mező nullázása
- [ ] Számítás újra fut

#### 0.2 Háború számító tesztelés

**Védőerő számítás:**
- [ ] Alapértékek helyesek (katona, védő, támadó, íjász, lovas, elit)
- [ ] Faji bónuszok helyesek (elf +30% védő, ork alap, stb.)
- [ ] Katonai morál hatása helyes
- [ ] Magányos farkas hatása (+40%)
- [ ] Védelem varázslat hatása (+30%)
- [ ] Kitámadási bónusz (ork, +20%)
- [ ] Élőhalott szint bónuszok helyesek
- [ ] Szabadságon lévő szövetségesek bónusz (+10% / szövetséges)
- [ ] Hadi tekercs hatása helyes
- [ ] Őrtorony íjász bónusz (elf: 8, más: 6)
- [ ] Őrtorony területarányos védőérték (max 30%)
- [ ] Minimális védőerő (hektár)

**Támadóerő számítás:**
- [ ] Alapértékek helyesek
- [ ] Faji bónuszok helyesek (ork +30% támadó)
- [ ] Katonai morál hatása helyes
- [ ] Magányos farkas hatása (+40%)
- [ ] Vérszomj varázslat hatása (+30%)
- [ ] Tábornok bónuszok helyesek (0-8 szint)
- [ ] Élőhalott szint bónuszok helyesek
- [ ] Hadi tekercs hatása helyes
- [ ] Felfele támadás bónusz (+10%)

**Gabonaszükséglet:**
- [ ] Védő gabonaszükséglet számítás
- [ ] Támadó gabonaszükséglet számítás (kör alapján)

**Import funkciók:**
- [ ] Kristálygömb importálás
- [ ] Épületlista importálás
- [ ] Automatikus mezők kitöltése
- [ ] Max értékek beállítása (lakáshelyzeti tekercs, hadi tekercs)

**Segítő funkciók:**
- [ ] "Mennyi íjász kell a védéshez" számítás
- [ ] "Mennyi lovas kell a beütéshez" számítás

**Eredmények megjelenítése:**
- [ ] Védőpont és támadópont helyes megjelenítés
- [ ] Színezés helyes (zöld/piros)
- [ ] Keretek helyesek (győztes/vesztes)
- [ ] Eredmény szöveg helyes

**Mezők aktiválása/deaktiválása:**
- [ ] Kitámadási bónusz csak ork esetén
- [ ] Élőhalott szint csak élőhalott esetén
- [ ] Szabadságon lévő szövetségesek csak ha nem magányos farkas
- [ ] Tábornok max értékek faj és személyiség alapján

**Tekercs maximum értékek:**
- [ ] Hadi tekercs max (gnóm: 50, más: 30, +tudós +5, +tudomány hónapja +5)
- [ ] Lakáshelyzeti tekercs max (gnóm: 50, óriás/félelf: 40, más: 30, +tudomány hónapja +5)

#### 0.3 Tesztelési esetek dokumentálása

**Tesztelési mátrix létrehozása:**
- [ ] Minden faj minden kombinációja
- [ ] Minden személyiség kombinációja
- [ ] Minden időszak kombinációja
- [ ] Edge case-ek (0 értékek, nagyon nagy értékek)
- [ ] Formátum variációk (pontok, szóközök, tabok)

**Teszt adatok rögzítése:**
- [ ] Ismert input → várt output párok
- [ ] Manuális számítások ellenőrzése
- [ ] Játékban tesztelt értékek dokumentálása

**Tesztelési dokumentum:**
- [ ] `docs/TESTING.md` fájl létrehozása
- [ ] Minden teszteset dokumentálása
- [ ] Várt eredmények rögzítése

### Fázis 1: Alapstruktúra (1-2 nap)
1. Új mappastruktúra létrehozása
2. Számítási logikák kiemelése külön fájlokba
3. Konstansok kiemelése
4. **TESZT**: Minden számítás ugyanazt adja, mint előtte

### Fázis 2: Build rendszer (1 nap)
1. Webpack konfiguráció
2. NPM scriptek beállítása
3. Obfuscator integráció
4. **TESZT**: Buildelt fájlok működnek ugyanúgy

### Fázis 3: Refaktorálás (2-3 nap)
1. jQuery eltávolítása
2. Event handler refaktorálás
3. UI logika szétválasztása
4. **TESZT**: Minden funkció működik, ugyanazokat az eredményeket adja

### Fázis 4: Optimalizálás (1-2 nap)
1. Debounce/throttle implementáció
2. Memoizáció hozzáadása
3. Performance tesztelés
4. **TESZT**: Funkcionalitás változatlan, de gyorsabb

### Fázis 5: Végleges tesztelés és dokumentáció (1 nap)
1. Teljes funkcionális tesztelés (Fázis 0 tesztesetek újrafuttatása)
2. Performance mérések
3. Dokumentáció frissítése
4. **TESZT**: Minden működik, dokumentáció teljes

## Előnyök

1. **Karbantarthatóság**: Moduláris struktúra, könnyű változtatni
2. **Teljesítmény**: Optimalizált kód, gyorsabb betöltés
3. **Biztonság**: Obfuszkált kód, nehezebb reverse engineering
4. **Fejlesztési élmény**: Modern tooling, hot reload
5. **Skálázhatóság**: Könnyű új funkciók hozzáadása

## Kockázatok és megoldások

**Kockázat**: A refaktorálás során funkcionalitás elveszhet
**Megoldás**: Részletes tesztelés, fokozatos migráció

**Kockázat**: Build rendszer komplexitása
**Megoldás**: Jó dokumentáció, egyszerű scriptek

## Alternatívák

**Opció A**: Minimális változtatás
- Csak számítási logikák kiemelése
- Nincs build rendszer
- Nincs obfuszkáció

**Opció B**: Teljes modernizálás (ajánlott)
- Teljes refaktorálás
- Modern build rendszer
- TypeScript bevezetése
- Framework használata (React/Vue)

**Opció C**: Középút
- Moduláris struktúra
- Build rendszer
- Obfuscator
- Vanilla JS (nincs framework)

---

**Létrehozva**: 2025-01-08
**Státusz**: Terv - Tesztelés fázis előtt
**Következő lépés**: Fázis 0 tesztelés végrehajtása

