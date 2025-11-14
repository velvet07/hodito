# Tesztelési dokumentum - Jelenlegi funkcionalitás

**Cél**: A jelenlegi számítási logikák és mechanikák teljes dokumentálása az átalakítás előtt.

**Dátum**: 2025-01-08
**Státusz**: Folyamatban

---

## 1. Épületlista kalkulátor tesztelés

### 1.1 Alapadatok

#### Hektár számítás
- **Mező**: `#hektar`
- **Számítás**: Összes épület összege
- **Teszt esetek**:
  - [ ] Üres lista → 0
  - [ ] 1 épület → helyes összeg
  - [ ] Több épület → helyes összeg
  - [ ] Szabad terület és Üres mezők is számítanak

#### Szabad terület számítás
- **Mező**: `#szabad_terulet` (disabled)
- **Számítás**: `hektar - (összes épület)`
- **Képlet**: `hektar - (haz + barakk + kovacsmuhely + tanya + konyvtar + raktar + banyak + ortorony + kocsma + templom + korhaz + piac + bank + erdo + kolelohely + femlelohely + agyaglelohely + dragakolelohely)`
- **Teszt esetek**:
  - [ ] Hektár = összes épület → 0
  - [ ] Hektár > összes épület → pozitív érték
  - [ ] Hektár < összes épület → negatív érték (hiba?)

#### Százalékos megjelenítés
- **Mezők**: `#epulet_sz` (minden épülethez)
- **Számítás**: `Math.round(epulet / hektar * 100) + "%"`
- **Teszt esetek**:
  - [ ] Hektár = 0 → NaN vagy 0%?
  - [ ] 1 épület, 100 hektár → 1%
  - [ ] 50 épület, 100 hektár → 50%
  - [ ] Kerekítés helyes (pl. 33.33% → 33%)

### 1.2 Lakóépületek

#### Ház
- **Mező**: `#haz`
- **Százalék**: `#haz_sz`
- **Számítás**: Népesség számításban használatos (50 lakos/ház)

#### Barakk
- **Mező**: `#barakk`
- **Százalék**: `#barakk_sz`
- **Férőhely**: `barakk * 40 * lakashelyzeti`
- **Számítás**: Foglalkoztatottságban: `barakk * 15`

#### Kovácsműhely
- **Mező**: `#kovacsmuhely`
- **Százalék**: `#kovacsmuhely_sz`
- **Termelés**: `kovacsmuhely * 3 * fegyvermodosito`
- **Törpe bónusz**: `fegyvermodosito = 3`

#### Tanya
- **Mező**: `#tanya`
- **Százalék**: `#tanya_sz`
- **Termelés**: `tanya * 50 * gabonamodosito * gabonamodosito2`

#### Könyvtár
- **Mező**: `#konyvtar`
- **Százalék**: `#konyvtar_sz`
- **Számítás**: Foglalkoztatottságban: `konyvtar * 15`

#### Raktár
- **Mező**: `#raktar`
- **Százalék**: `#raktar_sz`
- **Kapacitás**: 
  - Gabona: `raktar * 1000 * raktarmodosito`
  - Agyag/Fa/Kő/Fém/Drágakő: `raktar * 300 * raktarmodosito`
  - Fegyver: `raktar * 100 * raktarmodosito`
- **Törpe bónusz**: `raktarmodosito = 1.5`
- **Gnóm bónusz**: `raktarmodosito = 0.9`
- **Zsugoráru időszak**: `raktarmodosito *= 3`

#### Őrtorony
- **Mező**: `#ortorony`
- **Százalék**: `#ortorony_sz`
- **Férőhely**: `ortorony * 40 * lakashelyzeti`
- **Számítás**: Foglalkoztatottságban: `ortorony * 15`

#### Kocsma
- **Mező**: `#kocsma`
- **Százalék**: `#kocsma_sz`
- **Férőhely**: `kocsma * 40 * lakashelyzeti`
- **Számítás**: Foglalkoztatottságban: `kocsma * 15`

#### Templom
- **Mező**: `#templom`
- **Százalék**: `#templom_sz`
- **Férőhely**: `templom * 100 * lakashelyzeti`
- **Számítás**: Foglalkoztatottságban: `templom * 15`

#### Kórház
- **Mező**: `#korhaz`
- **Százalék**: `#korhaz_sz`
- **Számítás**: Foglalkoztatottságban: `korhaz * 15`

#### Piac
- **Mező**: `#piac`
- **Százalék**: `#piac_sz`
- **Számítás**: Foglalkoztatottságban: `piac * 50` (különbözik a többitől!)

#### Bank
- **Mező**: `#bank`
- **Százalék**: `#bank_sz`
- **Ellopható pénz**: `100 * 0.8^bank` (exponenciális csökkenés)
- **Kamat**: `bank * 150000 * 0.05`
- **Számítás**: Foglalkoztatottságban: `bank * 15`, de kivonható (`szukseges_lakos2`)

### 1.3 Bányák

#### Bányák összesített számítás
- **Mező**: `#banyak` (disabled)
- **Számítás**: `fatelep + kobanya + fembanya + agyagbanya + dragakobanya`
- **Automatikus frissítés**: Minden bánya változásakor

#### Fatelep
- **Mező**: `#fatelep`
- **Százalék**: `#fatelep_sz`
- **Termelés**: `fatelep * 7 * nyersanyagmodosito * nyersanyagmodosito2`

#### Kőbánya
- **Mező**: `#kobanya`
- **Százalék**: `#kobanya_sz`
- **Termelés**: `kobanya * 7 * nyersanyagmodosito * nyersanyagmodosito2`

#### Fémbánya
- **Mező**: `#fembanya`
- **Százalék**: `#fembanya_sz`
- **Termelés**: `fembanya * 7 * nyersanyagmodosito * nyersanyagmodosito2`

#### Agyagbánya
- **Mező**: `#agyagbanya`
- **Százalék**: `#agyagbanya_sz`
- **Termelés**: `agyagbanya * 7 * nyersanyagmodosito * nyersanyagmodosito2`

#### Drágakőbánya
- **Mező**: `#dragakobanya`
- **Százalék**: `#dragakobanya_sz`
- **Termelés**: `dragakobanya * 7 * nyersanyagmodosito * nyersanyagmodosito2`

### 1.4 Lelőhelyek

#### Erdő
- **Mező**: `#erdo`
- **Százalék**: `#erdo_sz`
- **Népesség**: `erdo * 8 * lakashelyzeti` (szabad területként számít)

#### Kőlelőhely
- **Mező**: `#kolelohely`
- **Százalék**: `#kolelohely_sz`
- **Népesség**: `kolelohely * 8 * lakashelyzeti`

#### Fémlelőhely
- **Mező**: `#femlelohely`
- **Százalék**: `#femlelohely_sz`
- **Népesség**: `femlelohely * 8 * lakashelyzeti`

#### Agyaglelőhely
- **Mező**: `#agyaglelohely`
- **Százalék**: `#agyaglelohely_sz`
- **Népesség**: `agyaglelohely * 8 * lakashelyzeti`

#### Drágakőlelőhely
- **Mező**: `#dragakolelohely`
- **Százalék**: `#dragakolelohely_sz`
- **Népesség**: `dragakolelohely * 8 * lakashelyzeti`

### 1.5 Eredmények számítások

#### Népesség
- **Mező**: `#nepesseg`
- **Képlet**: `haz * 50 * lakashelyzeti + (szabad_terulet + erdo + kolelohely + femlelohely + agyaglelohely + dragakolelohely) * 8 * lakashelyzeti`
- **Teszt esetek**:
  - [ ] 0 ház, 0 szabad terület → 0
  - [ ] 10 ház, lakáshelyzeti = 1.3 → 650
  - [ ] 100 szabad terület, lakáshelyzeti = 1.3 → 1040
  - [ ] Kombinált → helyes összeg

#### Foglalkoztatottság
- **Mező**: `#foglalkoztatottsag` (bankkal)
- **Mező**: `#foglalkoztatottsag2` (bank nélkül)
- **Képlet**: `Math.round(szukseges_lakos / nepesseg * 100)`
- **Szükséges lakosok**: 
  - Minden épület: `epulet * 15` (kivéve piac: `piac * 50`)
  - Bank nélkül: `szukseges_lakos - bank * 15`
- **Teszt esetek**:
  - [ ] Népesség > szükséges → < 100%
  - [ ] Népesség = szükséges → 100%
  - [ ] Népesség < szükséges → > 100%, piros színnel
  - [ ] Bank nélküli számítás helyes

#### Érték
- **Mező**: `#ertek`
- **Képlet**: `szabad_terulet * 30 + beepitett * 45 + nepesseg_ertek / 5`
- **Beépített**: `haz + barakk + kovacsmuhely + tanya + konyvtar + raktar + banyak + ortorony + kocsma + templom + korhaz + piac + bank`
- **Népesség érték**: `Math.min(nepesseg, hektar * 70)`
- **Teszt esetek**:
  - [ ] Alapértelmezett értékek → helyes számítás
  - [ ] Népesség > hektar * 70 → max népesség érték használata

#### Férőhelyek
- **Barakk**: `#barakkhely` = `Math.round(barakk * 40 * lakashelyzeti)`
- **Templom**: `#templomhely` = `Math.round(templom * 100 * lakashelyzeti)`
- **Kocsma**: `#kocsmahely` = `Math.round(kocsma * 40 * lakashelyzeti)`
- **Őrtorony**: `#ortoronyhely` = `Math.round(ortorony * 40 * lakashelyzeti)`
- **Barakk - Torony**: `#barakk_torony` = `Math.round(barakk * 40 * lakashelyzeti - ortorony * 40 * lakashelyzeti)`

#### Raktárférőhelyek
- **Gabona**: `#gabona` = `Math.round(raktar * 1000 * raktarmodosito)`
- **Agyag**: `#agyag` = `Math.round(raktar * 300 * raktarmodosito)`
- **Fa**: `#fa` = `Math.round(raktar * 300 * raktarmodosito)`
- **Kő**: `#ko` = `Math.round(raktar * 300 * raktarmodosito)`
- **Fém**: `#fem` = `Math.round(raktar * 300 * raktarmodosito)`
- **Fegyver**: `#fegyver` = `Math.round(raktar * 100 * raktarmodosito)`
- **Drágakő**: `#dragako` = `Math.round(raktar * 300 * raktarmodosito)`

#### Termelés
- **Gabona**: `#gabona_t` = `Math.round(tanya * 50 * gabonamodosito * gabonamodosito2)`
- **Agyag**: `#agyag_t` = `Math.round(agyagbanya * 7 * nyersanyagmodosito * nyersanyagmodosito2)`
- **Fa**: `#fa_t` = `Math.round(fatelep * 7 * nyersanyagmodosito * nyersanyagmodosito2)`
- **Kő**: `#ko_t` = `Math.round(kobanya * 7 * nyersanyagmodosito * nyersanyagmodosito2)`
- **Fém**: `#fem_t` = `Math.round(fembanya * 7 * nyersanyagmodosito * nyersanyagmodosito2)`
- **Fegyver**: `#fegyver_t` = `Math.round(kovacsmuhely * 3 * fegyvermodosito)`
- **Drágakő**: `#dragako_t` = `Math.round(dragakobanya * 7 * nyersanyagmodosito * nyersanyagmodosito2)`

#### Bankadatok
- **Ellopható pénz**: `#penz_lop` = `Math.round(100 * 0.8^bank * 10000) / 10000 + '%'`
- **Kamat**: `#kamat` = `Math.round(bank * 150000 * 0.05) + ' ehhez ' + (bank * 150000) + ' arany kell'`

#### Gabonaszükséglet
- **Teljes**: `#gabonaszukseglet`
- **Termelés**: `#gabonatermeles`
- **Épületek igénye**: `#fontos_epuletek` = `15 * (barakk + templom + kocsma + ortorony + raktar)`
- **Képlet (ork)**: `Math.round((barakk * 40 * lakashelyzeti * 0.7 + templom * 100 * lakashelyzeti * 0.7 + kocsma * 40 * lakashelyzeti * 0.7 + nepesseg) / 5) * lakashelyzeti2`
- **Képlet (más)**: `Math.round((barakk * 40 * lakashelyzeti + templom * 100 * lakashelyzeti + kocsma * 40 * lakashelyzeti + nepesseg) / 5) * lakashelyzeti2`
- **Bank nélkül**: `#gabonaszukseglet2` = `Math.round((templom * 100 * lakashelyzeti + kocsma * 40 * lakashelyzeti + nepesseg) / 5) * lakashelyzeti2`
- **Megjelenítés**: 
  - Pozitív különbség → zöld szín
  - Negatív különbség → piros szín + körre elegendő számítás

### 1.6 Fajok

#### None (nincs faj)
- **Lakáshelyzet max**: 30% (+5% tudomány hónapja esetén, max 55%)
- **Mezőgazdaság max**: 30% (+5% tudós, +5% tudomány hónapja, max 55%)
- **Bányászat max**: 30% (+5% tudós, +5% tudomány hónapja, max 55%)
- **Módosítók**: Alapértelmezett (1.0)

#### Elf
- **Gabona módosító**: `gabonamodosito2 = 1.3` (+30%)
- **Nyersanyag módosító**: `nyersanyagmodosito2 = 0.7` (-30%)
- **Lakáshelyzet max**: 30% (+5% tudomány hónapja esetén, max 55%)
- **Mezőgazdaság max**: 30% (+5% tudós, +5% tudomány hónapja, max 55%)
- **Bányászat max**: 30% (+5% tudós, +5% tudomány hónapja, max 55%)

#### Ork
- **Gabona módosító**: `gabonamodosito2 = 1.4` (+40%, tudós: 1.45)
- **Nyersanyag módosító**: `nyersanyagmodosito2 = 1.0` (alap)
- **Lakáshelyzet max**: 30% (+5% tudomány hónapja esetén, max 55%)
- **Mezőgazdaság max**: 40% (+5% tudós, +5% tudomány hónapja, max 55%)
- **Bányászat max**: 30% (+5% tudós, +5% tudomány hónapja, max 55%)
- **Gabonaszükséglet**: 0.7x szorzó barakk/templom/kocsma esetén

#### Félelf
- **Gabona módosító**: `gabonamodosito2 = 0.9` (-10%)
- **Lakáshelyzet max**: 40% (+5% tudomány hónapja esetén, max 55%)
- **Mezőgazdaság max**: 30% (+5% tudós, +5% tudomány hónapja, max 55%)
- **Bányászat max**: 30% (+5% tudós, +5% tudomány hónapja, max 55%)

#### Törpe
- **Fegyver módosító**: `fegyvermodosito = 3` (x3)
- **Raktár módosító**: `raktarmodosito = 1.5` (x1.5)
- **Nyersanyag módosító**: `nyersanyagmodosito2 = 3` (x3)
- **Lakáshelyzet**: `lakashelyzeti = (lakashelyzet / 100 + 1) * 1.2` (ha nem skip)
- **Lakáshelyzet max**: 30% (+5% tudomány hónapja esetén, max 55%)
- **Mezőgazdaság max**: 30% (+5% tudós, +5% tudomány hónapja, max 55%)
- **Bányászat max**: 30% (+5% tudós, +5% tudomány hónapja, max 55%)

#### Gnóm
- **Raktár módosító**: `raktarmodosito = 0.9` (x0.9)
- **Lakáshelyzet max**: 50% (+5% tudomány hónapja esetén, max 55%)
- **Mezőgazdaság max**: 50% (+5% tudós, +5% tudomány hónapja, max 55%)
- **Bányászat max**: 50% (+5% tudós, +5% tudomány hónapja, max 55%)

#### Óriás
- **Gabona módosító**: `gabonamodosito2 = 1.2` (+20%)
- **Lakáshelyzet max**: 40% (+5% tudomány hónapja esetén, max 55%)
- **Mezőgazdaság max**: 30% (+5% tudós, +5% tudomány hónapja, max 55%)
- **Bányászat max**: 30% (+5% tudós, +5% tudomány hónapja, max 55%)

#### Élőhalott
- **Lakáshelyzet módosító**: `lakashelyzeti2 = 0` (nincs népesség)
- **Lakáshelyzet**: Szint alapján:
  - Szint 5: `lakashelyzeti = 1.2`
  - Szint 4: `lakashelyzeti = 1.3`
  - Szint 3: `lakashelyzeti = 1.4`
  - Szint 2: `lakashelyzeti = 1.5`
  - Szint 1: `lakashelyzeti = 1.6`
- **Gabona módosító**: `gabonamodosito = 1` (nincs módosítás)
- **Nyersanyag módosító**: `nyersanyagmodosito = 1` (nincs módosítás)
- **Tekercsek**: Mind 0 (nem használható)

#### Ember
- **Lakáshelyzet max**: 30% (+5% tudomány hónapja esetén, max 55%)
- **Mezőgazdaság max**: 30% (+5% tudós, +5% tudomány hónapja, max 55%)
- **Bányászat max**: 30% (+5% tudós, +5% tudomány hónapja, max 55%)
- **Módosítók**: Alapértelmezett (1.0)

### 1.7 Személyiségek

#### Tudós
- **Hatás**: Tekercsek maximum értéke +5%
- **Mezőgazdaság**: 30% → 35% (max 55%)
- **Bányászat**: 30% → 35% (max 55%)
- **Hadi tekercs**: +5% (war.js-ben)

#### Gazdálkodó
- **Hatás**: `nyersanyagmodosito *= 1.1`, `gabonamodosito *= 1.1` (+10%)

#### További személyiségek
- **Kereskedő**: Nincs számítási hatás (jelenleg)
- **Tolvaj**: Nincs számítási hatás (jelenleg)
- **Varázsló**: Nincs számítási hatás (jelenleg)
- **Harcos**: Nincs számítási hatás (jelenleg)
- **Tábornok**: Csak háború kalkulátorban (war.js)
- **Vándor**: Nincs számítási hatás (jelenleg)
- **Túlélő**: Nincs számítási hatás (jelenleg)

### 1.8 Időszakok

#### Bő termés
- **Hatás**: `gabonamodosito2 *= 1.2` (+20% gabona termelés)

#### Rágcsálók
- **Hatás**: `gabonamodosito2 *= 0.9` (-10% gabona termelés)

#### Nyersanyag+
- **Hatás**: `nyersanyagmodosito2 *= 1.2` (+20% nyersanyag termelés)

#### Nyersanyag-
- **Hatás**: `nyersanyagmodosito2 *= 0.9` (-10% nyersanyag termelés)

#### Tudomány hónapja
- **Hatás**: Tekercsek maximum értéke +5% (max 55%)

#### Zsugoráru
- **Hatás**: `raktarmodosito *= 3` (raktár kapacitás x3)

### 1.9 Tekercsek

#### Mezőgazdaság tekercs
- **Mező**: `#mezogazdasag`
- **Max érték**: Faj és tudós alapján (lásd fajok)
- **Számítás**: `gabonamodosito = mezogazdasag / 100 + 1`
- **Skip tekercs**: Automatikusan max értékre állítja

#### Lakáshelyzet tekercs
- **Mező**: `#lakashelyzet`
- **Max érték**: Faj alapján (lásd fajok)
- **Számítás**: `lakashelyzeti = lakashelyzet / 100 + 1`
- **Skip tekercs**: Automatikusan max értékre állítja
- **Törpe különleges**: `lakashelyzeti = (lakashelyzet / 100 + 1) * 1.2`

#### Bányászat tekercs
- **Mező**: `#banyaszat`
- **Max érték**: Faj és tudós alapján (lásd fajok)
- **Számítás**: `nyersanyagmodosito = banyaszat / 100 + 1`
- **Skip tekercs**: Automatikusan max értékre állítja

### 1.10 Beillesztés funkció

#### Épületlista feldolgozás
- **Mező**: `#lista` (textarea)
- **Gomb**: `#button` (onClick="feldolgoz()")
- **Formátum támogatás**:
  - Kettőspont elválasztás: `Épület: szám`
  - Tab elválasztás: `Épület\tszám`
- **Szám kinyerés**: Pontok és szóközök eltávolítása
- **Feldolgozott épületek**: Minden épület típus (lásd 1.2-1.4)
- **Hektár számítás**: Összes épület összege
- **Bányák összesítés**: Automatikus számítás

### 1.11 Törlés funkció

#### Nullázás
- **Gomb**: `#delButt` (onClick="del()")
- **Funkció**: Minden mező 0-ra állítása
- **Kivételek**: Textarea mezők nem törlődnek

---

## 2. Háború kalkulátor tesztelés

### 2.1 Védőerő számítás

#### Alapértékek
- **Katona**: `katona * 1` (védő)
- **Védő**: `vedo * 4` (védő)
- **Támadó**: `tamado * 0` (védő)
- **Íjász**: `ijsz * 6` (védő)
- **Lovas**: `lovas * 2` (védő)
- **Elit**: `elit * 5` (védő)

#### Őrtorony íjász bónusz
- **Elf faj**: 8 pont/íjász (helyett 6)
- **Más fajok**: 6 pont/íjász
- **Számítás**: `Math.min(ijsz, ortorony * 100)` íjász kap bónuszt
- **Bónusz**: `ortoronyIjsz * (ortoronyBonus - 6)`

#### Szövetséges íjászok
- **Mező**: `#vedo_szovetseges_ijaszok`
- **Hozzáadás**: `szovetsegesIjsz * 6` (alapérték)

#### Minimális védőerő
- **Hektár**: `#vedo_hektar`
- **Szabály**: `alapVedoero = Math.max(alapVedoero, hektar)`

#### Faji bónuszok
- **Elf**: `vedoero *= 1.30` (+30% védő)
- **Ork**: `vedoero *= 1.0` (nincs változás)
- **Félelf**: `vedoero *= 1.10` (+10% védő)
- **Törpe**: `vedoero *= 1.0` (nincs változás)
- **Gnóm**: `vedoero *= 1.0` (nincs változás)
- **Óriás**: `vedoero *= 1.0` (nincs változás)
- **Élőhalott**: `vedoero *= 1.0` (nincs változás)
- **Ember**: `vedoero *= 1.0` (nincs változás)

#### Katonai morál
- **Mező**: `#vedo_katonai_moral` (alapértelmezett: 75)
- **Számítás**: `vedoero *= (moral / 100)`

#### Magányos farkas
- **Checkbox**: `#vedo_maganyos_farkas`
- **Hatás**: `vedoero *= 1.40` (+40%)

#### Védelem varázslat
- **Checkbox**: `#vedo_vedelem`
- **Hatás**: `vedoero *= 1.30` (+30%)

#### Kitámadási bónusz
- **Checkbox**: `#vedo_kitamadasi_bonusz`
- **Feltétel**: Csak ork faj esetén aktív
- **Hatás**: `vedoero *= 1.20` (+20%)

#### Élőhalott szint
- **Mező**: `#vedo_elohalott_szint` (0-5)
- **Feltétel**: Csak élőhalott faj esetén aktív
- **Bónuszok**:
  - Szint 0: 0%
  - Szint 1: +40%
  - Szint 2: +30%
  - Szint 3: +20%
  - Szint 4: +10%
  - Szint 5: 0%

#### Szabadságon lévő szövetségesek
- **Mező**: `#vedo_szabadsagon_szovetsegesek` (0-3)
- **Feltétel**: Csak ha NEM magányos farkas
- **Hatás**: `vedoero *= (1 + szabadsagon * 0.10)` (+10% / szövetséges)

#### Hadi tekercs
- **Mező**: `#vedo_tudos_szazalek`
- **Hatás**: `vedoero *= (1 + tudosSzazalek / 100)`

#### Őrtorony területarányos védőérték
- **Számítás**: `(ortorony / hektar) * 100 * 2` (max 30%)
- **Hatás**: `vedoero *= (1 + ortoronyVedoBonus)`

### 2.2 Támadóerő számítás

#### Alapértékek
- **Katona**: `katona * 1` (támadó)
- **Támadó**: `tamado * 4` (támadó)
- **Íjász**: `ijsz * 2` (támadó)
- **Lovas**: `lovas * 6` (támadó)
- **Elit**: `elit * 5` (támadó)

#### Faji bónuszok
- **Elf**: `tamadoero *= 1.0` (nincs változás)
- **Ork**: `tamadoero *= 1.30` (+30% támadó)
- **Félelf**: `tamadoero *= 0.90` (-10% támadó)
- **Törpe**: `tamadoero *= 1.0` (nincs változás)
- **Gnóm**: `tamadoero *= 1.0` (nincs változás)
- **Óriás**: `tamadoero *= 1.0` (nincs változás)
- **Élőhalott**: `tamadoero *= 1.0` (nincs változás)
- **Ember**: `tamadoero *= 1.0` (nincs változás)

#### Katonai morál
- **Mező**: `#tamado_katonai_moral` (alapértelmezett: 75)
- **Számítás**: `tamadoero *= (moral / 100)`

#### Magányos farkas
- **Checkbox**: `#tamado_maganyos_farkas`
- **Hatás**: `tamadoero *= 1.40` (+40%)

#### Vérszomj varázslat
- **Checkbox**: `#tamado_verszomj`
- **Hatás**: `tamadoero *= 1.30` (+30%)

#### Tábornok bónusz
- **Mező**: `#tamado_tabornok` (0-8)
- **Bónuszok**:
  - 0: 0%
  - 1: 0%
  - 2: +3%
  - 3: +5%
  - 4: +6%
  - 5: +7%
  - 6: +8%
  - 7: +10%
  - 8: +20%
- **Max érték**: Faj és Tábornok személyiség alapján változik

#### Élőhalott szint
- **Mező**: `#tamado_elohalott_szint` (0-5)
- **Feltétel**: Csak élőhalott faj esetén aktív
- **Bónuszok**: Ugyanazok, mint védőnél

#### Hadi tekercs
- **Mező**: `#tamado_tudos_szazalek`
- **Hatás**: `tamadoero *= (1 + tudosSzazalek / 100)`

#### Felfele támadás bónusz
- **Radio**: `#tamado_felfele` (checked by default)
- **Hatás**: `tamadoero *= 1.10` (+10%)

### 2.3 Gabonaszükséglet

#### Védő gabonaszükséglet
- **Képlet**: `(katona + tamado + ijsz + lovas + elit) * 1` (1 bála/kör)

#### Támadó gabonaszükséglet
- **Mező**: `#tamado_kor` (alapértelmezett: 2)
- **Képlet**: `(katona + tamado + ijsz + lovas + elit) * kor`

### 2.4 Import funkciók

#### Kristálygömb importálás
- **Mező**: `#vedo_kristalygomb` vagy `#tamado_kristalygomb`
- **Funkció**: `importKristalygomb(tipus)`
- **Feldolgozott adatok**:
  - Föld (Hektár)
  - Katona, Védő, Támadó, Íjász, Lovas, Elit
  - Katonai morál
  - Szövetség (magányos farkas ellenőrzés)
  - Faj
  - Személyiség (Tudós ellenőrzés)
- **Automatikus beállítások**:
  - Hadi tekercs max érték
  - Lakáshelyzeti tekercs max érték (védőnél)
  - Tábornok max érték (támadónál)

#### Épületlista importálás
- **Mező**: `#vedo_epuletlista` vagy `#tamado_epuletlista`
- **Funkció**: `importEpuletlista(tipus)`
- **Feldolgozás**:
  - Ha van kristálygömb: csak Őrtorony kinyerése (védőnél)
  - Ha nincs kristálygömb: összes épület összeadása hektárhoz
  - Barakkok számának mentése
  - Max férőhely számítás (íjász/lovas)

### 2.5 Segítő funkciók

#### Mennyi íjász kell a védéshez
- **Funkció**: `szamolIjaszVedohoz()`
- **Algoritmus**: Bináris keresés
- **Cél**: Védőerő >= Támadóerő
- **Max iteráció**: 60
- **Max egység**: 2,000,000

#### Mennyi lovas kell a beütéshez
- **Funkció**: `szamolLovasTamadashoz()`
- **Algoritmus**: Bináris keresés
- **Cél**: Támadóerő >= Védőerő
- **Logika**: Ha nincs más egység → Elit, egyébként → Lovas

### 2.6 Eredmények megjelenítése

#### Védőpont és támadópont
- **Mezők**: `#vedopont`, `#tamadopont`
- **Számítás**: `szamolVedoero()`, `szamolTamadoero()`
- **Formázás**: `formatNumber()` (pontok elválasztó)

#### Színezés
- **Zöld**: Győztes oldal
- **Piros**: Vesztes oldal
- **Feltétel**: Csak akkor színez, ha mindkét érték > 0

#### Keretek
- **Zöld keret**: Győztes oszlop
- **Piros keret**: Vesztes oszlop
- **Feltétel**: Csak akkor jelenik meg, ha legalább egy érték > 0

#### Eredmény szöveg
- **Mező**: `#eredmeny`
- **Szöveg**: "A támadás sikertelen" vagy "A támadás sikeres"

### 2.7 Mezők aktiválása/deaktiválása

#### Kitámadási bónusz
- **Aktív**: Csak ork faj esetén
- **Deaktiválva**: Más fajoknál (disabled + bg-gray-100)

#### Élőhalott szint
- **Aktív**: Csak élőhalott faj esetén
- **Deaktiválva**: Más fajoknál (disabled + bg-gray-100, érték alapértékre)

#### Szabadságon lévő szövetségesek
- **Aktív**: Csak ha NEM magányos farkas
- **Deaktiválva**: Magányos farkas esetén (disabled + bg-gray-100, érték 0)

#### Tábornok max értékek
- **Gnóm**: Max 4 (Tábornok személyiség: max 5)
- **Ork**: Max 6 (Tábornok személyiség: max 7)
- **Más fajok**: Max 5 (Tábornok személyiség: max 6)
- **Dinamikus select**: Opciók generálása max érték alapján

### 2.8 Tekercs maximum értékek

#### Hadi tekercs max
- **Gnóm**: 50% (alap)
- **Más fajok**: 30% (alap)
- **Tudós**: +5%
- **Tudomány hónapja**: +5%
- **Max**: 55%

#### Lakáshelyzeti tekercs max
- **Gnóm**: 50% (alap)
- **Óriás/Félelf**: 40% (alap)
- **Más fajok**: 30% (alap)
- **Tudomány hónapja**: +5%
- **Max**: 55%

---

## 3. Tesztelési mátrix

### 3.1 Kombinációs tesztelés

#### Faj × Személyiség kombinációk
- [ ] Minden faj × Minden személyiség
- [ ] Többszörös személyiség kombinációk
- [ ] Tudós + más személyiségek

#### Faj × Időszak kombinációk
- [ ] Minden faj × Minden időszak
- [ ] Többszörös időszak kombinációk
- [ ] Tudomány hónapja + más időszakok

#### Tekercs kombinációk
- [ ] Skip tekercs ON/OFF
- [ ] Különböző tekercs értékek kombinációi
- [ ] Max értékek túllépése

### 3.2 Edge case-ek

#### Null értékek
- [ ] Minden mező 0
- [ ] Csak egy mező kitöltve
- [ ] Negatív értékek (ha lehetséges)

#### Nagyon nagy értékek
- [ ] 1,000,000+ épület
- [ ] 1,000,000+ katona
- [ ] Számítási teljesítmény

#### Formátum variációk
- [ ] Számok pontokkal: "1.000.000"
- [ ] Számok szóközökkel: "1 000 000"
- [ ] Számok tabokkal: "1\t000\t000"
- [ ] Vegyes formátumok

### 3.3 Manuális számítások ellenőrzése

#### Ismert értékek
- [ ] Játékban tesztelt kombinációk
- [ ] Közösség által ellenőrzött értékek
- [ ] Hivatalos dokumentáció alapján

---

## 4. Tesztelési eredmények

### 4.1 Épületlista kalkulátor

**Dátum**: _______________
**Tesztelő**: _______________

| Teszt eset | Státusz | Megjegyzés |
|------------|---------|------------|
|            |         |            |

### 4.2 Háború kalkulátor

**Dátum**: _______________
**Tesztelő**: _______________

| Teszt eset | Státusz | Megjegyzés |
|------------|---------|------------|
|            |         |            |

---

## 5. Ismert problémák

### 5.1 Épületlista kalkulátor
- [ ] Nincs ismert probléma

### 5.2 Háború kalkulátor
- [ ] Nincs ismert probléma

---

## 6. Jegyzetek

### 6.1 Számítási képletek változásai
- Dokumentálni kell, ha a játék mechanikája változik

### 6.2 Tesztelési környezet
- Böngésző: _______________
- Verzió: _______________
- Operációs rendszer: _______________

---

**Utolsó frissítés**: 2025-01-08
**Verzió**: 1.0

