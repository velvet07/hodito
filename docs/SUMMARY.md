# Hódító Súgó Dokumentáció - Letöltés Összefoglaló

## Projekt Részletek

**Befejezve:** 2025. november 13.
**Forrás:** https://hodito.hu/help.php
**Dokumentumok száma:** 50 egyedi súgó oldal

## Létrehozott Fájlok

### 1. Markdown Fájlok (/hodito_help_pages/)
Minden súgó oldal külön markdown fájlként lett mentve, megfelelő UTF-8 kódolással és tiszta formázással.

**Teljes lista:**
- ajanlo.md - Ajánló rendszer
- allies.md - Szövetségesek
- android.md - Android alkalmazás
- caravan.md - Karaván rendszer
- clan.md - Szövetségek (21 KB)
- clanwar.md - Szövetségi háború
- constr.md - Építés rendszer (17 KB)
- council.md - Tanács
- customstrat.md - Egyedi stratégia
- dipl.md - Diplomácia
- explore.md - Felfedezés
- extra.md - Extra funkciók (24 KB)
- faj.md - Fajok (18 KB)
- fame.md - Hírnév
- faq.md - GYIK
- faq_multi.md - Multi GYIK
- forum.md - Fórum
- gems.md - Drágakövek
- group.md - Csoportok
- guide.md - Útmutató
- haduzenet.md - Hadüzenet
- helytarto.md - Helytartó (15 KB)
- hetvegi.md - Hétvégi játék
- illness.md - Betegségek
- korvaltas.md - Korváltás
- level.md - Szintek (18 KB)
- mail.md - Üzenetek
- main.md - Főoldal
- market.md - Piac
- military.md - Hadsereg
- moral.md - Morál
- mystics.md - Varázslók (16 KB)
- news.md - Hírek
- notes.md - Jegyzetek
- parbaj.md - Párbaj
- personality.md - Személyiség
- priority.md - Prioritás
- readmail.md - Üzenetek olvasása
- science.md - Tudomány
- score.md - Pontszámítás
- search.md - Keresés
- settings.md - Beállítások
- socialmedia.md - Közösségi média
- tax.md - Adózás
- thief.md - Tolvajok (12 KB)
- verdij.md - Vérdíj
- vip.md - VIP tagság (14 KB)
- viparena.md - VIP Aréna
- viphetvegi.md - VIP hétvégi
- war.md - Háború (17 KB)

### 2. Kiegészítő Dokumentumok
- **README.md** - Teljes dokumentáció és tartalomjegyzék kategóriákkal
- **FILELIST.md** - Részletes fájllista méretekkel

### 3. Archívum
- **hodito_help_pages.zip** (144 KB) - Minden markdown fájl egyetlen ZIP archívumban

## Technikai Részletek

### Feldolgozási Folyamat
1. **Letöltés:** curl használatával közvetlen letöltés a hodito.hu szerverről
2. **Kódolás Konverzió:** ISO-8859-2 → UTF-8 (iconv)
3. **HTML → Markdown:** Python szkript segítségével
4. **Tisztítás:** 
   - HTML tagek eltávolítása
   - CSS stílusok szűrése
   - HTML entitások dekódolása
   - Felesges whitespace-ek törlése

### Minőségi Jellemzők
✅ Magyar ékezetes karakterek helyesen megjelenítve
✅ Struktúra megőrzése (címsorok, listák, bekezdések)
✅ UTF-8 kódolás minden fájlban
✅ Tiszta, olvasható formátum
✅ Konzisztens formázás

## Használati Útmutató

### Egyedi Fájlok Megtekintése
```bash
# Bármelyik fájl megtekintése:
cat hodito_help_pages/clan.md
cat hodito_help_pages/vip.md
```

### ZIP Kicsomagolása
```bash
unzip hodito_help_pages.zip
```

### Keresés a Dokumentumokban
```bash
# Keresés egy kifejezésre:
grep -r "hadsereg" hodito_help_pages/

# Keresés több fájlban:
grep -l "VIP" hodito_help_pages/*.md
```

## Statisztikák

- **Összes dokumentum:** 50 súgó oldal
- **Teljes méret:** ~374 KB (tömörítetlen)
- **ZIP méret:** 144 KB
- **Átlagos fájlméret:** ~7.5 KB
- **Legnagyobb fájl:** extra.md (24 KB)
- **Legkisebb fájl:** socialmedia.md (492 bytes)

## Kategóriák Szerint

### Nagy tartalmú dokumentumok (>15 KB):
- clan.md (21 KB) - Szövetségek részletes leírása
- extra.md (24 KB) - Extra funkciók
- faj.md (18 KB) - Fajok jellemzői
- level.md (18 KB) - Szintrendszer
- constr.md (17 KB) - Építés
- war.md (17 KB) - Háború
- mystics.md (16 KB) - Varázslók
- helytarto.md (15 KB) - Helytartó

### Közepes tartalmú dokumentumok (5-15 KB):
- vip.md (14 KB)
- thief.md (12 KB)
- forum.md (9.7 KB)
- allies.md (8.6 KB)
- parbaj.md (8.4 KB)
- settings.md (8.2 KB)
- customstrat.md (8.1 KB)
- science.md (7.7 KB)
- score.md (7.0 KB)
- military.md (6.7 KB)

## Megjegyzések

A dokumentumok a hodito.hu hivatalos súgó oldalairól lettek automatikusan generálva. 
A konverzió során törekedtünk a lehető legtisztább és legolvashatóbb formátum előállítására, 
miközben megőriztük az eredeti tartalom szerkezetét és információtartalmát.

## Következő Lépések

Ezeket a markdown fájlokat felhasználhatod:
- Offline dokumentáció készítésére
- HTML konverzióhoz (pl. MkDocs, Jekyll)
- PDF generáláshoz
- Keresőmotor indexeléshez
- Személyes tudásbázis építéséhez

---

**Készítette:** Claude AI
**Dátum:** 2025. november 13.
**Verzió:** 1.0
