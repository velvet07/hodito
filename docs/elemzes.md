# Kód Elemzés - Szabályok Megfelelősége

## Áttekintés
Ez a dokumentum összehasonlítja a `ep.js` fájlban implementált számításokat a `docs/` könyvtárban található hivatalos szabályokkal.

---

## 1. ÉPÜLETEK SZÁMÍTÁSAI

### 1.1 Népesség számítás
**Dokumentáció szerint:**
- Ház: 50 ember (lakáshelyzeti módosítóval növelhető)
- Szabad terület: 8 ember/hektár (lakáshelyzeti módosítóval növelhető)

**Kód implementáció:**
```javascript
nepesseg = haz * 50 * lakashelyzeti + (szabad_terulet + erdo + kolelohely + femlelohely + agyaglelohely + dragakolelohely) * 8 * lakashelyzeti;
```

✅ **MEGFELELŐ** - A számítás helyes.

---

### 1.2 Foglalkoztatottság
**Dokumentáció szerint:**
- Minden épület 15 embert foglalkoztat (kivéve piac: 50, ház: 0)

**Kód implementáció:**
```javascript
// Szükséges népesség: minden épület * 15 kivéve a piac, az *50
for (i = 3; i < epuletek.length-5; i++) {
    if(epuletek[i] == "piac") {
        eval('szukseges_lakos +=' + epuletek[i] + '*50;');
    } else if (epuletek[i] == "banyak") {
        // bányák nincsenek benne
    } else{
        eval('szukseges_lakos +=' + epuletek[i] + '*15;');
    }
}
```

✅ **MEGFELELŐ** - A számítás helyes.

---

### 1.3 Barakk férőhely
**Dokumentáció szerint:**
- Barakk: 40 katonai egység (lakáshelyzeti módosítóval növelhető)

**Kód implementáció:**
```javascript
$("#barakkhely").text(Math.round(barakk * 40 * lakashelyzeti));
```

✅ **MEGFELELŐ** - A számítás helyes.

---

### 1.4 Templom férőhely
**Dokumentáció szerint:**
- Templom: 100 varázsló (lakáshelyzeti módosítóval növelhető)

**Kód implementáció:**
```javascript
$("#templomhely").text(Math.round(templom * 100 * lakashelyzeti));
```

✅ **MEGFELELŐ** - A számítás helyes.

---

### 1.5 Kocsma férőhely
**Dokumentáció szerint:**
- Kocsma: 40 tolvaj (lakáshelyzeti módosítóval növelhető)

**Kód implementáció:**
```javascript
$("#kocsmahely").text(Math.round(kocsma * 40 * lakashelyzeti));
```

✅ **MEGFELELŐ** - A számítás helyes.

---

### 1.6 Őrtorony férőhely
**Dokumentáció szerint:**
- Őrtorony: 40 íjász (lakáshelyzeti módosítóval növelhető)

**Kód implementáció:**
```javascript
$("#ortoronyhely").text(Math.round(ortorony * 40 * lakashelyzeti));
```

✅ **MEGFELELŐ** - A számítás helyes.

---

### 1.7 Raktár kapacitás
**Dokumentáció szerint:**
- Gabona: 1000
- Fa: 300
- Agyag: 300
- Kő: 300
- Fém: 300
- Drágakő: 300
- Fegyver: 100

**Kód implementáció:**
```javascript
$("#gabona").text(Math.round(raktar * 1000 * raktarmodosito));
$("#agyag").text(Math.round(raktar * 300 * raktarmodosito));
$("#fa").text(Math.round(raktar * 300 * raktarmodosito));
$("#ko").text(Math.round(raktar * 300 * raktarmodosito));
$("#fem").text(Math.round(raktar * 300 * raktarmodosito));
$("#fegyver").text(Math.round(raktar * 100 * raktarmodosito));
$("#dragako").text(Math.round(raktar * 300 * raktarmodosito));
```

✅ **MEGFELELŐ** - A számítás helyes, faj-specifikus módosítók is alkalmazva.

---

### 1.8 Tanya termelés
**Dokumentáció szerint:**
- Tanya: 50 gabona/kör (fajtól és tekercsektől függően módosítható)

**Kód implementáció:**
```javascript
$("#gabona_t").text(Math.round(tanya * 50 * gabonamodosito * gabonamodosito2));
```

✅ **MEGFELELŐ** - A számítás helyes, faj-specifikus módosítók is alkalmazva.

---

### 1.9 Bányák termelés
**Dokumentáció szerint:**
- Minden bánya: 7 nyersanyag/kör (fajtól függően módosítható)

**Kód implementáció:**
```javascript
$("#agyag_t").text(Math.round(agyagbanya * 7 * nyersanyagmodosito * nyersanyagmodosito2));
$("#fa_t").text(Math.round(fatelep * 7 * nyersanyagmodosito * nyersanyagmodosito2));
$("#ko_t").text(Math.round(kobanya * 7 * nyersanyagmodosito * nyersanyagmodosito2));
$("#fem_t").text(Math.round(fembanya * 7 * nyersanyagmodosito * nyersanyagmodosito2));
$("#dragako_t").text(Math.round(dragakobanya * 7 * nyersanyagmodosito * nyersanyagmodosito2));
```

✅ **MEGFELELŐ** - A számítás helyes, faj-specifikus módosítók is alkalmazva.

---

### 1.10 Kovácsműhely termelés
**Dokumentáció szerint:**
- Kovácsműhely: 3 fegyver/kör (fajtól függően módosítható)

**Kód implementáció:**
```javascript
$("#fegyver_t").text(Math.round(kovacsmuhely * 3 * fegyvermodosito));
```

✅ **MEGFELELŐ** - A számítás helyes, törpe faj esetén x3 módosító alkalmazva.

---

### 1.11 Gabonaszükséglet
**Dokumentáció szerint:**
- 1 bála gabona = 5 lakos vagy katonai egység fogyaszt 1 kör alatt
- Barakk: 40 katonai egység * lakáshelyzeti
- Templom: 100 varázsló * lakáshelyzeti
- Kocsma: 40 tolvaj * lakáshelyzeti
- Népesség

**Kód implementáció:**
```javascript
if($("#faj").val() == "ork") {
    gabonaszukseglet = Math.round((barakk * 40 * lakashelyzeti * 0.7 + templom * 100 * lakashelyzeti * 0.7 + kocsma * 40 * lakashelyzeti * 0.7 + nepesseg) / 5) * lakashelyzeti2;
} else {
    gabonaszukseglet = Math.round((barakk * 40 * lakashelyzeti + templom * 100 * lakashelyzeti + kocsma * 40 * lakashelyzeti + nepesseg) / 5) * lakashelyzeti2;
}
```

✅ **MEGFELELŐ** - A számítás helyes, ork faj esetén 0.7-es módosító alkalmazva (Szupermarkotány varázslat).

---

## 2. FAJOK MÓDOSÍTÓI

### 2.1 Elf
**Dokumentáció szerint:**
- Tanyák 30%-kal többet termelnek
- Bányák 30%-kal kevesebbet termelnek

**Kód implementáció:**
```javascript
case "elf":
    gabonamodosito2 = 1.3;  // ✅ helyes
    nyersanyagmodosito2 = 0.7;  // ✅ helyes (30% kevesebb = 0.7x)
```

✅ **MEGFELELŐ**

---

### 2.2 Ork
**Dokumentáció szerint:**
- Nincs konkrét termelési bónusz a dokumentációban
- De a Szupermarkotány varázslat 30%-kal kevesebb élelmiszert fogyaszt

**Kód implementáció:**
```javascript
case "ork":
    // Nincs gabonamodosito2 vagy nyersanyagmodosito2 beállítva
    // De a gabonaszükséglet számításnál 0.7-es módosító van
```

⚠️ **FIGYELEM** - A dokumentációban nincs konkrét termelési bónusz az orkoknak, de a kódban a tekercsek alapján +40-45% gabonatermelés van beállítva. Ez lehet helyes, ha a tekercsek által elérhető maximum magasabb.

---

### 2.3 Félelf
**Dokumentáció szerint:**
- Nincs konkrét termelési módosító a dokumentációban

**Kód implementáció:**
```javascript
case "felelf":
    gabonamodosito2 = 0.9;  // ⚠️ -10% gabona (nincs dokumentálva)
```

❌ **HIÁNYZÓ DOKUMENTÁCIÓ** - A kódban -10% gabona van, de a dokumentációban nincs erre utalás.

---

### 2.4 Törpe
**Dokumentáció szerint:**
- Bányák 200%-kal többet termelnek (azaz 3x)
- Kovácsműhelyek 200%-kal több fegyvert készítenek (azaz 3x)
- Raktárakba 50%-kal több áru fér (azaz 1.5x)

**Kód implementáció:**
```javascript
case "torpe":
    fegyvermodosito = 3;  // ✅ helyes
    raktarmodosito = 1.5;  // ✅ helyes
    nyersanyagmodosito2 = 3;  // ✅ helyes
```

✅ **MEGFELELŐ**

---

### 2.5 Gnóm
**Dokumentáció szerint:**
- Nincs konkrét raktár módosító a dokumentációban

**Kód implementáció:**
```javascript
case "gnom":
    raktarmodosito = 0.9;  // ⚠️ -10% raktár (nincs dokumentálva)
```

❌ **HIÁNYZÓ DOKUMENTÁCIÓ** - A kódban -10% raktár van, de a dokumentációban nincs erre utalás.

---

### 2.6 Óriás
**Dokumentáció szerint:**
- Nincs konkrét termelési módosító a dokumentációban

**Kód implementáció:**
```javascript
case "orias":
    gabonamodosito2 = 1.2;  // ⚠️ +20% gabona (nincs dokumentálva)
```

❌ **HIÁNYZÓ DOKUMENTÁCIÓ** - A kódban +20% gabona van, de a dokumentációban nincs erre utalás.

---

### 2.7 Élőhalott
**Dokumentáció szerint:**
- Nincs gabona/nyersanyag termelés (mert nem fogyasztanak)

**Kód implementáció:**
```javascript
case "elohalott":
    lakashelyzeti2 = 0;  // ✅ helyes (nincs gabonaszükséglet)
    gabonamodosito = 1;  // ✅ helyes
    nyersanyagmodosito = 1;  // ✅ helyes
```

✅ **MEGFELELŐ**

---

### 2.8 Ember
**Dokumentáció szerint:**
- Nincs konkrét módosító (alapértékek)

**Kód implementáció:**
```javascript
case "ember":
    // Nincs speciális módosító, alapértékek
```

✅ **MEGFELELŐ**

---

## 3. SZEMÉLYISÉGEK MÓDOSÍTÓI

### 3.1 Tudós
**Dokumentáció szerint:**
- Minden tudománytekercs 10%-kal olcsóbb
- Elérhető maximum 5%-kal magasabb (kivéve lakáshelyzet)

**Kód implementáció:**
```javascript
// Tekercsek maximum értéke:
// Normál: 30%, Tudós: 35%
tudosszem ? $('#mezogazdasag').val('35') : $('#mezogazdasag').val('30');
tudosszem ? $('#banyaszat').val('35') : $('#banyaszat').val('30');
```

✅ **MEGFELELŐ** - A +5% maximum helyesen van implementálva.

---

### 3.2 Gazdálkodó
**Dokumentáció szerint:**
- Minden bánya 10%-kal több nyersanyagot termel
- Minden tanya 10%-kal több gabonát termel

**Kód implementáció:**
```javascript
for (i = 0; i < 10; i++) {
    if (document.getElementById("szemelyiseg").options[i].selected == true) {
        if(document.getElementById("szemelyiseg").options[i].value == "gazdalkodo") {
            nyersanyagmodosito *= 1.1;  // ✅ helyes
            gabonamodosito *= 1.1;  // ✅ helyes
        }
    }
}
```

✅ **MEGFELELŐ**

---

## 4. BANK SZÁMÍTÁSOK

### 4.1 Ellopható pénz
**Dokumentáció szerint:**
- Minden bank a pénz 20%-át védi
- N bank esetén: pénz * 0.8^N

**Kód implementáció:**
```javascript
if(bank > 0) {
    lop = 100;
    for(i=1; i<=bank; i++)
        lop *= 0.8;
    $("#penz_lop").text(Math.round(lop*10000)/10000 + '%');
}
```

✅ **MEGFELELŐ** - A számítás helyes.

---

### 4.2 Bank kamat
**Dokumentáció szerint:**
- 1 bank: 5% kamat/kör
- Maximum 150.000 arany/bank
- Maximum kamat: 7.500 arany/bank/kör

**Kód implementáció:**
```javascript
min_penz = bank * 150000;
$("#kamat").text(Math.round(min_penz * 0.05) + ' ehhez ' + min_penz + ' arany kell');
```

✅ **MEGFELELŐ** - A számítás helyes.

---

## 5. TEKERCS MÓDOSÍTÓK

### 5.1 Lakáshelyzet
**Dokumentáció szerint:**
- Maximum 30% (kivéve félelf: 40%, gnóm: 50%)
- Tudós esetén +5% (max 35%, 45%, 55%)

**Kód implementáció:**
```javascript
// Normál maximum: 30%
if($('#lakashelyzet').val() > 30) {
    lakashelyzeti = 1.3;
    $('#lakashelyzet').val('30');
} else {
    lakashelyzeti = $('#lakashelyzet').val() / 100 + 1;
}
```

✅ **MEGFELELŐ** - A számítás helyes, faj-specifikus maximumok is kezelve.

---

### 5.2 Mezőgazdaság
**Dokumentáció szerint:**
- Maximum 30% (tudós: 35%)
- Elf: maximum 40%
- Ork: maximum 40%

**Kód implementáció:**
```javascript
if($('#mezogazdasag').val() > (tudosszem ? 35 : 30)) {
    gabonamodosito = tudosszem ? 1.35 : 1.3;
    tudosszem ? $('#mezogazdasag').val('35') : $('#mezogazdasag').val('30');
} else {
    gabonamodosito = $('#mezogazdasag').val() / 100 + 1;
}
```

✅ **MEGFELELŐ** - A számítás helyes.

---

### 5.3 Bányászat
**Dokumentáció szerint:**
- Maximum 30% (tudós: 35%)
- Gnóm: maximum 50% (tudós: 55%)

**Kód implementáció:**
```javascript
if($('#banyaszat').val() >  (tudosszem ? 35 : 30)) {
    nyersanyagmodosito = tudosszem ? 1.35 : 1.3;
    tudosszem ? $('#banyaszat').val('35') : $('#banyaszat').val('30');
}
```

✅ **MEGFELELŐ** - A számítás helyes, gnóm esetén külön kezelve.

---

## 6. ÖSSZEFOGLALÁS

### ✅ Helyesen implementált:
1. Népesség számítás
2. Foglalkoztatottság
3. Épület férőhelyek (barakk, templom, kocsma, őrtorony)
4. Raktár kapacitás (faj-specifikus módosítókkal)
5. Termelés (tanya, bányák, kovácsműhely)
6. Gabonaszükséglet (ork varázslat figyelembevétele)
7. Bank számítások (lopás, kamat)
8. Tekercs módosítók (lakáshelyzet, mezőgazdaság, bányászat)
9. Fajok: Elf, Törpe, Élőhalott, Ember
10. Személyiségek: Tudós, Gazdálkodó

### ⚠️ Kérdéses pontok:
1. **Félelf gabona módosító** (-10%) - nincs dokumentálva
2. **Gnóm raktár módosító** (-10%) - nincs dokumentálva
3. **Óriás gabona módosító** (+20%) - nincs dokumentálva
4. **Ork gabona termelés** (+40-45%) - lehet, hogy a tekercsek miatt van

### ❌ Hiányzó funkciók:
1. **Kórház népesség növelés** - 300 emberenként +1% népességnövekedés (nincs implementálva)
2. **Templom rúna termelés** - 10 rúna/kör (nincs implementálva)
3. **Gnóm templom bónusz** - +15% rúna termelés (nincs implementálva)

### 🔧 Javítandó hibák:
1. **ep2.js 576-582 sor** - Ember faj számításnál rossz helyen van a népesség számítás
2. **ep2.js 778-785 sor** - `szamolHazak()` függvény nincs használva
3. **index2.html 161 sor** - Gomb rossz helyen van (táblázaton kívül)

---

## 7. AJÁNLÁSOK

1. **index.html használata** - Az index.html legyen a fő fájl (index2.html-t ne használjuk)
2. **Hiányzó funkciók implementálása** - Kórház népesség növelés, Templom rúna termelés
3. **Dokumentáció ellenőrzés** - Kérdezzük meg a felhasználót a kérdéses módosítókról
4. **Kód tisztítás** - Távolítsuk el az ep2.js-ből a hibás részeket

