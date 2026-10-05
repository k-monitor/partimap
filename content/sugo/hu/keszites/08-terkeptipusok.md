# Térképtípusok

OSM (OpenStreetMap)

A legáltalánosabb térképi nézet.

- utcák, utak és épületek jól láthatók,
- részletes települési információkat tartalmaz,
- városi és általános felmérésekhez ajánlott.

Ha nem tudjuk, melyik alaptérképet válasszuk, ez a legbiztonságosabb választás.

#### CycleOSM

Kerékpáros közlekedésre optimalizált térkép.

- kiemeli a kerékpárutakat,
- megjeleníti a kerékpáros infrastruktúrát és útvonalakat,
- közlekedési és kerékpáros témájú felmérésekhez ideális.

Különösen hasznos kerékpáros hálózatok értékelése vagy tervezése során.

#### Toner

Minimalista, fekete-fehér megjelenésű térkép.

- erős kontrasztot biztosít,
- kevesebb háttérinformációt jelenít meg,
- a saját térképi elemek jobban kiemelkednek.

Akkor ajánlott, ha a hangsúly a felrajzolt pontokon, vonalakon vagy területeken van.

#### Terrain

Domborzati térkép.

- megjeleníti a terepviszonyokat,
- kiemeli a hegyeket, völgyeket és szintkülönbségeket,
- természeti, turisztikai vagy tájhasználati projektekhez hasznos.

Külterületek és természeti területek bemutatására különösen alkalmas.

#### ESRI-WI (Esri World Imagery)

Műholdas és légifelvételeken alapuló térkép.

- a valós felszínt mutatja,
- láthatók az épületek, utak, növényzet és egyéb tereptárgyak,
- fejlesztések vagy területhasználat bemutatására kiváló.

Akkor érdemes használni, ha fontos, hogy a kitöltők a tényleges környezetet lássák.

## Térképi elemek importálása

A térképre elemek többféle módon is betölthetők az **Elemek importálása** ablak segítségével:

- **meglévő, a Térképek menüpontban tárolt térképről** – az *Importálás térképről* szekcióban a kívánt térkép kiválasztásával;
- **más munkalapokról** – az *Importálás munkalapról* részen keresztül, a kérdőív és a munkalap kiválasztásával;
- **Térképes feladatok munkalapon beküldött elemekből** – a *Beküldött elemek importálása* funkció használatával;
- **más munkalapokon rögzített fix elemekből** – a *Fix elemek importálása* lehetőséggel;
- **külső forrásból KML-fájl segítségével**.

Az importálási ablakban az egyes forrásokból elérhető importálható elemek száma is megjelenik (pl. „0 elem importálása”, „0 beküldött elem importálása”, „0 fix elem importálása”).

> 💡 **Tipp:** A térkép megjelenési területe és a kitöltők által használható nagyítási tartomány is korlátozható.

## Térképi elemek értékelése

Bekapcsolható a **Fix elemek értékelése** funkció, amely lehetővé teszi a kitöltők számára a térképi elemek véleményezését.

Két értékelési mód érhető el:

- **Csillagos értékelés** ⭐ (1–10 csillag)
- **Like / Dislike** 👍👎

Az értékelésekhez opcionálisan szöveges indoklás is kérhető:

- szabad szöveges válasz,
- pozitív és negatív szempontok külön megadásával.

### Eredmények megjelenítése

A rendszer képes megjeleníteni:

- az egyes elemek átlagos értékelését,
- az értékelések számát,
- a munkalap kérdéseire adott válaszok összesített statisztikáit.

> 💡 **Tipp:** Beállítható olyan nézet is, ahol a látogatók kizárólag az eredményeket látják, új válaszokat nem küldhetnek be.

### Térképi elemek létrehozása

A szerkesztőfelületen közvetlenül is rajzolhatók elemek:

- **Pont** – egyetlen kattintással helyezhető el.
- **Vonal** – több pont összekapcsolásával rajzolható.
- **Terület (poligon)** – zárt alakzatként hozható létre.

A felrajzolt elemek kinézete részletesen testreszabható:

**Név** – az elem neve.

**Szín** – az elem színének kiválasztása.

**Méret** – az elem méretének megadása.

**Extra kiemelés** – például szürke körvonal hozzáadása a elemhez.

**Átlátszóság** – az elem áttetszőségének szabályozása (0–100%). Terület esetén a terület kitöltési szinét is lehet halványítani.

**Térképen megjelenő címke** – az elem mellett megjelenő felirat szövege.

**Kategória** – az elem kategóriába sorolása.

**Leírás** – részletes szöveges leírás megadása, formázási lehetőségekkel:

- címsorok (H1, H2),
- bekezdés,
- felsorolás,
- igazítás,
- félkövér és dőlt szöveg,
- hivatkozás beszúrása,
- kép és videó beszúrása,
- visszavonás és újra.

**Elem elrejtése a listában** – az elem elrejthető a listanézetből.

**Elem törlése** – a pont törlése.

#### Kategóriák és segédelemek

A térképi elemek kategóriákba sorolhatók, így a kitöltők könnyebben szűrhetnek közöttük.

> 💡 **Tipp:** Egy elem elrejthető az interaktív listából is. Ilyenkor továbbra is látható marad a térképen, de nem kattintható. Ez hasznos például városhatárok vagy egyéb tájékozódást segítő elemek megjelenítésére.

#### Mobilhasználat

Mobiltelefonon és tableten a térkép és az oldalsáv között az elrejtés és megjelenítés gombokkal lehet váltani. A rajzolóeszközök a térkép nézetben érhetők el.

> ⚠️ **Fontos**: A kitöltők számára megjelenő térkép alapértelmezés szerint mindig az összes felrajzolt elemhez igazodó nézetből indul.
