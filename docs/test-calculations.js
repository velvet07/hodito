/**
 * Automatikus tesztelési script a számítási logikákhoz
 * 
 * Használat:
 * 1. Nyisd meg a böngésző konzolt (F12)
 * 2. Másold be ezt a scriptet
 * 3. Futtasd: testBuildingCalculator() vagy testWarCalculator()
 */

// ============================================================================
// ÉPÜLETLISTA SZÁMÍTÓ TESZTEK
// ============================================================================

function testBuildingCalculator() {
    console.log('=== ÉPÜLETLISTA SZÁMÍTÓ TESZTEK ===\n');
    
    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };
    
    // Helper függvény teszteléshez
    function test(name, condition, expected, actual) {
        const passed = condition;
        results.tests.push({
            name,
            passed,
            expected,
            actual
        });
        
        if (passed) {
            results.passed++;
            console.log(`✅ ${name}`);
        } else {
            results.failed++;
            console.error(`❌ ${name}`);
            console.error(`   Várt: ${expected}, Kapott: ${actual}`);
        }
    }
    
    // 1. Alapadatok tesztelése
    console.log('\n1. Alapadatok tesztelése');
    console.log('---');
    
    // Hektár számítás
    const hektar = parseInt(document.getElementById('hektar').value) || 0;
    const haz = parseInt(document.getElementById('haz').value) || 0;
    const barakk = parseInt(document.getElementById('barakk').value) || 0;
    const szabadTerulet = parseInt(document.getElementById('szabad_terulet').value) || 0;
    
    // Szabad terület számítás ellenőrzése
    const epuletek = [
        'haz', 'barakk', 'kovacsmuhely', 'tanya', 'konyvtar', 'raktar',
        'ortorony', 'kocsma', 'templom', 'korhaz', 'piac', 'bank',
        'fatelep', 'kobanya', 'fembanya', 'agyagbanya', 'dragakobanya',
        'erdo', 'kolelohely', 'femlelohely', 'agyaglelohely', 'dragakolelohely'
    ];
    
    let osszesEpulet = 0;
    epuletek.forEach(ep => {
        const value = parseInt(document.getElementById(ep).value) || 0;
        if (ep === 'fatelep' || ep === 'kobanya' || ep === 'fembanya' || 
            ep === 'agyagbanya' || ep === 'dragakobanya') {
            // Bányák külön számolva
        } else {
            osszesEpulet += value;
        }
    });
    
    const banyak = parseInt(document.getElementById('banyak').value) || 0;
    osszesEpulet += banyak;
    
    const szabadTeruletSzamitott = hektar - osszesEpulet;
    test(
        'Szabad terület számítás',
        szabadTerulet === szabadTeruletSzamitott,
        szabadTeruletSzamitott,
        szabadTerulet
    );
    
    // 2. Népesség számítás
    console.log('\n2. Népesség számítás');
    console.log('---');
    
    const faj = document.getElementById('faj').value;
    const lakashelyzet = parseFloat(document.getElementById('lakashelyzet').value) || 0;
    const lakashelyzeti = lakashelyzet / 100 + 1;
    
    // Élőhalott különleges kezelés
    let lakashelyzeti2 = 1;
    if (faj === 'elohalott') {
        const szint = parseInt(document.getElementById('szint').value) || 5;
        const elohalottSzintek = {5: 1.2, 4: 1.3, 3: 1.4, 2: 1.5, 1: 1.6};
        lakashelyzeti2 = 0; // Nincs népesség
        // lakashelyzeti már be van állítva a switch-ben
    }
    
    const nepessegSzamitott = Math.round(
        haz * 50 * lakashelyzeti + 
        (szabadTerulet + 
         parseInt(document.getElementById('erdo').value || 0) +
         parseInt(document.getElementById('kolelohely').value || 0) +
         parseInt(document.getElementById('femlelohely').value || 0) +
         parseInt(document.getElementById('agyaglelohely').value || 0) +
         parseInt(document.getElementById('dragakolelohely').value || 0)
        ) * 8 * lakashelyzeti
    );
    
    const nepessegMegjelenitett = parseInt(document.getElementById('nepesseg').textContent.replace(/\s/g, '')) || 0;
    test(
        'Népesség számítás',
        Math.abs(nepessegSzamitott - nepessegMegjelenitett) <= 1, // Kerekítési hiba miatt
        nepessegSzamitott,
        nepessegMegjelenitett
    );
    
    // 3. Foglalkoztatottság számítás
    console.log('\n3. Foglalkoztatottság számítás');
    console.log('---');
    
    let szuksegesLakos = 0;
    epuletek.forEach(ep => {
        const value = parseInt(document.getElementById(ep).value) || 0;
        if (ep === 'piac') {
            szuksegesLakos += value * 50;
        } else if (ep !== 'banyak') {
            szuksegesLakos += value * 15;
        }
    });
    szuksegesLakos += banyak * 15;
    
    const bank = parseInt(document.getElementById('bank').value) || 0;
    const szuksegesLakos2 = szuksegesLakos - bank * 15;
    
    const foglalkoztatottsagSzamitott = Math.round(szuksegesLakos / nepessegSzamitott * 100);
    const foglalkoztatottsagSzoveg = document.getElementById('foglalkoztatottsag').textContent;
    const foglalkoztatottsagSzam = parseInt(foglalkoztatottsagSzoveg.match(/\d+/)?.[0] || '0');
    
    test(
        'Foglalkoztatottság számítás (bankkal)',
        Math.abs(foglalkoztatottsagSzamitott - foglalkoztatottsagSzam) <= 1,
        foglalkoztatottsagSzamitott,
        foglalkoztatottsagSzam
    );
    
    // 4. Termelés számítások
    console.log('\n4. Termelés számítások');
    console.log('---');
    
    // Gabona termelés
    const tanya = parseInt(document.getElementById('tanya').value) || 0;
    const gabonaTSzamitott = Math.round(tanya * 50 * 1 * 1); // Alapértelmezett módosítók
    const gabonaTMegjelenitett = parseInt(document.getElementById('gabona_t').textContent.replace(/\s/g, '')) || 0;
    
    test(
        'Gabona termelés (alapértelmezett)',
        gabonaTSzamitott === gabonaTMegjelenitett,
        gabonaTSzamitott,
        gabonaTMegjelenitett
    );
    
    // 5. Raktár kapacitás
    console.log('\n5. Raktár kapacitás');
    console.log('---');
    
    const raktar = parseInt(document.getElementById('raktar').value) || 0;
    const raktarmodosito = 1; // Alapértelmezett
    const gabonaKapacitasSzamitott = Math.round(raktar * 1000 * raktarmodosito);
    const gabonaKapacitasMegjelenitett = parseInt(document.getElementById('gabona').textContent.replace(/\s/g, '')) || 0;
    
    test(
        'Gabona raktár kapacitás',
        gabonaKapacitasSzamitott === gabonaKapacitasMegjelenitett,
        gabonaKapacitasSzamitott,
        gabonaKapacitasMegjelenitett
    );
    
    // Eredmények összefoglalása
    console.log('\n=== TESZTELÉSI EREDMÉNYEK ===');
    console.log(`✅ Sikeres: ${results.passed}`);
    console.log(`❌ Sikertelen: ${results.failed}`);
    console.log(`📊 Összesen: ${results.passed + results.failed}`);
    
    if (results.failed > 0) {
        console.log('\nSikertelen tesztek:');
        results.tests.filter(t => !t.passed).forEach(t => {
            console.error(`  - ${t.name}: várt ${t.expected}, kapott ${t.actual}`);
        });
    }
    
    return results;
}

// ============================================================================
// HÁBORÚ SZÁMÍTÓ TESZTEK
// ============================================================================

function testWarCalculator() {
    console.log('=== HÁBORÚ SZÁMÍTÓ TESZTEK ===\n');
    
    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };
    
    function test(name, condition, expected, actual) {
        const passed = condition;
        results.tests.push({
            name,
            passed,
            expected,
            actual
        });
        
        if (passed) {
            results.passed++;
            console.log(`✅ ${name}`);
        } else {
            results.failed++;
            console.error(`❌ ${name}`);
            console.error(`   Várt: ${expected}, Kapott: ${actual}`);
        }
    }
    
    // 1. Védőerő alapértékek
    console.log('\n1. Védőerő alapértékek');
    console.log('---');
    
    const vedoKatona = parseInt(document.getElementById('vedo_katona').value) || 0;
    const vedoVedo = parseInt(document.getElementById('vedo_vedo').value) || 0;
    const vedoTamado = parseInt(document.getElementById('vedo_tamado').value) || 0;
    const vedoIjsz = parseInt(document.getElementById('vedo_ijsz').value) || 0;
    const vedoLovas = parseInt(document.getElementById('vedo_lovas').value) || 0;
    const vedoElit = parseInt(document.getElementById('vedo_elit').value) || 0;
    
    const EGYSEG_ERTEK = {
        katona: { vedo: 1, tamado: 1 },
        vedo: { vedo: 4, tamado: 0 },
        tamado: { vedo: 0, tamado: 4 },
        ijsz: { vedo: 6, tamado: 2 },
        lovas: { vedo: 2, tamado: 6 },
        elit: { vedo: 5, tamado: 5 }
    };
    
    const alapVedoeroSzamitott = 
        vedoKatona * EGYSEG_ERTEK.katona.vedo +
        vedoVedo * EGYSEG_ERTEK.vedo.vedo +
        vedoTamado * EGYSEG_ERTEK.tamado.vedo +
        vedoIjsz * EGYSEG_ERTEK.ijsz.vedo +
        vedoLovas * EGYSEG_ERTEK.lovas.vedo +
        vedoElit * EGYSEG_ERTEK.elit.vedo;
    
    // A tényleges számítás komplexebb (bónuszokkal), ezért csak ellenőrizzük, hogy nagyobb-e
    const vedoEroMegjelenitett = parseInt(document.getElementById('vedo_ero_megjelenites').textContent.replace(/\s/g, '')) || 0;
    
    test(
        'Védőerő alapérték (minimum)',
        vedoEroMegjelenitett >= alapVedoeroSzamitott,
        `>= ${alapVedoeroSzamitott}`,
        vedoEroMegjelenitett
    );
    
    // 2. Támadóerő alapértékek
    console.log('\n2. Támadóerő alapértékek');
    console.log('---');
    
    const tamadoKatona = parseInt(document.getElementById('tamado_katona').value) || 0;
    const tamadoTamado = parseInt(document.getElementById('tamado_tamado').value) || 0;
    const tamadoIjsz = parseInt(document.getElementById('tamado_ijsz').value) || 0;
    const tamadoLovas = parseInt(document.getElementById('tamado_lovas').value) || 0;
    const tamadoElit = parseInt(document.getElementById('tamado_elit').value) || 0;
    
    const alapTamadoeroSzamitott = 
        tamadoKatona * EGYSEG_ERTEK.katona.tamado +
        tamadoTamado * EGYSEG_ERTEK.tamado.tamado +
        tamadoIjsz * EGYSEG_ERTEK.ijsz.tamado +
        tamadoLovas * EGYSEG_ERTEK.lovas.tamado +
        tamadoElit * EGYSEG_ERTEK.elit.tamado;
    
    const tamadoEroMegjelenitett = parseInt(document.getElementById('tamado_ero_megjelenites').textContent.replace(/\s/g, '')) || 0;
    
    test(
        'Támadóerő alapérték (minimum)',
        tamadoEroMegjelenitett >= alapTamadoeroSzamitott,
        `>= ${alapTamadoeroSzamitott}`,
        tamadoEroMegjelenitett
    );
    
    // 3. Eredmények ellenőrzése
    console.log('\n3. Eredmények ellenőrzése');
    console.log('---');
    
    const vedoPont = parseInt(document.getElementById('vedopont').textContent.replace(/\s/g, '')) || 0;
    const tamadoPont = parseInt(document.getElementById('tamadopont').textContent.replace(/\s/g, '')) || 0;
    
    test(
        'Védőpont = Védőerő megjelenítés',
        vedoPont === vedoEroMegjelenitett,
        vedoEroMegjelenitett,
        vedoPont
    );
    
    test(
        'Támadópont = Támadóerő megjelenítés',
        tamadoPont === tamadoEroMegjelenitett,
        tamadoEroMegjelenitett,
        tamadoPont
    );
    
    // Eredmények összefoglalása
    console.log('\n=== TESZTELÉSI EREDMÉNYEK ===');
    console.log(`✅ Sikeres: ${results.passed}`);
    console.log(`❌ Sikertelen: ${results.failed}`);
    console.log(`📊 Összesen: ${results.passed + results.failed}`);
    
    if (results.failed > 0) {
        console.log('\nSikertelen tesztek:');
        results.tests.filter(t => !t.passed).forEach(t => {
            console.error(`  - ${t.name}: várt ${t.expected}, kapott ${t.actual}`);
        });
    }
    
    return results;
}

// ============================================================================
// SEGÉDFÜGGVÉNYEK
// ============================================================================

/**
 * Összes teszt futtatása
 */
function runAllTests() {
    console.clear();
    console.log('🚀 TESZTELÉS INDÍTÁSA\n');
    console.log('='.repeat(50));
    
    const buildingResults = testBuildingCalculator();
    console.log('\n' + '='.repeat(50) + '\n');
    const warResults = testWarCalculator();
    
    console.log('\n' + '='.repeat(50));
    console.log('\n📊 ÖSSZESÍTÉS');
    console.log('---');
    console.log(`Épületlista kalkulátor: ${buildingResults.passed}/${buildingResults.passed + buildingResults.failed} sikeres`);
    console.log(`Háború kalkulátor: ${warResults.passed}/${warResults.passed + warResults.failed} sikeres`);
    console.log(`\nÖsszesen: ${buildingResults.passed + warResults.passed}/${buildingResults.passed + buildingResults.failed + warResults.passed + warResults.failed} sikeres`);
}

// Exportálás (ha modulként használjuk)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testBuildingCalculator,
        testWarCalculator,
        runAllTests
    };
}

