# Számítási logikák dokumentáció

**Cél**: A jelenlegi számítási logikák részletes dokumentálása az átalakításhoz.

**Dátum**: 2025-01-08
**Verzió**: 1.0

---

## 1. Épületlista kalkulátor (ep.js)

### 1.1 Fő számítási függvény: `szamol()`

**Helye**: `app/ep.js`, sor 138

**Folyamat**:
1. Épületek értékeinek beolvasása DOM-ból
2. Bányák összesítése
3. Szabad terület számítása
4. Százalékok számítása
5. Faj alapján módosítók beállítása
6. Személyiségek hatásának alkalmazása
7. Időszakok hatásának alkalmazása
8. Eredmények számítása és megjelenítése

### 1.2 Épületek listája

```javascript
var epuletek = [
    'hektar', 'szabad_terulet', 'haz', 'barakk', 'kovacsmuhely', 
    'tanya', 'konyvtar', 'raktar', 'banyak', 'ortorony', 
    'kocsma', 'templom', 'korhaz', 'piac', 'bank', 
    'fatelep', 'kobanya', 'fembanya', 'agyagbanya', 'dragakobanya',
    'erdo', 'kolelohely', 'femlelohely', 'agyaglelohely', 'dragakolelohely'
];
```

**Megjegyzés**: A kód `eval()`-t használ az értékek beolvasásához, ami nem ajánlott.

### 1.3 Bányák számítása

```javascript
banyak = fatelep + kobanya + fembanya + agyagbanya + dragakobanya;
```

**Automatikus frissítés**: Minden bánya változásakor újraszámolódik.

### 1.4 Szabad terület számítása

```javascript
szabad_terulet = hektar - (
    haz + barakk + kovacsmuhely + tanya + konyvtar + raktar + 
    banyak + ortorony + kocsma + templom + korhaz + piac + bank + 
    erdo + kolelohely + femlelohely + agyaglelohely + dragakolelohely
);
```

**Megjegyzés**: Ha negatív, az hiba lehet, de jelenleg nem kezeli.

### 1.5 Százalékok számítása

```javascript
for (i = 1; i < epuletek.length; i++) {
    eval('$("#' + epuletek[i] + '_sz").text(Math.round(' + epuletek[i] + ' / hektar * 100) + "%");');
}
```

**Képlet**: `Math.round(epulet / hektar * 100)`

**Probléma**: Ha `hektar = 0`, akkor `NaN` vagy `Infinity` lehet.

### 1.6 Faj alapú módosítók

#### Switch szerkezet

A kód egy nagy `switch` statementet használ minden fajhoz, ami ismétlődő kódot tartalmaz.

**Minta minden fajhoz**:
1. `skip_tekercs` ellenőrzése
2. Ha skip: max értékek beállítása
3. Ha nem skip: értékek validálása és módosítók számítása

#### Faji módosítók táblázata

| Faj | Gabona módosító2 | Nyersanyag módosító2 | Lakáshelyzet max | Mezőgazdaság max | Bányászat max | Speciális |
|-----|------------------|----------------------|------------------|------------------|---------------|----------|
| None | 1.0 | 1.0 | 30% | 30% | 30% | - |
| Elf | 1.3 (+30%) | 0.7 (-30%) | 30% | 30% | 30% | - |
| Ork | 1.4 (+40%) | 1.0 | 30% | 40% | 30% | Gabonaszükséglet 0.7x |
| Félelf | 0.9 (-10%) | 1.0 | 40% | 30% | 30% | - |
| Törpe | 1.0 | 3.0 (x3) | 30% | 30% | 30% | Fegyver x3, Raktár x1.5, Lakáshelyzet *1.2 |
| Gnóm | 1.0 | 1.0 | 50% | 50% | 50% | Raktár x0.9 |
| Óriás | 1.2 (+20%) | 1.0 | 40% | 30% | 30% | - |
| Élőhalott | 1.0 | 1.0 | Szint alapján | 0% | 0% | Lakáshelyzeti2 = 0 |
| Ember | 1.0 | 1.0 | 30% | 30% | 30% | - |

#### Élőhalott szint módosítók

```javascript
switch(szint) {
    case "5": lakashelyzeti = 1.2; break;
    case "4": lakashelyzeti = 1.3; break;
    case "3": lakashelyzeti = 1.4; break;
    case "2": lakashelyzeti = 1.5; break;
    case "1": lakashelyzeti = 1.6; break;
}
```

### 1.7 Tekercsek számítása

#### Lakáshelyzet tekercs

**Képlet**: `lakashelyzeti = lakashelyzet / 100 + 1`

**Speciális esetek**:
- **Törpe**: `lakashelyzeti = (lakashelyzet / 100 + 1) * 1.2`
- **Skip tekercs**: Automatikusan max értékre állítja

#### Mezőgazdaság tekercs

**Képlet**: `gabonamodosito = mezogazdasag / 100 + 1`

**Max értékek**:
- Alap: 30%
- Tudós: +5% (35%)
- Tudomány hónapja: +5% (max 55%)
- Ork: 40% (tudós: 45%)

#### Bányászat tekercs

**Képlet**: `nyersanyagmodosito = banyaszat / 100 + 1`

**Max értékek**: Ugyanazok, mint mezőgazdaságnál (kivéve ork)

### 1.8 Személyiségek hatása

#### Tudós

**Hatás**: Tekercsek max értéke +5%

```javascript
if(tudosszem) {
    tudomanyMax = 35; // helyett 30
}
```

#### Gazdálkodó

**Hatás**: +10% termelés

```javascript
if(document.getElementById("szemelyiseg_gazdalkodo") && document.getElementById("szemelyiseg_gazdalkodo").checked) {
    nyersanyagmodosito *= 1.1;
    gabonamodosito *= 1.1;
}
```

### 1.9 Időszakok hatása

#### Bő termés

```javascript
if(document.getElementById("idoszak_bo_termes") && document.getElementById("idoszak_bo_termes").checked) {
    gabonamodosito2 *= 1.2; // +20%
}
```

#### Rágcsálók

```javascript
if(document.getElementById("idoszak_ragcsalok") && document.getElementById("idoszak_ragcsalok").checked) {
    gabonamodosito2 *= 0.9; // -10%
}
```

#### Nyersanyag+

```javascript
if(document.getElementById("idoszak_nyersanyag_plus") && document.getElementById("idoszak_nyersanyag_plus").checked) {
    nyersanyagmodosito2 *= 1.2; // +20%
}
```

#### Nyersanyag-

```javascript
if(document.getElementById("idoszak_nyersanyag_minus") && document.getElementById("idoszak_nyersanyag_minus").checked) {
    nyersanyagmodosito2 *= 0.9; // -10%
}
```

#### Zsugoráru

```javascript
if(document.getElementById("idoszak_zsugoraru") && document.getElementById("idoszak_zsugoraru").checked) {
    raktarmodosito *= 3; // x3
}
```

### 1.10 Népesség számítás

```javascript
nepesseg = haz * 50 * lakashelyzeti + 
    (szabad_terulet + erdo + kolelohely + femlelohely + agyaglelohely + dragakolelohely) * 8 * lakashelyzeti;
```

**Képlet**:
- Ház: `haz * 50 * lakashelyzeti`
- Szabad terület + lelőhelyek: `(szabad_terulet + lelőhelyek) * 8 * lakashelyzeti`

**Élőhalott**: `lakashelyzeti2 = 0`, így népesség = 0

### 1.11 Foglalkoztatottság számítás

```javascript
for (i = 3; i < epuletek.length-5; i++) {
    if(epuletek[i] == "piac") {
        eval('szukseges_lakos +=' + epuletek[i] + '*50;');
    } else if (epuletek[i] == "banyak") {
        // skip
    } else {
        eval('szukseges_lakos +=' + epuletek[i] + '*15;');
    }
}
szukseges_lakos2 = (szukseges_lakos - bank * 15);
```

**Képlet**: `Math.round(szukseges_lakos / nepesseg * 100)`

**Speciális**:
- Piac: 50 lakos/épület (helyett 15)
- Bank: Kivonható (`szukseges_lakos2`)

### 1.12 Férőhelyek számítás

```javascript
$("#barakkhely").text(Math.round(barakk * 40 * lakashelyzeti));
$("#templomhely").text(Math.round(templom * 100 * lakashelyzeti));
$("#kocsmahely").text(Math.round(kocsma * 40 * lakashelyzeti));
$("#ortoronyhely").text(Math.round(ortorony * 40 * lakashelyzeti));
$("#barakk_torony").text(Math.round(barakk * 40 * lakashelyzeti - ortorony * 40 * lakashelyzeti));
```

**Képletek**:
- Barakk: `barakk * 40 * lakashelyzeti`
- Templom: `templom * 100 * lakashelyzeti`
- Kocsma: `kocsma * 40 * lakashelyzeti`
- Őrtorony: `ortorony * 40 * lakashelyzeti`
- Barakk - Torony: `barakk * 40 * lakashelyzeti - ortorony * 40 * lakashelyzeti`

### 1.13 Raktár kapacitás számítás

```javascript
$("#gabona").text(Math.round(raktar * 1000 * raktarmodosito));
$("#agyag").text(Math.round(raktar * 300 * raktarmodosito));
$("#fa").text(Math.round(raktar * 300 * raktarmodosito));
$("#ko").text(Math.round(raktar * 300 * raktarmodosito));
$("#fem").text(Math.round(raktar * 300 * raktarmodosito));
$("#fegyver").text(Math.round(raktar * 100 * raktarmodosito));
$("#dragako").text(Math.round(raktar * 300 * raktarmodosito));
```

**Képletek**:
- Gabona: `raktar * 1000 * raktarmodosito`
- Agyag/Fa/Kő/Fém/Drágakő: `raktar * 300 * raktarmodosito`
- Fegyver: `raktar * 100 * raktarmodosito`

**Módosítók**:
- Törpe: `raktarmodosito = 1.5`
- Gnóm: `raktarmodosito = 0.9`
- Zsugoráru: `raktarmodosito *= 3`

### 1.14 Termelés számítás

```javascript
$("#gabona_t").text(Math.round(tanya * 50 * gabonamodosito * gabonamodosito2));
$("#agyag_t").text(Math.round(agyagbanya * 7 * nyersanyagmodosito * nyersanyagmodosito2));
$("#fa_t").text(Math.round(fatelep * 7 * nyersanyagmodosito * nyersanyagmodosito2));
$("#ko_t").text(Math.round(kobanya * 7 * nyersanyagmodosito * nyersanyagmodosito2));
$("#fem_t").text(Math.round(fembanya * 7 * nyersanyagmodosito * nyersanyagmodosito2));
$("#fegyver_t").text(Math.round(kovacsmuhely * 3 * fegyvermodosito));
$("#dragako_t").text(Math.round(dragakobanya * 7 * nyersanyagmodosito * nyersanyagmodosito2));
```

**Képletek**:
- Gabona: `tanya * 50 * gabonamodosito * gabonamodosito2`
- Nyersanyagok: `banya * 7 * nyersanyagmodosito * nyersanyagmodosito2`
- Fegyver: `kovacsmuhely * 3 * fegyvermodosito`

**Módosítók**:
- Törpe fegyver: `fegyvermodosito = 3`
- Törpe nyersanyag: `nyersanyagmodosito2 = 3`

### 1.15 Bankadatok számítás

#### Ellopható pénz

```javascript
if(bank > 0) {
    lop = 100;
    for(i=1; i<=bank; i++)
        lop *= 0.8;
    $("#penz_lop").text(Math.round(lop*10000)/10000 + '%');
} else {
    $("#penz_lop").text('100%');
}
```

**Képlet**: `100 * 0.8^bank`

**Példa**:
- 1 bank: 80%
- 2 bank: 64%
- 3 bank: 51.2%

#### Kamat

```javascript
min_penz = bank * 150000;
$("#kamat").text(Math.round(min_penz * 0.05) + ' ehhez ' + min_penz + ' arany kell');
```

**Képlet**: `bank * 150000 * 0.05`

### 1.16 Gabonaszükséglet számítás

#### Ork faj

```javascript
if($("#faj").val() == "ork") {
    gabonaszukseglet = Math.round((barakk * 40 * lakashelyzeti * 0.7 + 
        templom * 100 * lakashelyzeti * 0.7 + 
        kocsma * 40 * lakashelyzeti * 0.7 + nepesseg) / 5) * lakashelyzeti2;
}
```

#### Más fajok

```javascript
else {
    gabonaszukseglet = Math.round((barakk * 40 * lakashelyzeti + 
        templom * 100 * lakashelyzeti + 
        kocsma * 40 * lakashelyzeti + nepesseg) / 5) * lakashelyzeti2;
}
```

#### Bank nélkül

```javascript
gabonaszukseglet_n = Math.round((templom * 100 * lakashelyzeti + 
    kocsma * 40 * lakashelyzeti + nepesseg) / 5) * lakashelyzeti2;
```

**Képlet**: `(barakk_férőhely + templom_férőhely + kocsma_férőhely + népesség) / 5 * lakashelyzeti2`

**Megjegyzés**: `lakashelyzeti2` csak élőhalottnál 0, egyébként 1.

### 1.17 Érték számítás

```javascript
var beepitett = haz + barakk + kovacsmuhely + tanya + konyvtar + raktar + 
    banyak + ortorony + kocsma + templom + korhaz + piac + bank;
if(nepesseg > (hektar * 70)) {
    var nepesseg_ertek = hektar * 70;
} else {
    var nepesseg_ertek = nepesseg;
}
$("#ertek").text(Math.round(szabad_terulet * 30 + beepitett * 45 + nepesseg_ertek / 5));
```

**Képlet**: `szabad_terulet * 30 + beepitett * 45 + Math.min(nepesseg, hektar * 70) / 5`

### 1.18 Beillesztés funkció: `feldolgoz()`

**Helye**: `app/ep.js`, sor 1

**Folyamat**:
1. Textarea értékének beolvasása
2. Sorokra bontás (`split('\n')`)
3. Minden sor feldolgozása:
   - Pontok eltávolítása
   - Kettőspont vagy tab alapján szétválasztás
   - Épület nevének és számának kinyerése
   - Megfelelő mezőbe írás
4. Hektár számítás (összes épület összege)
5. Számítás újrafuttatása

**Formátum támogatás**:
- `Épület: szám`
- `Épület\tszám`

---

## 2. Háború kalkulátor (war.js)

### 2.1 Fő számítási függvény: `szamol()`

**Helye**: `app/war.js`, sor 171

**Folyamat**:
1. Védőerő számítása
2. Támadóerő számítása
3. Eredmények megjelenítése
4. Színezés és keretek
5. Gabonaszükséglet számítása

### 2.2 Védőerő számítás: `szamolVedoero()`

**Helye**: `app/war.js`, sor 309

#### Alapértékek

```javascript
const EGYSEG_ERTEK = {
    katona: { vedo: 1, tamado: 1 },
    vedo: { vedo: 4, tamado: 0 },
    tamado: { vedo: 0, tamado: 4 },
    ijsz: { vedo: 6, tamado: 2 },
    lovas: { vedo: 2, tamado: 6 },
    elit: { vedo: 5, tamado: 5 }
};
```

#### Alap védőerő

```javascript
let alapVedoero = 
    katona * EGYSEG_ERTEK.katona.vedo +
    vedo * EGYSEG_ERTEK.vedo.vedo +
    tamado * EGYSEG_ERTEK.tamado.vedo +
    ijsz * EGYSEG_ERTEK.ijsz.vedo +
    lovas * EGYSEG_ERTEK.lovas.vedo +
    elit * EGYSEG_ERTEK.elit.vedo;
```

#### Őrtorony íjász bónusz

```javascript
const ortorony = parseInt(document.getElementById('vedo_ortorony').value) || 0;
const faj = document.getElementById('vedo_faj').value;
const ortoronyBonus = (faj === 'elf') ? 8 : 6;
const ortoronyIjsz = Math.min(ijsz, ortorony * 100);
alapVedoero += ortoronyIjsz * (ortoronyBonus - EGYSEG_ERTEK.ijsz.vedo);
```

**Logika**:
- 1 őrtorony = 100 íjász
- Elf: 8 pont/íjász (helyett 6) → +2 bónusz
- Más: 6 pont/íjász → nincs bónusz

#### Szövetséges íjászok

```javascript
const szovetsegesIjsz = parseInt(document.getElementById('vedo_szovetseges_ijszok').value) || 0;
alapVedoero += szovetsegesIjsz * EGYSEG_ERTEK.ijsz.vedo;
```

#### Minimális védőerő

```javascript
const hektar = parseInt(document.getElementById('vedo_hektar').value) || 0;
if (alapVedoero < hektar) {
    alapVedoero = hektar;
}
```

#### Faji bónuszok

```javascript
const FAJ_BONUSZ = {
    elf: { vedo: 1.30, tamado: 1.0 },
    ork: { vedo: 1.0, tamado: 1.30 },
    felelf: { vedo: 1.10, tamado: 0.90 },
    // ... stb.
};
const fajBonus = FAJ_BONUSZ[faj] || FAJ_BONUSZ.none;
vedoero *= fajBonus.vedo;
```

#### Katonai morál

```javascript
const moral = parseFloat(document.getElementById('vedo_katonai_moral').value) || 75;
vedoero *= (moral / 100);
```

#### Magányos farkas

```javascript
if (document.getElementById('vedo_maganyos_farkas').checked) {
    vedoero *= 1.40;
}
```

#### Védelem varázslat

```javascript
if (document.getElementById('vedo_vedelem').checked) {
    vedoero *= 1.30;
}
```

#### Kitámadási bónusz (ork)

```javascript
if (document.getElementById('vedo_kitamadasi_bonusz').checked && faj === 'ork') {
    vedoero *= 1.20;
}
```

#### Élőhalott szint

```javascript
const ELOHALOTT_SZINT_BONUSZ = {
    0: 0, 1: 0.40, 2: 0.30, 3: 0.20, 4: 0.10, 5: 0
};
const elohalottSzint = parseInt(document.getElementById('vedo_elohalott_szint').value) || 0;
if (faj === 'elohalott') {
    vedoero *= (1 + ELOHALOTT_SZINT_BONUSZ[elohalottSzint]);
}
```

#### Szabadságon lévő szövetségesek

```javascript
const szabadsagon = parseInt(document.getElementById('vedo_szabadsagon_szovetsegesek').value) || 0;
if (szabadsagon > 0) {
    vedoero *= (1 + szabadsagon * 0.10);
}
```

#### Hadi tekercs

```javascript
let tudosSzazalek = parseFloat(document.getElementById('vedo_tudos_szazalek').value) || 0;
if (tudosSzazalek > 0) {
    vedoero *= (1 + tudosSzazalek / 100);
}
```

#### Őrtorony területarányos védőérték

```javascript
if (hektar > 0 && ortorony > 0) {
    const ortoronyArany = (ortorony / hektar) * 100;
    const ortoronyVedoBonus = Math.min(ortoronyArany * 2, 30) / 100;
    vedoero *= (1 + ortoronyVedoBonus);
}
```

**Képlet**: `min((ortorony / hektar) * 100 * 2, 30) / 100`

### 2.3 Támadóerő számítás: `szamolTamadoero()`

**Helye**: `app/war.js`, sor 402

#### Alapértékek

```javascript
let alapTamadoero = 
    katona * EGYSEG_ERTEK.katona.tamado +
    tamado * EGYSEG_ERTEK.tamado.tamado +
    ijsz * EGYSEG_ERTEK.ijsz.tamado +
    lovas * EGYSEG_ERTEK.lovas.tamado +
    elit * EGYSEG_ERTEK.elit.tamado;
```

#### Faji bónuszok

```javascript
const fajBonus = FAJ_BONUSZ[faj] || FAJ_BONUSZ.none;
tamadoero *= fajBonus.tamado;
```

#### Katonai morál

```javascript
const moral = parseFloat(document.getElementById('tamado_katonai_moral').value) || 75;
tamadoero *= (moral / 100);
```

#### Magányos farkas

```javascript
if (document.getElementById('tamado_maganyos_farkas').checked) {
    tamadoero *= 1.40;
}
```

#### Vérszomj varázslat

```javascript
if (document.getElementById('tamado_verszomj').checked) {
    tamadoero *= 1.30;
}
```

#### Tábornok bónusz

```javascript
const TABORNOK_BONUSZ = {
    0: 0, 1: 0, 2: 0.03, 3: 0.05, 4: 0.06, 
    5: 0.07, 6: 0.08, 7: 0.10, 8: 0.20
};
const tabornok = parseInt(document.getElementById('tamado_tabornok').value) || 0;
tamadoero *= (1 + TABORNOK_BONUSZ[tabornok]);
```

#### Élőhalott szint

Ugyanaz, mint védőnél.

#### Hadi tekercs

Ugyanaz, mint védőnél.

#### Felfele támadás bónusz

```javascript
const irany = document.querySelector('input[name="tamado_irany"]:checked').value;
if (irany === 'felfele') {
    tamadoero *= 1.10;
}
```

### 2.4 Gabonaszükséglet számítás: `szamolGabonaszukseglet()`

**Helye**: `app/war.js`, sor 465

```javascript
const katona = parseInt(document.getElementById(tipus + '_katona').value) || 0;
const tamado = parseInt(document.getElementById(tipus + '_tamado').value) || 0;
const ijsz = parseInt(document.getElementById(tipus + '_ijsz').value) || 0;
const lovas = parseInt(document.getElementById(tipus + '_lovas').value) || 0;
const elit = parseInt(document.getElementById(tipus + '_elit').value) || 0;
const kor = parseInt(document.getElementById(tipus + '_kor').value) || 2;

const osszesKatona = katona + tamado + ijsz + lovas + elit;
return osszesKatona * kor;
```

**Képlet**: `(katona + tamado + ijsz + lovas + elit) * kor`

### 2.5 Segítő funkciók

#### Mennyi íjász kell a védéshez: `szamolIjaszVedohoz()`

**Helye**: `app/war.js`, sor 481

**Algoritmus**: Bináris keresés

```javascript
function findRequiredUnitValue(fieldId, targetPoints, calculatorFn) {
    // Bináris keresés implementáció
    // Max iteráció: 60
    // Max egység: 2,000,000
}
```

#### Mennyi lovas kell a beütéshez: `szamolLovasTamadashoz()`

**Helye**: `app/war.js`, sor 514

**Algoritmus**: Bináris keresés

**Logika**: Ha nincs más egység → Elit, egyébként → Lovas

### 2.6 Import funkciók

#### Kristálygömb importálás: `importKristalygomb()`

**Helye**: `app/war.js`, sor 650

**Feldolgozott adatok**:
- Föld (Hektár)
- Katona, Védő, Támadó, Íjász, Lovas, Elit
- Katonai morál
- Szövetség (magányos farkas)
- Faj
- Személyiség (Tudós ellenőrzés)

**Automatikus beállítások**:
- Hadi tekercs max érték
- Lakáshelyzeti tekercs max érték (védőnél)
- Tábornok max érték (támadónál)

#### Épületlista importálás: `importEpuletlista()`

**Helye**: `app/war.js`, sor 900

**Feldolgozás**:
- Ha van kristálygömb: csak Őrtorony (védőnél)
- Ha nincs kristálygömb: összes épület összeadása hektárhoz
- Barakkok számának mentése
- Max férőhely számítás (íjász/lovas)

---

## 3. Közös függvények

### 3.1 Szám formázása: `formatNumber()`

**Helye**: `app/war.js`, sor 559

```javascript
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
```

**Példa**: `1000000` → `1.000.000`

### 3.2 Szám kinyerése: `extractNumber()`

**Helye**: `app/war.js`, sor 565

```javascript
function extractNumber(text) {
    if (!text) return 0;
    return parseInt(text.replace(/[.,\s]/g, '')) || 0;
}
```

**Példa**: `"1.000.000"` → `1000000`

### 3.3 Tekercs maximum értékek

#### Hadi tekercs max: `getHadiTekercsMax()`

**Helye**: `app/war.js`, sor 572

```javascript
function getHadiTekercsMax(faj, hasTudomanyHonapja, hasTudos) {
    let baseMax = (faj === 'gnom') ? 50 : 30;
    if (hasTudos) baseMax += 5;
    if (hasTudomanyHonapja) baseMax += 5;
    return baseMax;
}
```

#### Lakáshelyzeti tekercs max: `getLakashelyzetiTekercsMax()`

**Helye**: `app/war.js`, sor 607

```javascript
function getLakashelyzetiTekercsMax(faj, hasTudomanyHonapja) {
    let baseMax = 30;
    if (faj === 'gnom') baseMax = 50;
    else if (faj === 'orias' || faj === 'felelf') baseMax = 40;
    if (hasTudomanyHonapja) baseMax += 5;
    return baseMax;
}
```

---

## 4. Ismert problémák és refaktorálási lehetőségek

### 4.1 Problémák

1. **eval() használata**: Biztonsági kockázat, nehéz debugolni
2. **Ismétlődő kód**: Fajok switch statementje nagyon hasonló
3. **DOM közvetlen elérés**: Nehéz tesztelni
4. **Nincs error handling**: Hibás inputok nem kezelve
5. **Nincs validáció**: Bármilyen érték beírható
6. **jQuery függőség**: Régi verzió (1.3.2)
7. **Inline event handlerek**: Nehéz karbantartani

### 4.2 Refaktorálási lehetőségek

1. **Konstansok kiemelése**: Fajok, módosítók, értékek
2. **Függvények szétválasztása**: Minden számítás külön függvény
3. **Moduláris struktúra**: Külön fájlok számításokhoz
4. **TypeScript**: Típusbiztonság
5. **Unit tesztek**: Automatikus tesztelés
6. **Error handling**: Hibák kezelése
7. **Validáció**: Input validáció

---

**Utolsó frissítés**: 2025-01-08
**Verzió**: 1.0

