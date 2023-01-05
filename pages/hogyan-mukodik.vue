<template>
	<PublicFrame>
		<div class="container my-5 help">
			<header class="my-5">
				<h1 class="border-bottom">Hogyan működik az oldal?</h1>
			</header>
			<div class="mb-5">
				<h2>Segítség a felmérések kitöltéséhez</h2>
			</div>
			<div class="mb-5">
				<h3 id="pont">Pont felrajzolása (piros)</h3>
				<p>A felmérés egyes térképes oldalain pontokat lehet megadni. A projekt gazdája ilyenkor azt várja Öntől, hogy konkrét helyeket (pl. utcasarok, zebra, bejárat, stb.) jelöljön be a térképen.</p>
				<p>Ezt a térkép jobb felső sarkában található piros alapon fehér gombostűre (<span class="bg-danger rounded text-white mx-1 p-1"><i class="fas fa-fw fa-map-marker-alt" /></span>) kattintva tudja megtenni. Ezt követően kattintson a térképen arra a helyre, amelyet meg kíván jelölni a feltett kérdésnek megfelelően. Törekedjen arra, hogy minél pontosabban helyezze el a jelölést, szükség esetén egere görgőjével, a +/- gombok segítségével, vagy mobilos nézet esetén két ujjal közelítsen be a térképen. Egyszeri kattintással tudja lehelyezni a pontot, amit követően a jobb oldalon megnyíló párbeszédablakban további indoklást fűzhet a megjelölt helyhez. Már rögzített pont szerkesztésére nincs lehetőség, ha elrontotta, a pont törlésével (kuka ikon) tudja visszavonni a jelölést.</p>
				<p>A pont rögzítése a térképre kattintással megtörténik. Egy munkalapon több megjelölést is megadhat, ehhez újból kattintson a piros alapon fehér gombostűre. Amennyiben befejezte az elemek hozzáadását, az oldalsáv alján található kék nyíllal tud a következő lapra lépni, a felvitt elemek és szövegek mentése a továbblépéssel automatikusan megtörténik.</p>
				<div class="row">
					<div class="col-12 col-lg-10 mx-auto mt-4">
						<figure class="figure">
							<img
								alt="Pont felrajzolása"
								class="figure-img img-fluid rounded shadow-sm"
								:src="`/help/point.gif`"
							>
							<figcaption class="figure-caption text-center">
								Pont felrajzolása
							</figcaption>
						</figure>
					</div>
				</div>
			</div>
			<div class="mb-5">
				<h3 id="vonal">Vonal felrajzolása (kék)</h3>
				<p>A felmérés egyes térképes oldalain (út)vonalakat tud megadni. A projekt gazdája azt várja Öntől, hogy A pontból B-be vezetett, esetlegesen több köztes ponton keresztül vezetett szakaszt jelöljön be a térképen. Ilyen lehet egy közlekedési útvonal vagy akár két terület határa.</p>
				<p>Ezt a térkép jobb felső sarkában található kék alapon fehér kígyózó vonalra (<span class="bg-primary rounded text-white mx-1 p-1"><i class="fas fa-fw fa-route" /></span>) kattintva tudja megtenni. Ezt követően egyszeri kattintással helyezze le a vonal kezdőpontját a térképen. További kattintásokkal jelölje be az útvonala köztes pontjait, majd dupla kattintással a végpontot. Törekedjen rá, hogy minél pontosabban helyezze el a vonalat, szükség esetén egere görgőjével, a +/- gombok segítségével, vagy mobilos nézet esetén két ujjal közelítsen be a térképen.</p>
				<p>Ezt követően a megnyíló párbeszédablakban további indoklást fűzhet a megjelölt vonalhoz. Már rögzített vonal szerkesztésére nincs lehetőség, ha elrontotta, a törléssel (kuka ikon) tudja visszavonni a jelölést. Egy munkalapon több vonalat is megadhat, ehhez újból kattintson a kék alapon fehér kígyózó vonalra. Amennyiben befejezte az elemek hozzáadását, az oldalsáv alján található kék nyíllal tud a következő lapra lépni, a felvitt elemek és szövegek mentése a továbblépéssel automatikusan megtörténik.</p>
				<div class="row">
					<div class="col-12 col-lg-10 mx-auto mt-4">
						<figure class="figure">
							<img
								alt="Vonal felrajzolása"
								class="figure-img img-fluid rounded shadow-sm"
								:src="`/help/line.gif`"
							>
							<figcaption class="figure-caption text-center">
								Vonal felrajzolása
							</figcaption>
						</figure>
					</div>
				</div>
			</div>
			<div class="mb-5">
				<h3 id="alakzat">Poligon felrajzolása (zöld)</h3>
				<p>A felmérés egyes térképes oldalain körülhatárolt területeket tud megadni. A projekt gazdája ilyenkor azt várja Öntől, hogy jelöljön körbe egy (vagy több) területet, amely Ön szerint releváns a kérdés szempontjából.</p>
				<p>Ezt a térkép jobb felső sarkában található zöld alapon fehér körbezárt alakzatra (<span class="bg-success rounded text-white mx-1 p-1"><i class="fas fa-fw fa-draw-polygon" /></span>) kattintva tudja megtenni. Ezt követően egyszeri kattintással helyezze le az alakzat kezdőpontját a térképen. További kattintásokkal jelölje ki a határokat, majd a kezdőpontba érkezve fejezze be a rajzolást. Törekedjen rá, hogy minél pontosabban helyezze el az alakzatot, szükség esetén egere görgőjével, a +/- gombok segítségével, vagy mobilos nézet esetén két ujjal közelítsen be a térképen.</p>
				<p>Ezt követően a jobb oldalon megnyíló párbeszédablakban további indoklást fűzhet a megjelölt vonalhoz. Már rögzített alakzat szerkesztésére nincs lehetőség, ha elrontotta, a törléssel (kuka ikon) tudja visszavonni a jelölést. Egy munkalapon több alakzatot is megadhat, ehhez újból kattintson a zöld alapon fehér körbezárt alakzatra. Amennyiben befejezte az elemek hozzáadását, az oldalsáv alján található kék nyíllal tud a következő lapra lépni, a felvitt elemek és szövegek mentése a továbblépéssel automatikusan megtörténik.</p>
				<div class="row">
					<div class="col-12 col-lg-10 mx-auto mt-4">
						<figure class="figure">
							<img
								alt="Poligon felrajzolása"
								class="figure-img img-fluid rounded shadow-sm"
								:src="`/help/polygon.gif`"
							>
							<figcaption class="figure-caption text-center">
								Poligon felrajzolása
							</figcaption>
						</figure>
					</div>
				</div>
			</div>
			<div class="mb-5">
				<h3 id="mobilnezet">Mobilnézet</h3>
				<p>Amennyiben táblagépen vagy mobiltelefonon szeretne kitölteni egy felmérést, bizonyos nézetek másképp működnek az asztali nézethez képest. A térképes munkalapok esetében a kérdéseket és utasításokat tartalmazó munkalap és a térképes nézet között az elrejt (<span class="bg-white rounded mx-1 p-1"><i class="fas fa-fw fa-angle-double-left" /></span>) és a kinyit (<span class="bg-white rounded mx-1 p-1"><i class="fas fa-fw fa-angle-double-right" /></span>) gombokkal tud váltani. A következő kérdéshez továbblépni csak a kinyitott munkalap alján a tovább gombbal van lehetőség.</p>
			</div>
			<AdminHelpContent />
		</div>
	</PublicFrame>
</template>

<script>
// TODO i18n for template
export default {
	head() {
		return {
			title: this.$t('help.title'),
		};
	},
	nuxtI18n: {
		paths: {
			en: '/how-does-it-work',
		},
	},
};
</script>
