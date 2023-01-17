import KML from 'ol/format/KML';

export function featuresToKML(features) {
	let kml = new KML().writeFeatures(features, {
		dataProjection: 'EPSG:4326',
		featureProjection: 'EPSG:3857',
	});

	// fixing missing IconStyle
	const search = /<Style\/>(<ExtendedData>.*?>#(\w\w)(\w\w)(\w\w)<.*?<\/ExtendedData>)/g;
	const replace =
		'<Style><IconStyle><color>ff$4$3$2</color><scale>1</scale><Icon><href>https://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png</href></Icon><hotSpot x="32" xunits="pixels" y="64" yunits="insetPixels"/></IconStyle></Style>$1';
	kml = kml.replace(search, replace);

	return '<?xml version="1.0" encoding="UTF-8"?>' + kml;
}

export function KMLToFeatures(kmlString) {
	const kmlParser = new DOMParser().parseFromString(
		kmlString,
		'text/xml'
	);

	const features = new KML().readFeatures(kmlString, {
		dataProjection: 'EPSG:4326',
		featureProjection: 'EPSG:3857',
	});
	features.forEach((f, i) => {
		const fid = f.getId() || ((new Date().getTime() % 10000000) * 1000 + i);
		f.setId(fid);

		const styleId = f.get('styleUrl')?.split('#')[1];
		const colorEl =
			kmlParser.querySelector(`#${styleId}-normal LineStyle color`) ||
			kmlParser.querySelector(`#${styleId} LineStyle color`) ||
			kmlParser.querySelector(`#${styleId}-normal IconStyle color`) ||
			kmlParser.querySelector(`#${styleId} IconStyle color`) ||
			kmlParser.querySelector(`Placemark[id="${fid}"] color`) ||
			{};
		const abgr = colorEl.innerHTML;
		if (abgr) {
			const color =
				'#' +
				abgr[6] +
				abgr[7] +
				abgr[4] +
				abgr[5] +
				abgr[2] +
				abgr[3];
			f.set('color', color);
		}

		const widthEl =
			kmlParser.querySelector(`#${styleId}-normal LineStyle width`) ||
			kmlParser.querySelector(`#${styleId} LineStyle width`) ||
			kmlParser.querySelector(`Placemark[id="${fid}"] width`) ||
			{};
		if (widthEl.innerHTML) {
			const w = Math.round(Number(widthEl.innerHTML));
			f.set('width', w);
		}

		const dashEl =
			// TODO read value from Google MyMaps KMLs too
			kmlParser.querySelector(`Placemark[id="${fid}"] [name="dash"] value`) ||
			{};
		if (dashEl.innerHTML) {
			// TODO reads correct value for Partimap KMLs, but not sets it (WHY?)
			f.set('dash', dashEl.innerHTML);
		}
	});

	return features;
}
