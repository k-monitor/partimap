<template>
	<div
		class="d-flex flex-column"
		style="min-height: 100vh"
	>
		<b-navbar
			class="border-bottom shadow-sm"
			fixed="top"
			toggleable="sm"
			type="light"
			variant="white"
		>
			<div class="container">
				<b-navbar-brand>
					<Logo />
				</b-navbar-brand>
				<b-navbar-toggle target="nav-collapse" />
				<b-collapse
					id="nav-collapse"
					is-nav
				>
					<b-navbar-nav class="ml-auto">
						<!-- soon -->
					</b-navbar-nav>
				</b-collapse>
			</div>
		</b-navbar>

		<section class="bg-primary pt-5 text-white">
			<div class="my-5 py-lg-3 text-center">
				<h1 class="display-3 mt-5 mb-3">Partimap</h1>
				<p class="lead mb-5">
					<strong>Parti</strong>cipation <strong>map</strong>ping, azaz részvételi térképezés - közösség erejének bevonása az infrastrukturális fejlesztési irányokba.
				</p>
			</div>
		</section>

		<section class="py-5">
			<div class="container">
				<p class="lead">Hamarosan...</p>
			</div>
		</section>

		<section class="bg-white py-5">
			<div class="container -fluid">
				<h2 class="mb-5 text-center">Mit tud a program?</h2>
				<div class="features row row-cols-3">
					<div
						v-for="(f, i) in features"
						:key="f.title"
						class="col feature"
						role="button"
						@click="featureIndex = i; $bvModal.show('feature-modal')"
					>
						<figure class="figure">
							<img
								:alt="f.title"
								class="figure-img img-fluid rounded shadow-sm"
								:src="`landing/${i}.jpg`"
							>
							<figcaption class="figure-caption">
								<h5 class="text-center">{{ f.title }}</h5>
							</figcaption>
						</figure>
					</div>
				</div>
			</div>
		</section>

		<b-modal
			id="feature-modal"
			centered
			scrollable
			:title="feature.title"
		>
			<div v-html="feature.description" />
			<template #modal-footer>
				<div class="d-flex w-100">
					<button
						v-if="featureIndex > 0"
						class="btn btn-outline-primary"
						@click="featureIndex--"
					>
						<i class="fas fa-fw fa-angle-left" />
					</button>
					<button
						v-if="featureIndex < features.length - 1"
						class="btn btn-outline-primary ml-auto"
						@click="featureIndex++"
					>
						<i class="fas fa-fw fa-angle-right" />
					</button>
				</div>
			</template>
		</b-modal>

		<footer class="bg-dark mt-auto py-3 text-white">
			<div class="container d-flex">
				<div>
					<a
						class="mr-3"
						href="https://k-monitor.hu/"
						target="_blank"
					>
						<img
							src="k-monitor-logo.png"
							alt="K-Monitor"
							height="31"
						>
					</a>
					<a
						class="mr-3"
						href="https://www.deepdata.hu/"
						target="_blank"
					>
						<img
							src="deepdata-logo.png"
							alt="DeepData"
							height="31"
						>
					</a>
				</div>
				<div class="ml-auto">
					<a
						class="text-white"
						href="https://github.com/k-monitor/partimap"
						target="_blank"
					>
						<i class="fab fa-github fa-2x" />
					</a>
				</div>
			</div>
		</footer>
	</div>
</template>

<script>
export default {
	data() {
		return {
			features: [
				{
					title: 'Egyszerű szerkeszthetőség',
					description:
						'<p>A Partimappal egyszerűen lehet létrehozni többféle térképes és hagyományos kérdőíves funkciókat tartalmazó felméréseket. Munkafelületet úgy alakítottuk ki, hogy hétköznapi számítógépes felhasználói tudás elegendő legyen a kérdések megadáshoz, munkalapok létrehozásához, közösségi médiában való megosztás adatainak megadásához és egy új projekt élesítéséhez.</p><p>A projekt szerkesztőfelületébe regisztrálva az új projekt létrehozásakor először az olyan alapadatok megadására van szükség, mint a projekt címe, az adatkezelő adatai és a köszönőoldal szövege, ezt követően pedig a saját témához kapcsolódó munkalapok létrehozására van lehetőség. Ezek lehetnek szöveges oldalak (a tervek, elképzelések bemutatására), kérdőívek (feleletválasztó, legördülő menüs, szabadszavas és skálán mérhető válaszok begyűjtésére), statikus térképek (előre meghatározott térképes elemek - pontok, vonalak és poligonok - bemutatása és értékelése), valamint interaktív térképek (itt egy kérdésre válaszolva a kitöltők rajzolhatnak fel saját elemeket). A munkalapok között könnyen lehet törölni, navigálni és a sorrendjük is bármikor tetszőlegesen szerkeszthető.</p>',
				},
				{
					title: 'Testre szabható megjelenés',
					description:
						'<p>A kérdőíves felületek feladata, hogy könnyen eljusson a célközönséghez. Ezért külön figyelmet fordítottunk a fejlesztés során a megoszthatóságra és a projektek testre szabhatóságára. A bemutatkozó és záró munkalapokon elérhetők a legnépszerűbb közösségi médiafelületek megosztás gombjai. A projektekhez egyedi Facebook bélyegkép és előnézeti szöveg is beállítható, amivel a felhasználó szervezet saját kreatív képi világához igazíthatja felmérését. A munkalapok szerkesztőfelületén saját fényképek feltöltésén túl lehetőség van a szövegek formázására, linkek megadására, és háttérképek feltöltésére is. A projekteknek ezen felül a felületen egyedi (partimap.eu/p/NÉV) url cím adható.</p>',
				},
				{
					title: 'Sokoldalú kérdőív',
					description:
						'<p>Az oldal kérdőíves munkalapja segítségével a térképes nézethez nem kapcsolódó felméréseket lehet készíteni. A kérdések formája lehet feleletválasztós, legördülő menü, lineáris értékelés vagy szöveges válasz - ezek saját képek hozzáadásával és további beállításokkal szabadon testre szabhatók. A kitöltők által adott válaszok összesítése (eredménye) egy gombnyomással publikálható grafikus formában a munkalap végén, a kitöltés lezárása után pedig lehetőség van csak az eredményeket megmutatni. A munkalap ugyanúgy testre szabható, mint a többi: háttérképet, illusztrációt, linkeket lehet használni rajta, hogy könnyebb legyen a kitöltők dolga.</p>',
				},
				{
					title: 'Fejlesztések bemutatása térképen',
					description:
						'<p>Adott közlekedési, infrastrukturális vagy más térképen ábrázolható fejlesztés vagy fejlesztési ötlet bemutatására és visszajelzések gyűjtésére a kérdőívhez statikus térkép munkalap adható. Ehhez más térképes felületekről (pl. Google Maps) könnyen importálhatóak korábban felrajzolt elemek, amelyekhez a Partimapon egyedi megjelenítés és értékelési lehetőség adható. Ezen felül magához a munkalaphoz is hozzáadhatóak a kérdőívnél már megismert kérdéstípusok, illetve további magyarázat, leírás, linkek. A felrajzolt térképet saját térképként elmentve egy következő projektnél is fel lehet használni.</p><p>A statikus térkép kiválóan alkalmas arra, hogy egy település különböző létesítményeihez értékelést kérjünk a lakosoktól, pl. Mennyire könnyen megközelíthető, mennyire akadálymentes, jól járható-e kerékpárral stb. Ezekből az eredmények letöltése után egy komplex értékelés rajzolódik ki. A munkalaptípus konkrét fejlesztési dilemmák eldöntésére is használható, például egy területre tervezett A és B verziójú fejlesztést megismerve dönthetnek a kitöltők, melyiket kedvelik jobban.</p>',
				},
				{
					title: 'Most te jössz - rajzolj a térképre!',
					description:
						'<p>A Partimap egyediségét az adja más térképes felületekhez képest, hogy a kitöltők térképre rajzolva is kifejezhetik a véleményüket, illusztrálhatják a javaslataikat, vagy egyszerűen megoszthatják, merre közlekednek. Egy település, kerület vagy környék köztereit számos ember használja, akiknek szerteágazó térhasználati igényei és véleményei felmérésére alkalmas az interaktív térképes munkalap. A megkérdezett felhasználók pont, vonal és alakzat segítségével adhatnak grafikus választ a feltett kérdésekre. A bejövő eredményeket könnyen fel lehet dolgozni akár egy hőtérkép formájában, vagy akár egy következő kérdőívben a beérkezett javaslatokat lehet egy statikus térképen szavazásra bocsátani.</p>',
				},
				{
					title: 'Átjárhatóság más felületekkel',
					description:
						'<p>Mindkét térképes munkalap az openstreetmap.org-ot használja háttértérképként, amelyhez egyedi alaptérkép rajzolható kiemelve a felmérés fókuszpontjait. A korábbi projektekben felrajzolt elemeket a felhasználó saját térképei között lehet elmenteni és tárolni. Az egyes munkalapokhoz az alaptérkép nem csak ebből a saját térképtárból, hanem külső KML fájlból is behúzható: import/export funkcióval gyors átjárást biztosít olyan térképes szoftverekkel, mint például a Google MyMaps vagy más, komplexebb térinformatikai programok.</p><p>Az egyszerű szerkesztőfelületen színezhető pontok, vonalak és poligonok felrajzolásával készíthetők a felméréshez illeszkedő térképek. Egy gombnyomással lehetőség van egy felmérés kitöltői által beküldött adatokból is alaptérképet létrehozni, valamint KML fájlformátumban történő exportra - így biztosított az átjárás más térképszerkesztő alkalmazások felé. A későbbiekben más típusú raszteres háttérképeket, és a felrajzolt elemek újfajta grafikai megjelenítését is meg kívánjuk teremteni (pl. egyedi ikonok).</p>',
				},
				{
					title: 'Az eredmények kommunikálása',
					description:
						'<p>Egy felmérés lezárultával új szakasz nyílik egy projekt életében: a kiértékelés. A kérdőíves felületen beérkező válaszokat a gyors kommunikáció érdekében grafikonokon mutathatjuk be: ezek megjelenítése egy gombnyomással beállítható, így a kitöltők közvetlenül is böngészhetik a kérdőívezés aktuális eredményét. További, részletes elemzéseket a beérkezett adatok teljeskörű excel formátumban történő letöltésével lehet megkezdeni. A riportból ezt követően adatkezelő programokkal lehet feldolgozni a beküldött válaszokat, földrajzi elemeket, így a végeredmény összetettsége és látványossága már csak adatelemző és -vizualizáló kapacitásunk határaitól függ.</p>',
				},
				{
					title: 'Ingyenes, szabadon felhasználható',
					description:
						'<p>Az alkalmazás használata ingyenes, gyors regisztrációt követően máris létrehozható egy saját Partimap kérdőív. A K-Monitor és partnerei által fejlesztett eszköz nyílt forráskóddal rendelkezik, így szabadon továbbfejleszthető, alakítható és felhasználható. Célunk, hogy minél több olyan projekt szülessen, ami ösztönzi az állampolgárok bevonását a közügyek eldöntésébe, így kifejezetten örülünk, ha az eszköz kreatív alkalmazásának, fejlesztésének. </p>',
				},
				{
					title: 'Szeretném segíteni a projektet!',
					description:
						'<p>A Partimap szoftvert a K-Monitor egyesület az Európai Bizottság (DG Regio) támogatásából valósította meg 2021-ben. A jelenlegi verzió publikálásával a projekt azonban korántsem ért véget! Az ingyenes, szabadon felhasználható felületet állami szerveknek, önkormányzatoknak, érdekérvényesítő civil szervezeteknek készítettük azzal a céllal, hogy az eszköz segíti őket a fejlesztésekkel kapcsolatos döntések társadalmasításában, így közös vagyonunkkal takarékosabban gazdálkodhatunk.</p><p>Ha érdekel a projekt, és szeretnél bekapcsolódni a fejlesztésbe, vagy csak megosztanád velünk a gondolataidat a Partimapról, írj nekünk az <a href="mailto:info@k-monitor.hu">info@k-monitor.hu</a>-ra. Ha anyagilag támogatnád a fejlesztést, hogy az ingyenes, szabadon felhasználható szoftver minél többek számára legyen elérhető, <a href="https://tamogatas.k-monitor.hu/" target="_blank">támogasd a K-Monitort!</a></p>',
				},
			],
			featureIndex: 0,
		};
	},
	computed: {
		feature() {
			return this.features[this.featureIndex];
		},
	},
};
</script>

<style scoped>
.features .feature {
	transition: all 150ms;
}
.features:hover .feature:not(:hover) {
	filter: grayscale(0.25);
	opacity: 0.85;
}
</style>
