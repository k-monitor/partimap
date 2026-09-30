# Térképes feladatok munkalap

A Térképes feladatok munkalap olyan térképalapú kérdőívek készítésére szolgál, amelyekben a kitöltők nemcsak megtekintik a térképet, hanem aktívan rajzolnak is rá. A válaszadók pontok, vonalak vagy területek felrajzolásával adhatják meg válaszaikat, amelyeket további kérdésekkel egészíthetünk ki.

A munkalap segítségével:<br />
📍 kedvenc vagy problémás helyek azonosíthatók,<br />
🚶 útvonalak és mozgási minták térképezhetők fel,<br />
🌳 fejlesztési igények és javaslatok gyűjthetők,<br />
📊 térbeli adatokhoz kapcsolódó strukturált válaszok kérhetők be,<br />
🗺 komplex közösségi térképezési felmérések készíthetők.

## Főbb beállítások

A munkalap szerkesztése során megadható:

#### Munkalap címe

A publikus kérdőív fejlécében jelenik meg, ezért érdemes olyan címet választani, amelyet a kitöltők is láthatnak.

#### Munkalap leírása

A kérdőív elején megjelenő tájékoztató szöveg, amely segíti a kitöltőket a feladat megértésében.

A leírásban lehet:

- Képet beszúrni
- Linket szöveg mögé illeszteni
- Videót beszúrni
- Szöveget formázni: félkövér és dőlt
- Címsor típusokat beszúrni
- Felsorolást készíteni
- Középre, jobbra vagy balra igazítani a szöveget.

> 💡 **Tipp:** Érdemes itt részletesen leírni, hogy pontosan milyen jelöléseket várunk a kitöltőktől.

#### Kereső megjelenítése

A kereső segítségével a térképen címek alapján kereshetjük meg hogy hol szeretnénk a térképünk határát kijelölni. Amennyiben a checkboxot bepipáljuk, a kitöltők is kereshetnek a térképen.

#### Térkép határainak kijelölése

Megtudjuk jelölni a térképen pont/vonal vagy poligon felrajzolása nélkül, hogy melyik területre várjuk a kitöltők értékelését.

#### Térképi elemek importálása

A térképre elemek többféle módon is betölthetők az **Elemek importálása** ablak segítségével:

- **meglévő, a Térképek menüpontban tárolt térképről** – az *Importálás térképről* szekcióban a kívánt térkép kiválasztásával;
- **más munkalapokról** – az *Importálás munkalapról* részen keresztül, a kérdőív és a munkalap kiválasztásával;
- **Térképes feladatok munkalapon beküldött elemekből** – a *Beküldött elemek importálása* funkció használatával;
- **más munkalapokon rögzített fix elemekből** – a *Fix elemek importálása* lehetőséggel;
- **külső forrásból KML-fájl segítségével**.

Az importálási ablakban az egyes forrásokból elérhető importálható elemek száma is megjelenik (pl. „0 elem importálása”, „0 beküldött elem importálása”, „0 fix elem importálása”).

> 💡 **Tipp:** A térkép megjelenési területe és a kitöltők által használható nagyítási tartomány is korlátozható.

### Elemek keresése

A térképeken lehetőség van egy konkrét elem megkeresésére is. A keresés funkcióval az általunk létrehozott térképelemek között kereshetünk.

<figure>
	<img src="/help/sugo/keszites-map-task-sheet.png" alt="Térképes feladatok munkalap felülete" />
	<figcaption>Térképes feladatok munkalap felülete</figcaption>
</figure>

#### Térképes feladatok létrehozása

A **Látogatói interakciók** menüpontban adhatók hozzá a kitöltők számára végrehajtandó térképes feladatok.

Egy feladat mindig egy térképi elem felrajzolását jelenti:

- 📍 pont,
- ➖ vonal,
- 🔷 terület.

A feladatok száma nincs korlátozva, így akár több különböző pont-, vonal- vagy területjelölési feladat is létrehozható.

Az **+ Új térképes feladat** gombra kattintva adhatók meg a feladat részletei.

### Felrajzolandó elem típusa

Kiválasztható, hogy a kitöltő:

- pontot,
- vonalat,
- vagy területet rajzoljon.

### Térképi elemek létrehozása

A szerkesztőfelületen közvetlenül is rajzolhatók admin nézetből elemek, arra az esetre, ha az interakltív térképen is megaakrjuk jeleníteni ezeket az elemeket.

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

#### Feladat egyedi neve

Egy rövid technikai megnevezés, amely:

- megjelenik az adminfelületen,
- szerepel a riportokban,
- alapértelmezetten a felrajzolt elemek neveként is használható.

**Példák:**

- Kedvenc hely
- Problémás hely
- Sétaútvonal
- Veszélyes csomópont

#### Instrukció

A kitöltő számára megjelenő feladatleírás.

**Példák:**

- „Melyik a kedvenc helyed a városban?”
- „Merre közlekedsz a munkahelyedre?”
- „Hol lenne szükség több zöldfelületre?”

Az instrukció a térkép oldalsávjában és a rajzolás közben is látható.

#### Elvárt darabszám (maximum)

Megadható, hogy a kitöltő legfeljebb hány elemet rajzolhat fel.

**Például:**

- legfeljebb 1 kedvenc hely,
- legfeljebb 3 problémás hely,
- legfeljebb 5 útvonal.

A rendszer értesíti a kitöltőt, ha elérte a megengedett mennyiséget.

#### Szín

Beállítható:

- a feladathoz tartozó gomb színe,
- a felugró információs buborék színe,
- a felrajzolt térképi elemek színe.

#### Kiegészítő kérdések

A felrajzolt elemekhez további kérdések kapcsolhatók és a kérdések kötelezővé is tehetők.

#### Felrajzolt elemek elnevezése

Bekapcsolásával a kitöltőnek el kell neveznie az általa felrajzolt elemet.

**Például:**

- „Kossuth tér”
- „Veszélyes kereszteződés”
- „Reggeli kerékpáros útvonalam”

#### Jelölőnégyzetes kérdés hozzáadása

Lehetővé teszi strukturált válaszok gyűjtését.

**Példák:**

| Kérdés | Kérdéstípus | Példa válaszlehetőségek |
| --- | --- | --- |
| **Milyen napszakban használja?** | Zárt, feleletválasztós kérdés | ☐ Reggel (6:00–10:00) ☐ Délelőtt (10:00–12:00) ☐ Délután (12:00–18:00) ☐ Este (18:00–22:00) ☐ Éjszaka (22:00–6:00) |
| **Milyen közlekedési módot használ?** | Zárt, egyszeres vagy többszörös választás | ☐ Gyalog ☐ Kerékpár ☐ Személyautó ☐ Tömegközlekedés ☐ Motor ☐ Roller ☐ Egyéb: |
| **Milyen gyakran jár ide?** | Zárt, gyakorisági skálás kérdés | ☐ Naponta ☐ Hetente többször ☐ Hetente egyszer ☐ Havonta többször ☐ Havonta egyszer ☐ Ritkábban |

> 💡 **Tipp:** A strukturált válaszok megkönnyítik az adatok későbbi elemzését és szűrését.

#### Szöveges kérdés hozzáadása

Szabad szöveges magyarázat kérhető a jelöléshez.

**Például:**

- Miért választotta ezt a helyet?
- Mi a probléma ezen a területen?
- Milyen fejlesztést javasolná?

#### Feltételes megjelenítés

A **Megjelenik, ha...** beállítással a térképes feladatok feltételesen jeleníthetők meg.

**Például:**

- csak női kitöltőknek,
- csak autóval közlekedőknek,
- csak egy adott kérdésre adott válasz esetén.

Ha a munkalapon minden feladat feltételes, akkor azok a kitöltők, akikre a feltétel nem vonatkozik, egyáltalán nem látják a munkalapot.
