## Segítség felmérés készítéséhez {#adminsugo}

Az alábbiakban az admin felület működését mutatjuk be.

### Regisztráció {#regisztracio}

<a href="/register" target="_blank">Regisztrációt</a> követően bárki teljes körűen használhatja az alkalmazást: az admin felületen keresztül lehetőség van új felméréseket (Projekt) készíteni, korábbiakat módosítani, valamint rendezni és szerkeszteni a felmérésekhez kapcsolódó alaptérképeket.

### Új projekt létrehozása és korábbiak kezelése {#ujprojekt}

Új projekt a belépést követő admin felületen a projekt elnevezésének megadásával hozható létre. A felméréshez kapcsolódó adatok, kérdések és tartalom a létrehozást követően a felmérés adatlapján adhatók meg.

<div class="row mb-5">
	<div class="col-12 col-lg-10 mx-auto mt-4">
		<figure class="figure">
			<img
				alt="Projekt létrehozása"
				class="figure-img img-fluid rounded shadow-sm"
				src="/help/project.png"
			>
			<figcaption class="figure-caption text-center">
				Projekt létrehozása
			</figcaption>
		</figure>
	</div>
</div>

Az admin felület rögzített fenti menüsorában van lehetőség a <a href="/admin/projects" target="_blank">Projektek</a>
és a <a href="/admin/maps" target="_blank">Térképek</a> listanézetének és szerkesztő felületének közötti váltásra.

### Projekt adatlap {#projektadatlap}

A <a href="/admin/projects" target="_blank">Projektek</a> menüpontból egy projekt kiválasztását vagy új létrehozását követően a Projekt adatlapjára jutunk. Minden projekt adatlapja két részből áll: az oldal felső részén a felméréshez kapcsolódó adatok és beállítások, a második felében a munkalapok szerkesztésére van lehetőség.

A kapcsolódó adatoknál és beállításoknál van lehetőség

- megadni a projekt elnevezését, ami az adminfelületen túl a böngésző lapcímében és a közösségi médiában megosztáskor jelenik meg;
- szerkeszteni az elérési útvonalát (url címét - <code>https://partimap.eu/p/*</code>),
- jelszavas védelmet beállítani, amivel szűkítheted a kitöltők körét. Ilyenkor a kérdőív url-jére navigálva az oldal jelszót kér, megadás után lehet kitölteni a kérdőívet,
- Facebook megosztáshoz egyedi meta leírást adni,
- Facebook megosztáshoz egyedi képet feltölteni,
- az adatkezelő elérhetőségét megadni (ez az adatkezelési nyilatkozatban jelenik meg),
- a kitöltés végén (a beküldés után) megjelenő egyedi köszönő üzenetet és tovább navigáló linket (url) megadni,
- a felmérés megosztására felhívó gombokat (Facebook, Twitter, e-mail) ki- és bekapcsolni.

Egy projekt tartalmi része munkalapokra tagolódik. Az egyes munkalapokon felületén van lehetőség megjeleníteni a különböző típusú kérdéseket, tájékoztató szövegeket és kitöltői interakcióra felhívó térképes elemeket. Új munkalapot a projekt adatlap alsó felében található munkalap szerkesztő résznél lehet hozzáadni (*Munkalap hozzáadása*). A már létrehozott munkalapok sorba rendezett listanézete is itt érhető el.

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

A munkalapok szerkesztőfelület a munkalap elnevezésére kattintva érhető el. Az első piktogram jelzi a munkalap típusát (*Szöveg, Kérdőív, Térkép* vagy *Interaktív térkép*), a fel és le nyilakkal változtatható a munkalapok sorrendje, a kuka ikon pedig törli a már nem szükséges munkalapot. Amennyiben egy interaktív térképes munkalapra már érkeztek beküldések, ezek az *Új saját térképre küldés* linkkel exportálhatók saját térképre, ahol böngészhetők, szerkeszthetők a kitöltők által felrajzolt elemek.

### Munkalapok típusai {#munkalapok}

<div class="row mb-5">
	<div class="col-12 col-lg-10 mx-auto mt-4">
		<figure class="figure">
			<img
				alt="Új munkalap hozzáadása"
				class="figure-img img-fluid rounded shadow-sm"
				src="/help/newsheet.gif"
			>
			<figcaption class="figure-caption text-center">
				Új munkalap hozzáadása
			</figcaption>
		</figure>
	</div>
</div>

#### Szöveges munkalap {#szoveges}

Szöveg és képek megjelenítésére alkalmas munkalap. Többek közt alkalmas a felmérés céljainak, a lebonyolító szervezet vagy intézmény bemutatkozásának, fejlesztések hátterének leírására, további kapcsolódó információk megjelenítésére. A munkalap szerkesztése során megadható:

- *A munkalap címe*, amely megjelenik a publikus felületen is.
- *Munkalap leírása*, amely a megjelenő párbeszédablak fő szövege. A szöveg alapvető formátumbeállítási lehetőségekkel testre szabható, lehetőség van link, illetve kép beszúrására is.
- *Saját háttérkép*, amely a párbeszédablak mögötti teret tölti ki.
- A felmérés megosztására felhívó gombok (Facebook, Twitter, e-mail).

A szerkesztések rögzítéséhez meg kell nyomni a *Mentés* gombot, különben a hozzáadott tartalom más oldalra navigálás esetén elvész. A szerkesztés alatt álló munkalapok közötti navigációra szolgálnak a lap alján található kék jobbra/balra nyilak.

#### Kérdőíves munkalap {#kerdoiv}

Kérdőíves munkalap segítségével kérdőíves felméréseket készíthet. A munkalap szerkesztése során megadható:

- *A munkalap címe*, amely megjelenik a publikus felületen is.
- *Munkalap leírása*, amely a párbeszédablak elején jelenik meg. A szöveg alapvető formátumbeállítási lehetőségekkel testre szabható, lehetőség van link, illetve kép beszúrására is.
- *Kérdőív:* a munkalaphoz itt van lehetőség kérdések hozzáadására amelyek tulajdonságait a megjelenő párbeszédablakban szerkesztheti.
- *Kitöltés után válasz statisztika megjelenítése a látogatónak:* kipipálva a kitöltést követően, lapozás után a látogató számára megjelenik a válaszok egyszerűen összesített statisztikája oszlopdiagramon.
- *Csak az eredmények megjelenítése:* kipipálva a munkalap kérdései lezárulnak, nem gyűjtenek válaszokat, csak az eredmények lesznek láthatók a látogatók számára.
- *Saját háttérkép*, amely a párbeszédablak mögötti teret tölti ki.
- A felmérés megosztására felhívó gombok (Facebook, Twitter, e-mail). Ezt a záró, demográfiai kérdéseket tartalmazó munkalap esetében érdemes bekapcsolni.

A kérdőív kérdéseinek formája lehet *feleletválasztós, legördülő menü, lineáris értékelés* vagy *szöveges válasz* - ezek saját képek hozzáadásával és további beállításokkal szabadon testre szabhatók. A kitöltők által adott válaszok összesítése egy gombnyomással publikálható a munkalap végére.
A szerkesztések rögzítéséhez meg kell nyomni a *Mentés* gombot, különben a hozzáadott tartalom más oldalra navigálás esetén elvész. Munkalapok közötti navigációra szolgálnak a lap alján található kék jobbra/balra nyilak.

#### Statikus térképes munkalap {#statikus}

Statikus térképes munkalap segítségével olyan térkép alapú felmérést készíthető, amely alkalmas egy fejlesztés vagy fejlesztési ötlet bemutatására valamint az ezzel kapcsolatos javaslatok, értékelések gyűjtésére. A munkalap a klasszikus kérdőíves funkciókat ötvözi a térképes nézettel, de a térkép elemeit az admin adja meg, a látogatók önállóan itt nem rajzolhatnak a térképre.
A munkalap szerkesztése során megadható:

- *A munkalap címe*, amely megjelenik a publikus felületen is.
- *Munkalap leírása*, amely a párbeszédablak elején jelenik meg. A látogatótól várt interakció leírásának a helye. A szöveg alapvető formátumbeállítási lehetőségekkel testre szabható, lehetőség van link, illetve kép beszúrására is.
- *Kérdőív:* a munkalap egészéhez itt is van lehetőség kérdések hozzáadására, amelyek tulajdonságait a megjelenő párbeszédablakban szerkesztheti. A kérdőívkérdés a munkalap térképe melletti oldaldobozban, a leírás alatt jelenik meg.
- *Statisztika:* kipipálva a kitöltést követően a látogató számára megjelenik a kérdőívkérdésre adott válaszok összesített statisztikája.
- *Csak eredmények:* kipipálva a munkalap kérdései lezártnak minősülnek, csak az eredmények lesznek láthatók a látogatók számára.
- *Látogatói interakciók:* kipipálva engedélyezi, hogy a látogatók értékelést adjanak az alaptérképen felrajzolt elemekhez. Erre nincs szükség pl. ha csak prezentációt készít vagy kérdőíves elemeket alkalmaz, de praktikus lehet, ha a felrajzolt elemekről vár értékelést.
- *Térkép elemei:* itt jelennek meg az alaptérképre felrajzolt objektumok. A lap alján található *KML export/import* gombok segítségével lehetőség van más szerkesztőfelületen készített térkép alaptérképként való importálására, illetve a kérdőívhez az admin által felrajzolt elemek lementésére.

Az alaptérképre elemeket a jobb felső sarokban található *pont, vonal* és *terület* gombokkal van lehetőség rajzolni. A hozzáadást követően az elemek részletei (elnevezés, szín, méret, leírás, elem törlése) a térképen kiválasztva vagy az oldalsáv *Térkép elemei* részből nyithatóak meg és szerkeszthetőek.
A szerkesztések rögzítéséhez meg kell nyomni a *Mentés* gombot, különben a hozzáadott tartalom más oldalra navigálás esetén elvész. Munkalapok közötti navigációra szolgálnak a lap alján található kék jobbra/balra nyilak.

#### Interaktív térképes munkalap {#interaktiv}

Interaktív térképes munkalappal a kitöltők rajzolhatnak a térképre! Segítségével olyan térkép alapú felmérés készíthető, amely a látogatótól pontokkal, vonalakkal és poligonokkal (területekkel) kifejezett aktivitást, a véleménye, ötletei térképre való felrajzolását várja.
A munkalap szerkesztése során megadható:

- *A munkalap címe*, amely megjelenik a publikus felületen is.
- *Munkalap leírása*, amely a párbeszédablak elején jelenik meg. A látogatótól várt interakció leírásának a helye. A szöveg alapvető formátumbeállítási lehetőségekkel testre szabható, lehetőség van link, illetve kép beszúrására is.
- *Látogatói interakciók:* kipipálással kiválasztható, a látogató milyen geometriai formákat használhat interakciója során. A választható lehetőségek (*pont, vonal, terület*) kijelölése esetén a publikus felületen a jobb felső sarokban jelennek meg.
- *Felrajzolt elemekhez rendelt kérdés:* A látogatók rövid szöveget írhatnak az általuk felrajzolt elemekhez. Itt megadható kérdés segítségével irányíthatja válaszukat.
- *Térkép elemei:* itt jelennek meg az alaptérképre felrajzolt objektumok. A lap alján található *KML export/import* gombok segítségével lehetőség van más szerkesztőfelületen készített térkép alaptérképként való importálására.

Az alaptérképre elemeket a jobb felső sarokban található *pont, vonal* és *terület* gombokkal van lehetőség rajzolni. Ezek segítségével érdemes többek közt felrajzolni azt a területet, ahová a jelöléseket várjuk. Az egyes elemek hozzáadását követően az elemek részletei (elnevezés, szín, méret, leírás, elem törlése) a térképen kiválasztva vagy az oldalsáv *Térkép elemei* részből nyithatóak meg és szerkeszthetőek.
A szerkesztések rögzítéséhez meg kell nyomni a *Mentés* gombot, különben a hozzáadott tartalom más oldalra navigálás esetén elvész. Munkalapok közötti navigációra szolgálnak a lap alján található kék jobbra/balra nyilak.

### Térképek létrehozása és korábbiak kezelése {#terkepek}

A Partimap lényege a klasszikus kérdőíves funkciók ötvözése a térképes felülettel. A <a href="/admin/maps" target="_blank">Térképek</a> menüpont alatt a felméréseket segítő alaptérképek érhetők el. Itt lehet gyűjteni és szerkeszteni egy adott felhasználó városáról, környezetéről korábban készített térképeit, és a kérdőívekből összegyűjtött válaszokat. A Partimap jelenleg nem kínál grafikus elemző funkciókat, de a saját térképen az egyedi elemek szerkeszthetők: név és leírás mellett a kinézetük (szín, méret, vonalak esetén a vonal stílusa) beállítható.

Új alaptérkép létrehozása:

- Üres térkép esetén a <a href="/admin/maps" target="_blank">Térképek</a> aloladon.
- Egy felmérés kitöltőinek beküldéseiből a *Projekt adatlapon* a vonatkozó munkalap sorában megjelenő *Új saját térképre küldés* linkkel.
- KML fájlból adatot betölteni a térképet a szerkesztőfelületen megnyitva vagy egy munkalapon a *KML import* gomb segítségével.

Saját térkép szerkesztése során a munkalapokhoz hasonló felületen megadható:

- *A térkép neve*
- *Térkép elemei:* itt jelennek meg az alaptérképre felrajzolt objektumok. A lap alján található *KML export/import* gombok segítségével lehetőség van más szerkesztőfelületen készített térkép alaptérképre importálására.

### Riport és eredmények {#riport}

Egy felmérésre kitöltéseit a <a href="/admin/projects" target="_blank">Projektek</a> listanézetének oldalán van lehetőség letölteni excel formátumban (.xlsx). A beérkezett válaszok összességét tartalmazó fájl a felmérésben használt kérdések és interakciók típusától függően az alábbiak szerint külön lapokra tagolja az adatokat.

- *Beküldött válaszok*: a kérdőívekre adott válaszok;
- *Értékelések*: a térképes munkalapok alaptérképein megjelenített objektumokra adott egyedi értékelések;

### Tippek egy jó Partimap felmérés elkészítéséhez {#tippek}

**Fogd rövidre, légy lényegretörő!** Valószínű, hogy egy felmérés során egyre újabb és újabb ötleteid lesznek a témával kapcsolatban, egyre mély részletekre leszel kíváncsi. A kitöltők azonban nem feltétlenül ennyire elkötelezettek, a hosszabb felmérés láttán lemorzsolódhatnak, félbehagyhatják azt.
<ul>
- Javasoljuk, hogy 6-8 munkalapnál ne használj többet egy felmérésben!
- Publikálás előtt kérd meg kollégádat, ismerősödet, hogy töltse ki azt! Mérd le, mennyi időbe telik egy kitöltés, 10-12 percnél ne legyen hosszabb!
- Igyekezz pontos magyarázatot adni a feladatokhoz, a szöveg kiemelésével, ikonok használatával lehetőleg minél tömörebben! Ehhez, és a jó kérdőívkérdések megfogalmazásához további javaslatokat a Partimap <a
href="https://drive.google.com/file/d/17p1JALO2iNtYNMhMkCvHCllqUTIFYrb2/view" target="_blank">részvételi módszertanában</a> találsz!

**Ellenőrizd magad!** Egy több munkalapból álló, kérdések és információk sorából álló felmérés összetettsége miatt minden figyelmesség és alaposság miatt becsúszhatnak hibák, elírások.


- Az admin felület szerkesztésével párhuzamosan érdemes a publikus felületen ellenőrizni a változtatásokat!
- A szerkesztőn végrehajtott változások a mentést követően a publikus felületen is frissülnek. Felmérés elindítása után azonban csak indokolt esetben módosíts a munkalapok tartalmán, hiszen az átalakított kérdésekre beérkező eredmények nem lesznek összevethetők a korábbi kérdésekre adott válaszokkal!
- Ha úgy érzed készen van a felmérésed, csinálj próbakitöltéseket a publikálás előtt!

**Tervezd meg a beérkező adatok struktúráját!** Megfelelő mennyiségű kitöltés beérkezését és a kampány lezárultát követően munkád lesz még az adatok kiértékelésével is. Gondold át előre, milyen típusú válaszokat vársz, milyen formában, felületeken és eszközök segítségével tervezed bemutatni az eredményeket!

- Készíts pár próbakitöltést a felmérés publikálását megelőzően!
- Nézd meg a beérkezett eredményeket, elemezhetőek-használhatóak-e a célodnak megfelelően!

**Legyen egyedi, felismerhető a kérdőíved!** A Felhasználók menüpontban saját profilodnál saját mini logót és webcímet adhatsz meg, ami ezután minden munkalapod telején megjelenik, jelezve, hogy te vagy a kérdőív gazdája. A munkalapokat ezen felül egyedi háttérképekkel is testre szabhatod. Törekedj az egyszerű, letisztult, koherens kinézetre!

- A leírás mezőkben is el tudsz helyezni képeket, ehhez egy külső tárhelyen kell elhelyezned a képet, vagy jogtiszta, szabadon felhasználható illusztrációt találni. Ezekkel még átélhetőbbé teheted a döntést a kitöltők számára
- A statikus térkép munkalap pontjait, vonalaid átszínezheted a szervezeted színére. A térkép elemeihez szintén adhatsz leírást, képeket, így könnyebben beazonosíthatóvá teheted azt a helyet, amit megjelöltél.
- A projekt szerkesztőfelületén a kérdőívhez saját url-t és Facebook megoszthatóságot adhatsz. Ez fontos, hiszen a kérdőívet legegyszerűbben a közösségi médiában tudod terjeszteni. Ha később adod hozzá a Facebook arculatot, amikor a kérdőívet már megosztottad, akkor ezt jelezned kell a Facebook felé, ami ezután frissíti a korábbi képet és elnevezést. Ezt <a href="https://developers.facebook.com/tools/debug/" target="_blank">itt tudod megtenni</a>.
