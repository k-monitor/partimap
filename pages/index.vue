<template>
	<PublicFrame>
		<header class="bg-primary text-white">
			<div class="container my-5 py-lg-3 text-center">
				<h1 class="display-4 font-weight-bold mt-5 mb-4 text-uppercase">Partimap</h1>
				<p class="lead mb-5">
					A K-Monitor alkalmazása egy ingyenes, könnyen kezelhető és testreszabható térképes kérdőív azoknak, akik fontosnak tartják, hogy a közpénzből megvalósuló fejlesztésekbe az érintettek is beleszólhassanak.
				</p>
			</div>
		</header>

		<section class="py-5">
			<div class="container text-justify">
				<div class="row">
					<div class="col-md-5 mx-auto">
						<p>
							Mikor kérték ki legutóbb a véleményed egy olyan fejlesztésről, amit naponta használsz? Hazai és európai uniós milliárdokból sorra újulnak meg városi tereink, közintézményeink és a közlekedési létesítmények. A társadalmi egyeztetés és az érintettek bevonása azonban sokszor csak formalitás. Pedig könnyen belátható, hogy a lebonyolítás szakmai szempontjai mellett a fejlesztéseket napi szinten használók igényeit, elvárásait is számításba kell venni ahhoz, hogy egy projekt sikeres legyen. A cél nem az, hogy modernebb legyen a vasútállomás, hanem az, hogy többen járjanak vonattal. Nem attól kap közösségi funkciót egy tér, okospadokat szerelünk fel, hanem attól, hogy a környékbeliek megkedvelik.
						</p>
					</div>
					<div class="col-md-5 mx-auto">
						<p>
							Participatory mapping, azaz részvételi térképezés: így nevezik a folyamatot, amelynek révén az érintettek pótolhatatlan tudása beépül a számukra készülő közösségi fejlesztésekbe. A Partimap térképes kérdőívező felülete ahhoz nyújt segítséget, hogy lakosokkal való kapcsolat gyorsabbá, hatékonyabbá és egyszerűbbé váljon. A program regisztráció után ingyenesen használható, saját arculattal látható el és nyílt forráskódjának köszönhetően szabadon továbbfejleszthető. Legyél állami szerv, önkormányzat, vagy helyi érdekérvényesítő csoport - ha egy okos és átlátható megoldást keresel arra, hogyan ismerd meg a környezeted véleményét, próbáld ki a Partimapot és csatlakozz te is a fejlesztéshez!
						</p>
					</div>
				</div>
			</div>
		</section>

		<section class="bg-primary py-5">
			<div class="container-fluid py-lg-3 text-center">
				<b-button
					class="rounded-pill shadow text-uppercase"
					href="https://www.partimap.eu/p/Demo/0"
					style="padding: 1rem 2.5rem"
					target="_blank"
					variant="light"
				>
					<strong>Kipróbálom</strong>
					<i class="fas fa-chevron-right ml-2" />
				</b-button>
			</div>
		</section>

		<section class="py-5">
			<div class="container text-justify">
				<div class="row">
					<div class="col-md-4 mx-auto text-center">
						<figure class="figure">
							<img
								src="logo.svg"
								class="figure-img rounded w-75"
								alt="Részvételi módszertan"
							>
							<figcaption class="h4 mt-4">Részvételi módszertan</figcaption>
						</figure>
					</div>
					<div class="col-md-6 mx-auto">
						<p class="mb-5">
							Mitől lesz sikeres egy részvételi térképezés? Hogyan kell elkészíteni a kérdőívet, mire kell odafigyelni a terjesztés során és hogyan lehet a legtöbbet kihozni az összegyűjtött adatokból? A K-Monitor összefoglalta a legfontosabb tudnivalókat, hiszen a kérdőívezés csak egy eleme a fejlesztések társadalmasításának. A Partimap részvételi módszertana - a program használói körével együtt - a jövőben folyamatosan bővülni fog!
						</p>
						<div class="text-center">
							<b-button
								class="rounded-pill shadow text-uppercase"
								href="https://drive.google.com/file/d/17p1JALO2iNtYNMhMkCvHCllqUTIFYrb2/view?usp=sharing"
								style="padding: 1rem 2.5rem"
								target="_blank"
								variant="primary"
							>
								<strong>Elolvasom</strong>
								<i class="fas fa-chevron-right ml-2" />
							</b-button>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="bg-white py-5">
			<div class="container -fluid">
				<h2 class="mb-5 text-center">Mit tud a program?</h2>
				<div class="features row row-cols-1 row-cols-md-3">
					<div
						v-for="(f, i) in features"
						:key="f.title"
						class="col feature mb-3"
						role="button"
						@click="showFeature(i)"
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

						<b-modal
							:id="`feature-modal-${i}`"
							centered
							scrollable
							:title="f.title"
						>
							<div v-html="f.description" />
							<template #modal-footer>
								<div class="d-flex w-100">
									<b-button
										v-if="i > 0"
										variant="outline-primary"
										@click="featureIndex = i - 1"
									>
										<i class="fas fa-fw fa-angle-left" />
									</b-button>
									<b-button
										v-if="i < features.length - 1"
										class="ml-auto"
										variant="outline-primary"
										@click="featureIndex = i + 1"
									>
										<i class="fas fa-fw fa-angle-right" />
									</b-button>
								</div>
							</template>
						</b-modal>
					</div>
				</div>
			</div>
		</section>

		<section class="bg-light pb-3 pt-4" style="box-shadow: inset 0px 20px 15px -15px rgba(0,0,0,.08)">
			<div class="container">
				<div class="row">
					<div class="col-6 col-md-5 col-lg-4">
						<figure class="figure">
							<img
								src="eu-commission-logo-hu.svg"
								class="figure-img w-100"
								alt="Európai Bizottság"
							>
						</figure>
					</div>
					<div class="col-12 col-lg-8 d-flex align-items-center">
						<p class="font-weight-bold mb-0">
							A fejlesztés az Európai Bizottság (DG Regio) által támogatott
							<a
								href="https://k-monitor.hu/tevekenysegek/20210324-partimap"
								target="_blank"
							>Participatory Mapping in Cohesion Policy in Hungary (PartiMap)</a>
							elnevezésű projekt keretében valósul meg.
						</p>
					</div>
				</div>
			</div>
		</section>
	</PublicFrame>
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
			featureIndex: -1,
		};
	},
	computed: {
		feature() {
			return this.features[this.featureIndex];
		},
	},
	watch: {
		featureIndex(i, p) {
			if (p >= 0) {
				this.$bvModal.hide('feature-modal-' + p);
			}
			if (i >= 0) {
				this.$bvModal.show('feature-modal-' + i);
			}
		},
	},
	methods: {
		showFeature(i) {
			this.featureIndex = -1;
			this.$nextTick(() => (this.featureIndex = i));
		},
	},
};
</script>

<style scoped>
strong {
	font-weight: 700;
}

.features .feature {
	transition: all 150ms;
}
.features:hover .feature:not(:hover) {
	filter: grayscale(0.25);
	opacity: 0.85;
}
</style>
