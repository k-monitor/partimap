## Segítség felmérés készítéséhez {#adminsugo}

Az alábbiakban a PARTIMAP admin felületének működését mutatjuk be.

> **&#9432;** **Ha belevágnál, de segítségre van szükséged, kérj tőlünk ingyenes konzultációt a <hello@partimap.eu> címen!**

- [**Regisztráció**](#regisztracio)
- [**Új kérdőív létrehozása és korábbiak kezelése**](#ujkerdoiv)
- [**Kérdőív adatlap**](#kerdoivadatlap)
- [**Munkalapok listája**](#munkalap)
- [**Munkalapok típusai**](#munkalapok)
- [**Térképek létrehozása és korábbiak kezelése**](#terkepek)
- [**Riport és eredmények**](#riport)
- [**Tippek egy kérdőív elkészítéséhez**](#tippek)

### Regisztráció {#regisztracio}

[Regisztrációt](/register) követően bárki teljes körűen és ingyenesen használhatja az alkalmazást. A PARTIMAP jelenleg magyar, [angol](/en), [litván](/lt), [német](/de) és [spanyol](/es) nyelven érhető el, a nyelvek között a jobb felső sarokban lévő (<i class="fas fa-globe fa-fw"></i>) gombbal lehet váltani. Ha más nyelven használnád a programot, és segítenél a fordításban, keress minket a <hello@partimap.eu> címen!

Az admin felületen lehetőség van új felméréseket készíteni, korábbiakat módosítani ([**Kérdőívek**](/admin/projects)), illetve szerkeszteni a felmérésekhez kapcsolódó térképeket ([**Térképek**](/admin/maps)).

### Új kérdőív létrehozása és korábbiak kezelése {#ujkerdoiv}

Új kérdőív a belépést követően a Kérdőívek oldalon, a **felmérés elnevezésének megadásával** hozható létre a _Hozzáadás_ gombra kattintva.

<div class="row mb-5">
	<div class="col-12 col-lg-10 mx-auto mt-4">
		<figure class="figure">
			<img
				alt="Kérdőív létrehozása"
				class="figure-img img-fluid rounded shadow-sm"
				src="/help/project.png"
			>
			<figcaption class="figure-caption text-center">
				Kérdőív létrehozása
			</figcaption>
		</figure>
	</div>
</div>

A Kérdőívek menüpontban megtalálható a saját kérdőívek listája. Itt látható a megtekintések és kitöltések száma, és a **Riport letöltése** gombra kattintva .xlsx formátumban letölthető a kitöltésekből generált [riport](#riport).

A kérdőívlistában a kérdőív melletti **⋮** -ra kattintva a felesleges kérdőívek törölhetők, illetve a Másolat készítésére kattintva másolható a benne összegyűjtött válaszok törlésével. Így a teszteléskor beküldött felesleges válaszok nélkül indíthatjuk el a nyilvános felmérést.

### Kérdőív adatlap {#kerdoivadatlap}

A [Kérdőívek](/admin/projects) menüpontból a listában a kérdőív nevére kattintva, vagy új kérdőívet létrehozva a kérdőív adatlapjára jutunk. Itt adhatók meg a felméréshez kapcsolódó adatok, kérdések és tartalmak.

Ez két részből áll: az oldal felső részén a felméréshez kapcsolódó általános adatok adhatóak meg, a második felében a munkalapok szerkesztésére van lehetőség.

A kapcsolódó adatoknál és beállításoknál van lehetőség

- megadni a felmérés elnevezését, ami az adminfelületen túl a böngésző lapcímében és a közösségi médiában megosztáskor jelenik meg;
- szerkeszteni az elérési útvonalát (URL címét - <code>https://partimap.eu/hu/p/*</code>),
- jelszavas védelmet beállítani, amivel szűkíthető a kitöltők köre. Ilyenkor a kérdőív URL-jére navigálva az oldal jelszót kér, ennek megadás után lehet kitölteni a kérdőívet. Ha nem szeretne több kitöltést fogadni, jelszó beállításával passziválhatja is a kérdőívet;
- Facebook megosztáshoz egyedi meta leírást (előnézeti szöveget) adni,
- Facebook megosztáshoz egyedi képet feltölteni;
- az adatkezelő elérhetőségét megadni, ez az adatkezelési nyilatkozatban jelenik meg;
- a kitöltés végén (a beküldés után) megjelenő egyedi köszönő üzenetet (Köszönetnyilvánítás) és tovább navigáló linket (Tovább URL) megadni, valamint a kitöltés végén a felmérés megosztására felhívó gombokat (Facebook, Twitter, e-mail) ki- és bekapcsolni.
- egyedi (óránkénti) vagy napi e-mail értesítést kérni a felmérésre érkező válaszokról (Feliratkozás kitöltésekre).

### Munkalapok listája {#munkalap}

A kérdőív munkalapokra tagolódik. Az egyes munkalapok szerkesztőfelületén lehet beállítani különböző kérdőívkérdéseket, tájékoztató szövegeket és kitöltői interakcióra felhívó térképes feladatokat.

A munkalapok a felméréshez kapcsolódó általános beállítások alatt szerkeszthetőek. Új kérdőív esetében ez a rész egy alapértelmezetten hozzáadott szöveges munkalapot tartalmaz. A _Munkalap hozzáadása_ gombra kattintva lehet elkezdeni a kérdőív tartalmának szerkesztését. A már létrehozott munkalapok listanézete is itt érhető el.

<div class="row mb-5">
	<div class="col-12 col-lg-10 mx-auto mt-4">
		<figure class="figure">
			<img
				alt="Munkalapok listája"
				class="figure-img img-fluid rounded shadow-sm"
				src="/help/sheets.png"
			>
			<figcaption class="figure-caption text-center">
				Munkalapok listája
			</figcaption>
		</figure>
	</div>
</div>

Ha már több munkalapot is tartalmaz a kérdőív, a fel és le nyilakkal változtatható a munkalapok sorrendje, a kuka ikon pedig törli a szükségtelen munkalapot.

A munkalap típusát (_Szöveg - Kérdéssor - Kérdéssor térképpel - Térképes feladatok_) a piktogramokra kattintva lehet kiválasztani

<div class="row mb-5">
	<div class="col-12 col-lg-10 mx-auto mt-4">
		<figure class="figure">
			<img
				alt="Új munkalap hozzáadása"
				class="figure-img img-fluid rounded shadow-sm"
				src="/help/newsheet.png"
			>
			<figcaption class="figure-caption text-center">
				Új munkalap hozzáadása
			</figcaption>
		</figure>
	</div>
</div>

Az első munkalapon (annak típusától függetlenül) a kitöltőnek el kell fogadnia a felhasználási feltételeket és az adatkezelési tájékoztatót. Első munkalapként érdemes Szöveg munkalapot megadni, ahol tisztázhatjuk a felmérés kereteit (pl. a kitöltés várható hossza, kitöltésre jogosultak köre), illetve a felmérés célját, a lebonyolító kilétét.

A kérdőív adatlap jobb felső sarkában található **Megtekintés** gombra kattintva közvetlenül az épülő kérdőívre léphetünk, nyomon követve a mentett változtatásokat. Érdemes a kérdőív szerkesztésekor itt a szerkesztővel párhuzamosan követni a módosításokat.

### Munkalapok típusai {#munkalapok}

A munkalapok szerkesztőfelületén a kérdőívhez hasonlóan a modul alján lévő kék gombokkal lehet lépkedni a szerkesztés alatt álló munkalapok között. A **↗** ikonnal a munkalapról közvetlenül a felmérés kitöltők számára is látható lapjára ugorhatunk. Az utolsó hozzáadott munkalapon a zöld **+** gombbal közvetlenül, a kérdőívadatlapra visszalépés nélkül is munkalapokat adhatunk a kérdőívhez. A bal felső **PARTIMAP ikonra** kattintva visszaléphetünk a kérdőívadatlapra.

> ⚠️ Figyelem, a változtatások rögzítéséhez meg kell nyomni a **_Mentés_** gombot, erre más oldalra navigálás esetén felugró ablak is figyelmeztet. Az elmentett módosítások közvetlenül megjelennek a kitöltők számára látható felmérésben, a kérdőívadatlapnál beállított webhelyen.

#### Szöveg munkalap {#szoveges}

Szöveg és képek megjelenítésére alkalmas munkalap, ahol többek közt a felmérés céljait, a lebonyolító szervezet vagy intézmény tevékenységét, a döntési helyzet hátterét és a részvételi folyamat lépéseit lehet ismertetni. Ahhoz, hogy ezt a felmérés elején meg lehessen tenni, egy szöveges munkalapot automatikusan hozzáadunk a létrehozott kérdőívhez.

A munkalap szerkesztése során megadhatók:

- A _Munkalap címe_, amely megjelenik a publikus kérdőív fejlécében is;
- A _Munkalap leírása_, amely a megjelenő párbeszédablak fő szövege. A szöveg alapvető formátumbeállítási lehetőségekkel testre szabható, lehetőség van link, illetve kép, videó beszúrására is (külső forráslink megadásával);
- _Háttérkép_, amely a párbeszédablak mögötti teret tölti ki;
- A felmérés közösségi médiás megosztására felhívó gombok (_Látogatói interakciók: Megosztás gombok_).

#### Kérdéssor munkalap {#kerdessor}

A Kérdéssor munkalap segítségével hagyományos kérdőíves felméréseket készíthetünk. A munkalap szerkesztése során megadhatók:

- A _Munkalap címe_, amely megjelenik a publikus kérdőív fejlécében is;
- A _Munkalap leírása_, amely a párbeszédablak elején jelenik meg. A szöveg alapvető formátumbeállítási lehetőségekkel testre szabható, lehetőség van link, illetve kép beszúrására is a Szöveg munkalaphoz hasonlóan. Kép hozzáadásával lehetőség van a képre vonatkozó kérdések feltételére;
- _Kérdések:_ a munkalaphoz itt van lehetőség kérdőívkérdések hozzáadására, amelyek tulajdonságai a megjelenő párbeszédablakban szerkesztők;
- _Kitöltés után válasz statisztika megjelenítése a látogatónak (minden kérdést módosít):_ a kitöltést követően, lapozás után a látogató számára megjelenik mindegyik kérdőívkérdés válaszának összesített statisztikája oszlopdiagramon. A megmutatott eredmények kérdésenként is engedélyezhetőek a Kérdőív modul párbeszédablakában;
- _Csak az eredmények megjelenítése:_ bejelölve a munkalap kérdései lezárulnak, nem gyűjtenek válaszokat. Ezen a munkalapon csak az eredmények lesznek láthatóak a kitöltők számára. Ez lehetőséget ad arra, hogy a lezárt kérdőívet a link megtartásával egy, az eredményeket bemutató kérdőívvé alakítsuk át;
- _Saját háttérkép_, amely a párbeszédablak mögötti teret tölti ki;
- A felmérés _megosztására felhívó gombok_. Ezt az utolsó, gyakran demográfiai kérdéseket tartalmazó munkalap esetén érdemes bekapcsolni.

A _Kérdések_ blokkhoz az alábbi kérdéstípusok adhatók a _Kérdés szövege_ megadásával:

_Szöveges válasz:_ a szövegmezőbe a kitöltő tetszőleges választ gépelhet. Az eredményriport ezt a szöveges választ tartalmazza.

> Tipp: ha három kulcsszót szeretnél válaszként gyűjteni, illessz be egy szöveges kérdést "Adj meg három kulcsszót" kérdésszöveggel, majd illessz be két szöveges válasz kérdést kérdésszöveg nélkül!

_Numerikus válasz (bepötyögős):_ a mezőbe a kitöltő egy számot gépelhet. Beállítható a megadható válasz minimális és maximális értéke. A riport a választ szám formátumban tartalmazza.

_Numerikus válasz (csúszkával):_ a kitöltő itt gépelés nélkül, egy csúszka segítségével állíthatja be számszerű válaszát. Itt is megadhatod a megadható válasz minimális és maximális értékét. A két véglet szövegesen is elnevezhető, ez a kérdőívben a csúszka két oldalán jelenik meg, skálát képezve. A riport a választ szám formátumban tartalmazza.

_Jelölőnégyzetek:_ az Opcióknál az _Új opció_ gombra kattintva tetszőleges számú válaszlehetőséget lehet megadni, amelyre a kitöltő egyedileg adhat választ a négyzet bejelölésével. Beállítható a maximálisan kiválasztható válaszok száma. Az _Egyéb opció hozzáadása_ bejelölésével a válaszok között egy Egyéb... opció is megjelenik, amit megjelölve a kitöltő saját szöveges választ adhat a kérdésre. A riport a megjelölt válaszopciók nevét és a megadott saját egyéb választ tartalmazza szöveges formában, pontosvesszőkkel elválasztva.

_Feleletválasztós:_ az Opcióknál az _Új opció_ gombra kattintva tetszőleges számú válaszlehetőség adható meg, ezek közül a kitöltő egyet választhat. A riport a válaszopció nevét szöveges formában tartalmazza.

_Opciók lenyíló listában (egyet lehet vál.):_ a feleletválasztóshoz hasonlóan a megadott Opciók közül a kitöltő egyet választhat egy lenyíló listából. Az Opciók mellé itt is megadhatunk Egyéb... opciót. A riport a válaszopció nevét szöveges formában tartalmazza.

_Értékelés (5 csillag):_ a kitöltő egyszerű kattintással 1-5 csillaggal adhat visszajelzést a megadott kérdésre. A riport a választ szám formátumban tartalmazza.

_Feleletválasztós rács_: a feleletválasztós kérdéstípushoz hasonló, azonban itt több kérdés (Sor) is megadható, ezekre nézve kérjük a kitöltőt, hogy jelölje be valamelyik válaszopciót (Oszlop). A kérdéshez tetszőleges számú sor és oszlop adható. Amennyiben kötelező megválaszolni, minden sorra nézve be kell jelölni valamelyik opciót. A riport soronként szétbontva tartalmazza a válaszopció nevét szöveges formában.

_Jelölőnégyzetrács:_ a jelölőnégyzetek kérdéstípushoz hasonlóan egy Sorhoz a kitöltő több válaszopciót is bejelölhet, ezeket az _Új oszlop_ gombra kattintva állíthatjuk be. A kérdéshez tetszőleges számú sor és oszlop adható. Amennyiben kötelező megválaszolni, minden sorra nézve be kell jelölni legalább egy opciót. A riport soronként szétbontva tartalmazza a válaszopciók nevét szöveges formában, pontosvesszőkkel elválasztva.

_Adott számú egység elosztása (súlyozás):_ a kérdéstípussal arra kérhetjük a kitöltőt, hogy megadott számú - a Kérdés szövegében meghatározható - egységet (Elosztandó egységek száma) osszon szét a megadott opciók között. A kitöltőnek a megadott egységeket mind ki kell osztania, a riport opciónként tartalmazza a megadott értékeket. A kérdéstípust különböző területek, témák, problémák fontosságának pontos felmérésére (súlyozására) használhatjuk.

Az egyes kérdések a _Kötelező megválaszolni_ bepipálásával kötelezővé tehetők a kitöltőknek, enélkül nem tudnak továbblépni, vagy beküldeni a választ.

Az egyes kérdések a _Válaszok hozzáadása a térképes jelölésekhez elemzés céljára_ opció bepipálásával hozzáadhatóak paraméterként az esetlegesen ugyanezzel a kérdőívvel gyűjtött térképes jelölésekhez. Így az ezt tartalmazó .kml file elemeiben elérhető lesz a hozzáadott kérdés szövege és a rá adott válasz (_partimapQuestion_... névvel). Így a térképes válaszok szűrhetővé válnak nem, kor stb. szerint, amennyiben a felmérés tartalmaz erre vonatkozó kérdőívkérdést.

A kérdések megjelenítése függővé tehető egy (sorrendben korábbi) kérdésre adott kitöltői választól. A feltételesség a kérdés párbeszédablakában a (_Megjelenik, ha..._) opciót kiválasztva állítható be. Figyelem, a feltételes kérdés (**⮥**) ezt követően nem mozgatható a feltételt adó kérdés (**⮢**) elé, illetve az ezeket tartalmazó munkalapok sorrendje sem fordítható meg a kérdőívadatlapon! A feltételt adó kérdések ezen felül nem törölhetők, válaszopcióik nem módosíthatók.

> **&#9432;** A feltételes kérdésekkel lehetőség van optimalizálni a kérdőív hosszát: pl. az autóhasználatra vonatkozó kérdéseket csak azok számára megjeleníteni, akik jelezték, hozzáférnek autóhoz.

A munkalap szerkesztőfelületének _Kérdések_ blokkjában (a kérdések listájában) a kérdések a kuka ikonra kattintva törölhetőek, illetve sorrendjük a kérdés fiókjára kattintva, vonszolással módosítható.

#### Kérdéssor térképpel munkalap {#statikus}

> **&#9432;** A munkalap segítségével olyan térkép alapú felmérés készíthető, amely alkalmas egy állapot, megvalósult fejlesztés vagy terv bemutatására, valamint az ezzel kapcsolatos értékelések, visszajelzések gyűjtésére. A kitöltőket itt arra kérjük, hogy a térképen látottakhoz kapcsolódóan válaszoljanak a feltett kérdésekre, de szemben a _Térképes feladatok_ munkalappal, ők nem rajzolhatnak a térképre.

A Térkép munkalap létrehozásakor a térkép tartalmát egy már meglévő, a Térképek menüpontban tárolt térképről is importálhatjuk (_Térkép elemek másolása innen_). A létrehozott munkalap _Térkép elemei_ menüpontjában is bármikor lehetőség van importálásra egy, a Térképek között tárolt térképről, illetve bármely más saját felmérés munkalapján tárolt fix, illetve _Térképes feladatok_ munkalapjára a kitöltők által beküldött elemekből. Elemeket tölthetünk fel a térképre továbbá külső forrásból (pl. Google Maps) egy [.kml file](https://hu.wikipedia.org/wiki/Keyhole_Markup_Language) segítségével. A térkép mozgatásáról a [Térképek menüpont](#terkepek) bemutatásánál található bővebb leírás.

A munkalap szerkesztése során megadhatók:

- A _Munkalap címe_, amely megjelenik a publikus kérdőív fejlécében is;
- A _Munkalap leírása_, amely a párbeszédablak elején jelenik meg. Itt érdemes tömören elmagyarázni, mi a kitöltő feladata az adott munkalapon. A szöveg alapvető formátumbeállítási lehetőségekkel testre szabható, itt is lehetőség van link és képek beszúrására.
- _Kérdések:_ a munkalap egészéhez itt is lehetőség van kérdőívkérdések hozzáadására, amelyek a [Kérdéssor munkalap leírásánál](#kerdessor) megismert módon a megjelenő párbeszédablakban szerkeszthető. A kérdőívkérdések a kitöltők számára az oldalsávban, a leírás alatt jelennek meg. A kérdések között beállított függőségek az ezen a munkalapon megadott kérdésekre is vonatkoznak.
- _Látogatói interakciók:_ ha a _Fix elemek értékelése_ be van jelölve, a kitöltők értékelhetik a térképre felrajzolt elemeket. A feladat részletei a felugró popup ablakban határozhatóak meg. A feladatot utólag is módosíthatjuk a kék **⚙** ikonra kattintva.
    - Kétféle értékelés választható (_Értékelés típusa:_)
        - _Csillagok:_ a kitöltő ekkor az elemre kattintva csillagokkal értékelhet. A csillagok száma beállítható (1-10), ha egy csillagot választunk, az igen-nem válaszként használható. Az értékeléshez nem tartozik munkalapszintű kérdés, az ehhez tartozó instrukciót átfogóan a munkalap leírásában, vagy egyedileg az elem leírásában kell megadnunk. Ha a válasz statisztika be van állítva, az elemeknél lapozás után a csillagok átlaga és az értékelések száma jelenik meg a kitöltőknek -- ez az admin felületen alapértelmezetten látható.
        - _Like/dislike:_ a kitöltő pozitív (<i class="fas fa-fw fa-thumbs-up text-success"></i>) vagy negatív (<i class="fas fa-fw fa-thumbs-up fa-flip-both text-danger"></i>) értékelést adhat elemekhez. Ha a válasz statisztika be van állítva, az elemeknél lapozás után a pozitív és negatív értékelések száma jelenik meg a kitöltőknek -- ez az admin felületen alapértelmezetten látható.
    - _Szöveges indoklás az értékeléshez:_ ezt bejelölve az elemekhez adott csillagos vagy Like/dislike értékeléshez kapcsolódóan egy szöveges kérdés is megjelenik, amiben arra kérhetjük a kitöltőt, hogy világítsa meg értékelése indokait, hogy jobban megértsük az értékelt elemek népszerűségének vagy elutasítottságának indokait. Kétféle szöveges indoklás közül választhatunk:
        - _Szöveges válasz:_ ez a szöveges válasz kérdéstípushoz hasonlóan egy szövegmezőt ad fel, a kérdés szövegét (minden értékelendő elemre nézve) a _Kérdés a szöveges indokláshoz_ mezőben adhatjuk meg.
        - _Szempontok mellette / ellene:_ ezt kiválasztva az értékelés megadása után két szövegmező jelenik meg - a kitöltő megadhat az értékelt dologgal kapcsolatos pozitív (Szempontok mellette) és negatív (Szempontok ellene) érveket, indokokat.
        - _Értékelés eredmények megjelenítése:_ ezt kijelölve csak az elemekhez kapcsolódó értékelések átlagát (1 csillag esetén az adott csillagok összesített számát) mutathatjuk meg a kitöltőknek a munkalapról továbblépés után.
        - A riport az értékelések adatait egy külön Értékelések munkalapon jeleníti meg, ami tartalmazza a kitöltés azonosítóját, amivel az értékelés más válaszokhoz társítható, illetve az értékelt elem nevét és az értékelést szám formátumban (csillagok száma, [1, -1]). Emellett a generált riport egy Összesített értékelések munkalapon az értékelések összesített számát és átlagát is bemutatja.
- _Kitöltés után válasz statisztika megjelenítése a látogatónak:_ ha be van jelölve, lapozás után a látogató számára megjelenik a válaszok összesített statisztikája: az elemekhez rendelt értékelések átlaga _és_ a munkalapszintű kérdőívkérdések eredményei is! Az értékelt elemek fiókjai az értékelés sorrendjébe sorolódnak. A kérdőívkérdések eredményének láthatósága egyedileg is állítható.
    -      *Csak az eredmények megjelenítése:* ha be van jelölve, a munkalap nem gyűjt válaszokat, csak a válaszok statisztikája lesz látható a kitöltők számára.
- _Alapértelmezett alaptérkép:_ itt állítható be a térképre rajzolt elemek mögött megjelenő alaptérkép (pl. úthálózat, szatellit, fekete-fehér, kerékpárutak, topográfiai stb.) A kitöltők maguk is válthatnak az alaptérképek között.
- _Térkép elemei:_ itt jelennek meg az alaptérképre felrajzolt elemek. Az elemekhez tartozó fiókokban szerkeszthető az a tartalom, ami a kitöltők számára az adott elemre vagy a fiókra kattintva megjelenik. Az elemekhez tartozó fiókban név, szín, méret, stílus és képes leírás állítható be.
    - A _Kategória_ mezőt kitöltve a térkép elemeit a kitöltők leszűrhetik az adott kategóriára. A kategória beállításával elkülöníthetőek egymástól és könnyebben elemezhetők különböző elemek.
    - Az _Elem elrejtése a listában_ bejelölésével az adott elem megjelenik ugyan a térképen, de nem lehet vele interaktálni: nem jelenik meg a Térkép elemei között fiókként és a térképen sem lehet belekattintani. Ez akkor hasznos, ha egy olyan segédelemet rajzolunk a térképre, ami csak orientálja a kitöltőket, pl. egy város határvonala.
- Az elemlista felett található KML gombok segítségével lehetőség van más szerkesztőfelületen készített térkép betöltésére (<i class="fas fa-fw fa-upload"></i>) vagy a térkép elemeinek lementésére (<i class="fas fa-fw fa-download"></i>).

A _Kérdéssor térképpel_ munkalap szerkesztőfelületén a jobb felső sarokban található _pont, vonal_ és _terület_ gombokkal közvetlenül is lehet elemeket felrajzolni a munkalapon megjelenített térképre. A térképre tetszőleges számú elem felrajzolható. A térképre a +/- gombokkal vagy kétujjas nagyítással közelíthetünk.

_Pont felrajzolása (piros):_ a piros alapon fehér gombostűre kattintva helyezhető el pont jelölő. A jelölőt egyszeri kattintással helyezhetjük el.

_Vonal felrajzolása (kék):_ a kék alapon fehér vonalra kattintva lehet vonalat rajzolni. Egyszeri kattintással helyezze le a vonal kezdőpontját a térképen, további kattintásokkal jelölje be a vonal köztes pontjait, majd dupla kattintással a végpontot.

<div class="row mb-5">
	<div class="col-12 col-lg-10 mx-auto mt-4">
		<figure class="figure">
			<img alt="Vonal felrajzolása" class="figure-img img-fluid rounded shadow-sm" src="/help/line.png">
			<figcaption class="figure-caption text-center">
				Vonal felrajzolása
			</figcaption>
		</figure>
	</div>
</div>

_Terület felrajzolása (zöld):_ a zöld alapon fehér körbezárt alakzatra kattintva lehet területet (poligont) felrajzolni. Egyszeri kattintással helyezze el az alakzat kezdőpontját a térképen, majd további kattintásokkal jelölje ki a határokat, végül a kezdőpontba történő újbóli kattintással fejezze be a rajzolást.

> **&#9432;** A látogatók számára megjelenő térkép kiindulásul mindig a térképre felrajzolt elemek összességére fókuszál.

_Felrajzolt elemek kinézetének alakítása:_ utólag alakíthatjuk a felrajzolt vagy importált elemek kinézetét a hozzájuk kapcsolódó fiókban.

- A _Név_ a munkalapon a fiók fejlécében is megjelenik (_Térképes feladatok_ munkalapon nincsenek fiókok, ott az elemek csak a térképen jelennek meg).
- A _Méret_ a pont nagyságát, vagy a (határoló) vonal vastagságát jelenti. Az elemek tényleges mérete attól is függ, hogy mennyire közelítettünk rájuk.
- Vonal vagy terület esetén kiválaszthatjuk a határoló _Vonal stílusát_ is.
- Az _Extra kiemeléssel_ a felrajzolt elemhez fekete, szürke, fehér vagy saját színű extra körvonal adható, feltűnőbbé és egyedibbé téve azt.
- _Átlátszóság_: itt az elem - terület esetén külön a körvonal és a kitöltés - átlátszóságát állíthatjuk be. Ha az érték 0, az elem nem látszik a térképen, de pl. az eredeti zoom beállításához a térkép figyelembe veszi.
-

- _Térképen megjelenő címke:_ minden felrajzolt elemhez adható szöveges címke. Ez az elem méretének és színének megfelelően viselkedik - kizoomolással egy idő után eltűnik. A megjelenített címke elforgathat. A címke kezeli a sortörést, benne emojik is elhelyezhetők. Segítségével magyarázatokat, számozást, ikonokat helyezhetünk el a térképen, segítve a kitöltők dolgát.

_Mobilnézet:_ amennyiben táblagépen vagy mobiltelefonon használja a szerkesztőfelületet, a térképes munkalapok esetén a kérdéseket tartalmazó panel és a térkép között az elrejt (<<) és a kinyit (>>) gombokkal lehet váltani. A rajzoláshoz szükséges gombok a térkép nézetben érhetőek el, az oldalsáv elrejtésével.

#### Térképes feladatok munkalap {#interaktiv}

Ezen a munkalapon a kitöltők válaszatikat a térképre rajzolva adhatják meg. A _Munkalap címe_ és a _Munkalap leírása_ kell tartalmazza azokat az információkat, amelyek segítik a kitöltőt, hogy pontos választ adjon a feltett kérdésre.

A _Látogatói interakciók_ menüpontban lehet meghatározni a munkalapon a kitöltőknek adott feladatokat. Ez valamilyen elem (pont, vonal, terület) felrajzolását és az ehhez kapcsolódó, kiegészítő kérdések megválaszolását jelenti. A feladatok száma és típusa korlátlanul megadható, tehát két különböző, pont felrajzolását előíró feladatot is meghatározhatunk.

Az _+ Új térképes feladat_ gombra kattintva, a felugró ablakban határozhatjuk meg a pontos feladatot:

- Kiválaszthatjuk a felrajzolandó elem típusát
- A _Feladat egyedi neve_ rövid meghatározás (pl. Sétaút, Jó hely, Rossz hely), amivel a riportban azonosíthatjuk a feladathoz érkező jelöléseket, illetve ez jelenik meg alapbeállításként a felrajzolt elemek neveként.
- _Instrukció pont felrajzolásához_: az itt megadott szöveg jelenik meg a kitöltő számára a térkép oldalsávjában a feladathoz tartozó gomb mellett, és a jelölés közben is látható.

**&#9432;** pl. Melyik a kedvenc helyed? [pont], Merre közlekedsz a munkahelyedre? [vonal], Hol lenne szükség több zöldfelületre? [terület]

- _Elvárt darab (max.):_ legfeljebb ennyi elemet adhatnak meg a kitöltők a feladathoz. Ha elérik ezt a számot, erről értesítést kapnak.
- _Szín:_ a feladathoz tartozó gomb, szövegbuborék és a felrajzolt elem színe határozható meg itt.
- _Felrajzolt elemek elnevezése:_ a jelölőnégyzet bejelölésével a feladat részévé válik, hogy a kitöltő elnevezze a felrajzolt elemet. Ez és a további kapcsolódó feladatok a felrajzolás után jelennek meg.
- _Jelölőnégyzetes kérdés hozzáadása:_ a jelölőnégyzet bejelölésével - opcionálisan meghatározható számú, egyéb válaszlehetőséget is tartalmazó - kérdést adhatunk a feladathoz. Ez a kérdés segíti a térképes válaszok elemzését, hiszen a szöveges válaszból fakadó bizonytalanság nélkül szűrhetővé válnak egyes, a felrajzolt helyzethez kapcsolódó attribútumok (pl. milyen napszakban történik, milyen járművel stb.)
- _Szöveges kérdés hozzáadása:_ a jelölőnégyzet bejelölésével szöveges kérdést adhatunk a felrajzolt elemhez, amellyel értelmezést, indoklást kérhetünk a jelöléshez.
- _Megjelenik, ha...:_ Ezzel a fentiekben meghatározott feladatokat a kérdőívkérdéshez hasonlóan feltételesen megjelenítendővé tehetjük egy kérdőívkérdésre adott választól függően. Például csak női kitöltőknek, vagy csak egy bizonyos járművet használóknak mutathatjuk meg a feladatot. Ha a munkalapon nincs más feladat, az egyáltalán nem jelenik meg azoknak a kitöltőknek, akikre a feltétel nem vonatkozik.

A fenti paraméterek beállítása után, a Mentés gombra kattintva lezárhatjuk a feladatot. A feladatok nevére kattintva később módosíthatjuk a feladatot, vagy törölhetjük azt.

Az oldalsáv alsó felében a _Térkép elemei_ a _Kérdéssor térképpel_ munkalaphoz hasonlóan az adminfelületen hozzáadott (felrajzolt vagy feltöltött) elemek listáját tartalmazza.

> **&#9432;** A _Kérdéssor térképpel_ munkalaphoz hasonlóan itt is lehetősége van elemeket felrajzolni a térképre, amivel orientálhatjuk a kitöltőket. Pl. jelezhető velük, milyen területen, zónákon belül várjuk az elemek felrajzolását. Megadásuk azért is hasznos, mert **a térkép automatikusan ezekre az elemekre közelít.** Az elemhez adott címke ebben az esetben is megjelenik a térképen, a leírás azonban nem az oldalsáv fiókjaiban, hanem a térképen, az elemre kattintva megnyíló ablakban jelenik meg.

Amennyiben egy térképre már érkeztek kitöltők által felrajzolt elemek, ezek a kérdőív adatlapján, a listában a munkalap melletti _Új saját térképre küldés_ linkkel exportálhatók saját térképre, ahol böngészhetők, szerkeszthetők vagy külső felhasználásra .kml formátumban letölthetők. Az .xlsx riport is tartalmazza a beküldött elemek adatait (kitöltés azonosítója, koordináták, leírás). Ha nem akarjuk letölteni az adott állapotban összegyűjtött válaszokat, csak böngésznénk azokat, a kérdőívadatlapon a _Térképes feladatok_ munkalap alatti kék gombra (**👁**) kattintva megtekintés, illetve letöltés céljából megnyithatjuk a beküldött elemeket. A felületen az elemek a válaszokból származtatott kategória szerint szűrhetők, törölhetők. Letöltéskor a térképen látható, leszűrt elemek kerülnek az exportba. A törlés nem módosítja a tárolt válaszokat.

### Térképek létrehozása és korábbiak kezelése {#terkepek}

A <a href="/admin/maps" target="_blank">Térképek</a> menüpontban saját térképes jelölések (.kml formátumú shapefile-ok) tárolhatók és szerkeszthetők. Itt lehet gyűjteni és szerkeszteni a felhasználó városáról, környezetéről korábban készített térképeit, és a kérdőívekből összegyűjtött válaszokat. A .kml formátumú file-ok segítségével külső térképszerkesztő programokba egyszerűen exportálhatók az itt tárolt elemek, és onnan a PARTIMAP-ba importálhatók térképek. Az _Importálás_ gombra kattintva a Térképre betölthetők bármely más saját felmérés jelölései, beérkezett kitöltői jelölései.

A PARTIMAP jelenleg nem kínál grafikus elemző funkciókat, de a saját térképen az egyedi elemek szerkeszthetők: név és leírás mellett a kinézetük (szín, méret, vonalak esetén a vonal stílusa) egyedileg beállítható.

Új saját térkép létrehozása:

- A <a href="/admin/maps" target="_blank">Térképek</a> oldalon az Új térkép elnevezése megadásával a _Hozzáadás_ gombra kattintva. Ide .kml fájlból adatot lehet betölteni a szerkesztőfelületen;
- Egy felmérés kitöltőinek beküldéseiből a kérdőív adatlapon a vonatkozó munkalap sorában megjelenő _Új saját térképre küldés_

A PARTIMAP felmérés kitöltéseit tartalmazó .kml kategóriaként tartalmazza a jelölések típusát, így külső elemző program segítségével, vagy a .kml file-t [táblázatos formába konvertálva](https://mygeodata.cloud/converter/kml-to-xlsx) szétválaszthatók a különböző jelölések, és szerkeszthetők az elemek paraméterei.

A PARTIMAP által generált és használt .kml file-ok az alábbi paramétereket használják, ezek a Google Maps-el is átjárhatóságot biztosítanak:

- Az elemeket alkotó pontok x és y koordinátái;
- Az elem sorszáma (gid) és neve (Name);
- Az elemhez rendelt kategória (partimapCategory);
- A vonal vagy területet határoló vonal stílusa (partimapLineStyle), a pont mérete (partimapPointSize), az elem (körvonalának) átlátszósága (partimapOpacity), terület esetén a kitöltés átlátszósága (partimapFillOpacity) és további, a Google Maps által automatikusan beolvasott paraméterek (méret, szín) (ExtendedData);
- A leírás mező tartalma, amit a PARTIMAP használ (partimapDescription);
- A _Válaszok hozzáadása a térképes jelölésekhez elemzés céljára_ opcióval hozzáadott kérdések és válaszok (_partimapQuestion_);
- Minderről bővebb leírás a projekt [Github oldalán](https://github.com/k-monitor/partimap/blob/master/KML.md) érhető el.

### Riport és eredmények {#riport}

Egy felmérés kitöltéseit a [Kérdőívek](/admin/projects) listanézetének oldalán van lehetőség letölteni .xlsx formátumban. A riport az eredményeket a korábban részletezett formátumban tartalmazza. A térképes elemek azonosítószámok mentén is összekapcsolhatók a kérdőívkérdésekre adott válaszokkal, így pl. a kitöltők demográfiai adataival. Az adatok összekapcsolása után a térbeli jelölések is mélyebben elemezhetők, leszűrhetők a kitöltők egyes csoportjai mentén. A riport tartalmazza a kitöltők által használt eszköz típusát (pc/mobil) és a kitöltő IP címét is.

> A tömeges gépi kitöltéseket nem engedélyezi az oldal, de kézzel lehetőség van azonos IP címről több választ is leadni. Ezeket a riportből az IP cím alapján lehet kiszűrni.

### Tippek egy kérdőív elkészítéséhez {#tippek}

Mielőtt elkezdenénk a kérdőív összeállítását, tisztában kell lennünk azzal, hogy milyen döntés vagy tevékenység támogatásához szeretnénk kérni a kitöltők véleményét. Érdemes egy témakörre koncentrálni, ha túl tág a kérdőív fókusza, a kapott válaszok pontatlanabbak lesznek és a kitöltők kedvét is elveheti, ha túl sok, vagy számukra nem releváns kérdésre kell válaszolniuk. Ha megfelelően fókuszálunk, a célcsoportokat is könnyebben beazonosíthatjuk és elérhetjük.

**Tervezzük meg, kiket és hogyan szeretnénk elérni a kérdőívünkkel!**

Egy, a játszóterekkel kapcsolatos kérdőívet például érdemes beküldeni a helyi anyukákat tömörítő Facebook-csoportba, de ha a helyi fiatalokat szeretnénk megkérdezni valamilyen őket érintő problémáról, érdemes olyan platformokon vagy intézményeken keresztül elérni őket, amit napi szinten használnak.

Fektessünk hangsúlyt a nehezebben elérhető társadalmi csoportokra is. Az online kérdőívek jellemzően a fiatal vagy középkorú, magasabb jövedelmű és végzettségű kitöltőket érik el. Megfelelő tervezéssel, és különböző (akár offline) eszközökkel azonban biztosíthatjuk, hogy mindenkinek lehetősége legyen kifejteni a véleményét. Tegyük ki a papíralapú kérdőívet a könyvtárban, tegyünk a kérdőívre mutató QR kódot közösségi terekre, buzdítsuk a civil szervezeteket, hogy osszák meg a kérdőívet ügyfeleikkel, követőikkel!

Érdemes tisztában lenni azzal is, hogy a feltérképezni kívánt témakörben milyen adatok állnak már rendelkezésünkre. Ne kérdezzünk olyat, amire már tudjuk a választ, vagy kérdőívezés nélkül is könnyedén megtudhatjuk!

**A kérdőív legyen lényegre törő!**

Egy felmérés készítése során újabb és újabb ötletek merülnek fel a témával kapcsolatban, egyre több részletre leszünk kíváncsiak. A kitöltők azonban nem ennyire elkötelezettek, a hosszabb felmérés láttán lemorzsolódhatnak. Javasoljuk, hogy 6-8 munkalapnál ne használj többet egy felmérésben. Mérd le, mennyi időbe telik egy kitöltés, **10-12 percnél ne legyen hosszabb!**

A becsült kitöltési időt tüntesd fel a felmérés első munkalapján. Ha a kérdőív kitöltőinek száma jóval elmarad a megtekintések számától (pl. csak minden tizedik megnyitásból lesz kitöltés), akkor a kérdőívünk valószínűleg túl hosszú lett.

Igyekezzünk pontos magyarázatot adni a feladatokhoz, a szöveg kiemelésével, emotív ikonok használatával, lehetőleg minél tömörebben! A kérdések megfogalmazásához további szempontokat a PARTIMAP [részvételi módszertanában](https://drive.google.com/file/d/17p1JALO2iNtYNMhMkCvHCllqUTIFYrb2/view) találsz!

**Ellenőrizzük magunkat!**

Egy több munkalapból álló, kérdések és információk sorából álló felmérés összetettsége miatt minden figyelmesség és alaposság miatt becsúszhatnak hibák, elírások. Ha rossz kérdéseket teszünk fel, a válaszok használhatatlanok lesznek.

Az admin felület szerkesztésével párhuzamosan érdemes a publikus felületen ellenőrizni a változtatásokat. A szerkesztőben végrehajtott változások a mentést követően a publikus felületen is frissülnek. Felmérés elindítása után a kérdőívet csak indokolt esetben szabad módosítani, hiszen az átalakított kérdésekre beérkező eredmények nem lesznek összevethetők a korábbi kérdésekre adott válaszokkal. Csináljunk próbakitöltéseket a publikálás előtt! Nézzük át a beérkezett eredményeket, elemezhetőek, használhatóak-e a célnak megfelelően!

**Tervezzük meg a beérkező adatok struktúráját!**

A megfelelő mennyiségű kitöltés beérkezését és a kampány lezárultát követően fel kell dolgozunk a kapott adatokat. Gondoljuk át előre, milyen típusú válaszokat várunk, milyen formában, felületeken és eszközök segítségével tervezzük bemutatni az eredményeket!

- Jó ötletnek tűnhet a nyitott, kifejtős kérdések alkalmazása, azonban 1-2 ilyennél többet nem érdemes egy kérdőívben feltenni. A nyitott kérdések megválaszolása a kitöltők számára is megerőltetőbb, az adatok feldolgozásakor pedig jóval nehezebben elemezhetők a szöveges válaszok, mintha a megadott opciókból választanának a válaszadók.
- A PARTIMAP lehetővé teszi, hogy egy feleletválasztós vagy meghatározott számú opciót kiválasztani engedő kérdésnél egyéb választ is fogadjunk a kitöltőktől. Ez a legtöbb nyílt végű kérdést feleslegessé teszi. A kérdőív végén azonban érdemes lehetőséget adni arra, hogy a kitöltő szövegesen leírhassa azokat a szempontjait a témában, ami a kérdőívből kimaradt.
- A feleletválasztós kérdéseknél fontos, hogy a választható opciók egyértelműek és megkülönböztethetőek legyenek. Nem biztos, hogy minden válaszadó számára nyilvánvaló a ,,Ritkán" és a ,,Néha" közötti különbség.
- Minden kérdéstípusnál kulcsfontosságú, hogy a feltett kérdés ne legyen sugalmazó, ne befolyásolja a kitöltőket, mert ez torz eredményekhez vezet.
- Ne kérdezzünk két különböző dologra egy kérdésen belül, és kerüljük a hasonló vagy ismétlődő kérdéseket, mert ez is elveheti a kitöltők kedvét.
- Kötelezővé tehetjük az egyes kérdések kitöltését, ha az azokra adott válaszokat fontosnak tartjuk, azonban a túl sok kötelező kérdés lemorzsolódáshoz vezethet.
- A térképes interakciónál mindenképp buzdítsuk a kitöltőket, hogy érdemi szöveges indoklásokat adjanak, hiszen ezek nélkül csak találgatni tudunk, miért éppen azt a helyet jelölték meg a térképen.
- A legtöbb esetben fontos, hogy szocio-demográfiai adatokat (kor, nem, jövedelem, iskolázottsági szint) is gyűjtsünk, hiszen ez alapján tudjuk meghatározni, kik voltak a kitöltőink, lefedte-e a kitöltői kör a teljes érintett csoportot, vagy csak egy szűk réteg válaszait látjuk. Személyes adatokat azonban csak a szükséges mértékig gyűjtsünk, és legyünk egyértelműek ezek felhasználását illetően (összhangban a felhasználási feltételekkel). Ha publikáljuk az adatokat, minden személyes, szenzitív adatot rejtsünk el (pl. szöveges válaszban megadott adatok, lakóhely bejelölése a térképen).
- A felmérés elindítása előtt határozzunk meg kitöltési célszámokat, és kövessük nyomon, hogy hány kitöltést gyűjtöttünk. Ha elmaradunk a célszámoktól, tegyünk további erőfeszítéseket a kérdőív terjesztésére.

**Legyen egyedi, felismerhető a kérdőívünk!**

Az _Adataim_ menüpontban saját profilunknál mini logót és webcímet adhatunk meg, ami ezután minden munkalap tetején megjelenik, jelezve, hogy ki a kérdőív gazdája. A munkalapokat ezen felül egyedi háttérképekkel is testre szabhatjuk. Brand színt is beállíthatunk, ami a nyilvános felmérésekben a PARTIMAP kékje helyett jelenik meg. Törekedjünk az egyszerű, letisztult, koherens kinézetre!

A leírás mezőkben is el lehet helyezni képeket, ehhez egy külső tárhelyen kell tárolni a képet, vagy jogtiszta, szabadon felhasználható illusztrációt találni. Ezekkel még átélhetőbbé tehetjük a döntést a kitöltők számára.

A _Kérdéssor térképpel_ munkalap pontjait, vonalait is átszínezhetjük a szervezetünk színére. A térkép elemeihez szintén adható leírás, kép, így könnyebben beazonosíthatóvá tehetők a megjelölt helyek.

A kérdőív szerkesztőfelületén a kérdőívhez saját url-t és Facebook megoszthatóságot adhatunk. Ez fontos, hiszen a kérdőívet legegyszerűbben a közösségi médiában lehet terjeszteni. Ha akkor adunk hozzá Facebook arculatot, amikor a kérdőívet már megosztották, az előnézet nem az lesz, amit beállítottunk. Ezt [jelezni kell a Facebook felé](https://developers.facebook.com/tools/debug/), ami ezután frissíti a képet és elnevezést.

A kérdőív beágyazható a weboldaladra, ehhez az oldal HTML kódjába, a megfelelő helyre az alábbi kódot kell elhelyezni a kérdőív linkjével.

```
<embed src="https://partimap.eu/hu/p/példa" style="width:100%; height:550px;">
```

A beágyazott elem szélessége és magassága a width és height értékével állítható.
