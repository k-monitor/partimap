# Skálán mért változók elemzése

A kérdőívekben gyakran találkozunk olyan kérdésekkel, ahol a válaszadóknak egy értékelő skálán kell véleményt nyilvánítaniuk. Ilyenek például az 1–5-ig vagy 1–10-ig terjedő elégedettségi, egyetértési vagy fontossági skálák.

Az ilyen változók esetében a százalékos megoszlások mellett átlagot is számíthatunk, amely jól összefoglalja a válaszadók általános véleményét.

Átlagot számíthatunk:

- a teljes mintára,
- különböző demográfiai csoportokra (például nem, életkor vagy iskolai végzettség szerint),
- valamint több különböző kérdés összehasonlítására is.

Az átlagok segítségével gyorsan áttekinthetjük, hogy mely csoportok elégedettebbek egy adott szolgáltatással, illetve mely szolgáltatások teljesítenek jobban vagy rosszabbul a válaszadók megítélése alapján.

**Példa:**

Tegyük fel, hogy a kérdőívben a Piac utca 15 különböző szolgáltatásának megítélésére kérdeztünk rá.

A válaszadók minden szolgáltatást egy 1–5-ig terjedő skálán értékeltek, ahol:

- 1 = egyáltalán nem elégedett,
- 5 = teljes mértékben elégedett.

Az egyes szolgáltatások átlagpontszámainak összehasonlításával könnyen megállapíthatjuk, hogy mely szolgáltatásokkal a legelégedettebbek, illetve mely területek igényelnek fejlesztést.

Az alábbi táblázat a 15 szolgáltatás átlagos elégedettségi értékeit mutatja be.

| Szolgáltatás | Átlag |
| --- | --- |
| Közvilágítás | 3,9 |
| Gyalogátkelők helye, kialakítása | 3,3 |
| Járdák állapota | 3,2 |
| Zaj mértéke | 3,1 |
| Közbiztonság | 3,1 |
| Köztisztaság | 3,1 |
| Épületek állapota | 2,9 |
| Padok állapota és mennyisége | 2,9 |
| Információk műemlékekről, nevezetességekről | 2,7 |
| Üzletek és szolgáltatások kínálata | 2,7 |
| Biciklitárolók mennyisége | 2,5 |
| Üzletek kínálatának megfizethetősége | 2,5 |
| Levegőminőség | 2,4 |
| Parkolók mennyisége | 2,4 |
| Növényzet mennyisége | 2,2 |

A példában szereplő adatok alapján megállapítható, hogy a válaszadók a közvilágítással a legelégedettebbek. Az átlagok alapján kedvező megítélést kapott még:

- a gyalogátkelők elhelyezése és kialakítása,
- a járdák állapota,
- a zaj mértéke,
- a közbiztonság,
- a köztisztaság.

Ezzel szemben alacsonyabb értékelést kaptak:

- az épületek állapota,
- a padok állapota,
- az elérhető információk,
- a kínálat.

A legalacsonyabb átlagokat pedig:

- a levegőminőség,
- a parkolók mennyisége,
- valamint a növényzet mennyisége

kapta, vagyis ezek a területek igénylik leginkább a fejlesztést.

## Átlagok összehasonlítása demográfiai csoportok között

Az átlagokat nemcsak a teljes mintára, hanem különböző demográfiai csoportokra is kiszámíthatjuk. Így könnyen megvizsgálhatjuk, hogy egy adott szolgáltatás megítélése eltér-e például nem, életkor vagy jövedelmi helyzet szerint.

Ehhez a megszokott módon hozzunk létre egy Pivot-táblát, majd:

1. jelöljük ki a vizsgált szolgáltatást és a demográfiai változót,
2. a demográfiai változót húzzuk a Sorok területre,
3. a szolgáltatás értékelését pedig csak az Értékek területre helyezzük.

Ezután az Értékmező-beállítások menüpontban, az Értékösszegezési szempont fülön válasszuk az Átlag lehetőséget.

Az elkészült táblázat áttekinthetőségét tovább javíthatjuk feltételes formázással. A táblázat kijelölése után a Kezdőlap → Feltételes formázás → Színskálák menüpontban az értékek nagyságát színekkel is megjeleníthetjük.

| Csoport | Átlag |
| --- | --- |
| Teljes minta | 3,1 |
| Férfi | 3,0 |
| Nő/egyéb | 3,1 |
| 18-29 | 3,0 |
| 30-39 | 3,0 |
| 40-49 | 3,3 |
| 50-64 | 3,1 |
| 65+ | 3,1 |
| Kényelmesen megélünk a jelenlegi jövedelmünkből. | 3,3 |
| Megélünk a jelenlegi jövedelmünkből. | 3,0 |
| Nehezen élünk meg a jelenlegi jövedelmünkből. | 2,8 |
| Alapfokú végzettség) | 3,1 |
| Érettségi | 3,0 |
| Felsőfok (Főiskola, Egyetem) | 3,1 |

## Az eredmények értelmezése

A példában a közbiztonság átlagos megítélését hasonlítottuk össze különböző demográfiai csoportok között.

Az adatok alapján megállapítható, hogy:

- a nehéz anyagi helyzetben élők értékelték a legalacsonyabbra a közbiztonságot;
- a kényelmesen megélők, valamint a 40–49 éves korosztály voltak a legelégedettebbek.

Fontos azonban szem előtt tartani, hogy az átlag önmagában nem ad teljes képet a válaszokról.

Előfordulhat például, hogy két csoport ugyanazt az átlagot éri el, miközben a válaszok eloszlása teljesen eltérő. Egy 3,0-s átlag kialakulhat úgy is, hogy a legtöbben a középső értéket választották, de úgy is, hogy a válaszadók fele a legalacsonyabb, másik fele pedig a legmagasabb értéket jelölte.

Ezért az átlagok értelmezését mindig érdemes a válaszok megoszlásának vizsgálatával is kiegészíteni. A következő lépésben azt nézzük meg, hogyan oszlanak meg a közbiztonság értékelései az egyes korcsoportok között.

|  | 1 - Egyáltalán nem elégedett | 2 | 3 | 4 | 5 - Teljes mértékben elégedett | Végösszeg |
| --- | --- | --- | --- | --- | --- | --- |
| 18-29 | 6% | 21% | 42% | 25% | 6% | 100% |
| 30-39 | 11% | 23% | 31% | 23% | 12% | 100% |
| 40-49 | 12% | 13% | 24% | 38% | 13% | 100% |
| 50-64 | 8% | 26% | 28% | 30% | 9% | 100% |
| 65+ | 5% | 23% | 37% | 28% | 7% | 100% |

Jól látható, hogy az átlag önmagában nem mindig tükrözi a válaszok valódi eloszlását. Bár a korábbi példában a 40–49 évesek átlaga volt a legmagasabb, a részletes megoszlásból az is kiderül, hogy ebben a korcsoportban a legmagasabb azok aránya is, akik 1-es értékelést, vagyis a legalacsonyabb elégedettségi szintet jelölték.

> 💡 **Fontos:** Ahhoz, hogy statisztikailag szignifikáns különbségekről beszélhessünk, vagyis képesek legyünk kizárni azt, hogy pusztán véletlenszerű a különbség két csoport körében mért átlag között, t-próbát szükséges alkalmazni, melynek bemutatásától terjedelmi okokból eltekintünk.

Ez arra utal, hogy a 40–49 éves válaszadók véleménye megosztott: a többség inkább elégedett a közbiztonsággal, ugyanakkor egy jelentős kisebbség (12%) egyáltalán nem érzi biztonságosnak a Piac utcát.

Ez jól mutatja, hogy az átlagok értelmezését mindig érdemes a válaszok megoszlásának vizsgálatával is kiegészíteni.

## Skálák egyszerűsítése

Az ötfokú értékelő skálák elemzésekor gyakran célszerű egyszerűsíteni a válaszkategóriákat. Ennek egyik gyakori módja, hogy:

- az 1-es és 2-es értékeket összevonjuk „inkább nem elégedett” kategóriába,
- a 4-es és 5-ös értékeket összevonjuk „inkább elégedett” kategóriába,
- a 3-as érték pedig önálló, semleges kategóriaként marad meg.

Így az eredeti ötfokú skála helyett egy könnyebben értelmezhető, három kategóriából álló skálát kapunk.

## Elégedettségi egyenleg

Az adatok további egyszerűsítésére használható az úgynevezett elégedettségi egyenleg is. Ennek kiszámításakor az inkább elégedettek arányából kivonjuk az inkább elégedetlenek arányát.

Az így kapott mutató gyorsan megmutatja, hogy egy adott csoportban inkább pozitív vagy inkább negatív a szolgáltatás megítélése.

Az értékek értelmezése egyszerű:

- pozitív érték: többen elégedettek, mint elégedetlenek;
- negatív érték: többen elégedetlenek, mint elégedettek;
- 0 körüli érték: közel azonos az elégedettek és elégedetlenek aránya.

Ez a mutató különösen akkor hasznos, ha sok demográfiai csoportot szeretnénk gyorsan összehasonlítani, mivel első pillantásra jól láthatóvá teszi a legpozitívabb és legkritikusabb csoportokat.

Bár az elégedettségi egyenleg megkönnyíti az elemzést és az összehasonlítást, az eredmények bemutatásakor érdemes visszatérni az eredeti ötfokú, vagy az abból képzett háromfokú skálához. Ez sokkal könnyebben értelmezhető az olvasók számára.

Például az egyenleg helyett célszerűbb úgy megfogalmazni az eredményeket, hogy:

*A válaszadók megosztottak a közbiztonság megítélésében: 37%-uk inkább elégedett, míg 30%-uk inkább elégedetlen.*
