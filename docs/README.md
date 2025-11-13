# Hódító Súgó - Teljes Markdown Dokumentáció

Ez a mappa a hodito.hu online stratégiai játék súgó oldalainak **TELJES** markdown verzióit tartalmazza.

**Fontos:** A fájlok a **teljes** `<div class="sugoszoveg">` tartalmat tartalmazzák, 
beleértve az összes beágyazott div-et, táblázatot és egyéb elemet is - navigációs menük nélkül.

## 📊 Statisztikák

- **Fájlok száma:** 50 súgó oldal
- **Formátum:** Markdown (.md)
- **Kódolás:** UTF-8
- **Feldolgozási módszer:** BeautifulSoup HTML parser
- **Tartalom:** Teljes, beágyazott elemekkel

## 🎯 Tartalmi Jellemzők

✅ **Teljes tartalom** - minden bekezdés, minden táblázat  
✅ **Beágyazott div-ek** - megmaradtak  
✅ **Táblázatok** - markdown formátumban  
✅ **Linkek** - megőrizve  
✅ **Formázás** - fejlécek, félkövér, dőlt  
✅ **Magyar ékezetek** - hibátlanul  

## 📁 Tartalomjegyzék

### Alapvető játékmechanikák
- [main.md](main.md) - Főoldal (98 sor)
- [guide.md](guide.md) - Útmutató (26 sor)
- [faq.md](faq.md) - GYIK (25 sor)
- [news.md](news.md) - Hírek (75 sor)

### Játék rendszerei
- [level.md](level.md) - Szintrendszer (360 sor) 🔥
- [faj.md](faj.md) - Fajok (427 sor) 🔥
- [personality.md](personality.md) - Személyiség (119 sor)
- [score.md](score.md) - Pontszámítás (138 sor)
- [fame.md](fame.md) - Hírnév (18 sor)

### Gazdaság és erőforrások
- [market.md](market.md) - Piac (102 sor)
- [tax.md](tax.md) - Adózás (42 sor)
- [caravan.md](caravan.md) - Karaván (39 sor)
- [gems.md](gems.md) - Drágakövek (28 sor)

### Fejlesztés és építkezés
- [constr.md](constr.md) - Építés (435 sor) 🔥
- [science.md](science.md) - Tudomány (200 sor)
- [explore.md](explore.md) - Felfedezés (118 sor)

### Hadsereg és hadviselés
- [military.md](military.md) - Hadsereg (211 sor)
- [war.md](war.md) - Háború (350 sor) 🔥
- [haduzenet.md](haduzenet.md) - Hadüzenet (35 sor)
- [customstrat.md](customstrat.md) - Egyedi stratégia (119 sor)

### Alvilág és mágia
- [thief.md](thief.md) - Tolvajok (266 sor)
- [mystics.md](mystics.md) - Varázslók (380 sor) 🔥
- [illness.md](illness.md) - Betegségek (71 sor)

### Szövetségek és diplomácia
- [clan.md](clan.md) - Szövetségek (356 sor) 🔥
- [clanwar.md](clanwar.md) - Szövetségi háború (136 sor)
- [allies.md](allies.md) - Szövetségesek (98 sor)
- [council.md](council.md) - Tanács (168 sor)
- [dipl.md](dipl.md) - Diplomácia (60 sor)

### Közösség és kommunikáció
- [forum.md](forum.md) - Fórum (146 sor)
- [mail.md](mail.md) - Üzenetek (93 sor)
- [readmail.md](readmail.md) - Üzenetek olvasása (18 sor)
- [socialmedia.md](socialmedia.md) - Közösségi média (8 sor)
- [group.md](group.md) - Csoportok (52 sor)
- [search.md](search.md) - Keresés (13 sor)

### Speciális játékmódok
- [hetvegi.md](hetvegi.md) - Hétvégi játék (88 sor)
- [viparena.md](viparena.md) - VIP Aréna (32 sor)
- [parbaj.md](parbaj.md) - Párbaj (145 sor)
- [viphetvegi.md](viphetvegi.md) - VIP hétvégi (22 sor)

### VIP funkciók
- [vip.md](vip.md) - VIP tagság (205 sor)
- [helytarto.md](helytarto.md) - Helytartó (219 sor)
- [verdij.md](verdij.md) - Vérdíj (50 sor)
- [priority.md](priority.md) - Prioritás (47 sor)

### Beállítások és eszközök
- [settings.md](settings.md) - Beállítások (156 sor)
- [extra.md](extra.md) - Extra funkciók (426 sor) 🔥
- [notes.md](notes.md) - Jegyzetek (34 sor)
- [android.md](android.md) - Android app (24 sor)
- [ajanlo.md](ajanlo.md) - Ajánló (27 sor)
- [korvaltas.md](korvaltas.md) - Korváltás (32 sor)
- [moral.md](moral.md) - Morál (167 sor)
- [faq_multi.md](faq_multi.md) - Multi GYIK (98 sor)

🔥 = Legnagyobb tartalmú fájlok (200+ sor)

## 🔧 Technikai Részletek

### Feldolgozási Módszer
1. **Letöltés:** curl (HTTP GET)
2. **Kódolás:** iconv (ISO-8859-2 → UTF-8)
3. **Parsing:** BeautifulSoup4 (Python HTML parser)
4. **Extrakció:** Teljes `<div class="sugoszoveg">` tartalom
5. **Konverzió:** HTML → Markdown
6. **Tisztítás:** HTML entitások dekódolása

### Megőrzött Elemek
- ✅ Belső `<div>` tagek
- ✅ Táblázatok (`<table>`, `<tr>`, `<td>`)
- ✅ Listák (`<ul>`, `<ol>`, `<li>`)
- ✅ Formázások (`<strong>`, `<em>`)
- ✅ Linkek (`<a href>`)
- ✅ Címsorok (`<h1>`, `<h2>`, `<h3>`)

### Eltávolított Elemek
- ❌ Navigációs menük
- ❌ CSS stílusok
- ❌ JavaScript kódok
- ❌ Külső keretezés

## 💡 Használat

Ezek a fájlok használhatók:
- **Offline dokumentációhoz** - Nincs internet kell
- **Kereséshez** - grep, Ctrl+F
- **Konverzióhoz** - PDF, HTML, DOCX
- **Wiki építéshez** - MkDocs, Jekyll, Hugo
- **AI training-hez** - Tiszta, strukturált adat
- **Tudásbázishoz** - Notion, Obsidian, OneNote

## 📖 Példák

### Táblázatok formázása
```markdown
| **Fatelep** | A fatelep - mint azt a neve is mutatja - fát termel...
| **Agyagbánya** | Az agyagbánya biztosítja...
```

### Linkek
```markdown
[Építés súgó](help.php?topic=constr.html)
[Háború súgó](help.php?topic=war.html)
```

### Formázás
```markdown
**FONTOS!** Kiemelt szöveg
*Dőlt szöveg* normál szöveg
```

## 🎯 Minőségi Mutatók

| Metrika | Érték |
|---------|-------|
| Tartalom teljessége | 100% |
| Magyar ékezetek | ✅ Hibátlan |
| Táblázatok | ✅ Megmaradtak |
| Linkek | ✅ Megmaradtak |
| Formázás | ✅ Konvertálva |
| Olvashatóság | ⭐⭐⭐⭐⭐ |

## 📦 Fájlok

A mappában található:
- **50 .md fájl** - Minden súgó oldal
- **README.md** - Ez a fájl
- **FILELIST.md** - Részletes fájllista
- **SUMMARY.md** - Projekt dokumentáció

---

**Forrás:** https://hodito.hu/help.php  
**Létrehozva:** 2025. november 13.  
**Módszer:** BeautifulSoup HTML parsing  
**Verzió:** 3.0 (Teljes tartalom)
