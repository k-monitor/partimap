import KML from 'ol/format/KML';

const options = {
	dataProjection: 'EPSG:4326',
	featureProjection: 'EPSG:3857',
};

export function featuresToKML(features) {
	let kml = new KML().writeFeatures(features, options);

	// fixing missing IconStyle
	const search = /<Style\/>(<ExtendedData>.*?>#(\w\w)(\w\w)(\w\w)<.*?<\/ExtendedData>)/g;
	const replace =
		'<Style><IconStyle><color>ff$4$3$2</color><scale>1</scale><Icon><href>https://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png</href></Icon><hotSpot x="32" xunits="pixels" y="64" yunits="insetPixels"/></IconStyle></Style>$1';
	kml = kml.replace(search, replace);

	return '<?xml version="1.0" encoding="UTF-8"?>' + kml;
}

export function KMLToFeatures(kml) {
	const preparedKml = prepareKmlForImport(kml);
	const features = new KML().readFeatures(preparedKml, options);
	// TODO f.get('dash') holds correct value, but style not set
	return features;
}

function prepareKmlForImport(kmlString) {
	const kml = new DOMParser().parseFromString(kmlString, 'text/xml');
	const placemarks = kml.querySelectorAll('Placemark');

	const idBase = new Date().getTime() - placemarks.length;
	placemarks.forEach((p, i) => {
		// ensure ID
		const pId = p.getAttribute('id') || idBase + i;
		p.setAttribute('id', pId);

		// parse style parameters
		const sId = p.querySelector('styleUrl')?.innerHTML?.substring(1);
		const color = parseStyleColor(kml, pId, sId);
		const width = parseStyleWidth(kml, pId, sId);

		// ensure ExtendedData
		const ed = p.querySelector('ExtendedData') || p.appendChild(kml.createElement('ExtendedData'));

		// update ExtendedData
		ensureData(kml, ed, 'color', color);
		ensureData(kml, ed, 'width', width);
	});

	return new XMLSerializer().serializeToString(kml);
}

function parseStyleColor(kml, pId, sId) {
	const el =
		kml.querySelector(`#${sId}-normal LineStyle color`) ||
		kml.querySelector(`#${sId} LineStyle color`) ||
		kml.querySelector(`#${sId}-normal IconStyle color`) ||
		kml.querySelector(`#${sId} IconStyle color`) ||
		kml.querySelector(`Placemark[id="${pId}"] LineStyle color`) ||
		kml.querySelector(`Placemark[id="${pId}"] IconStyle color`);
	const val = el?.innerHTML;
	return val ? abgrToRgb(val) : null;
}

function parseStyleWidth(kml, pId, sId) {
	const el =
		kml.querySelector(`#${sId}-normal LineStyle width`) ||
		kml.querySelector(`#${sId} LineStyle width`) ||
		kml.querySelector(`Placemark[id="${pId}"] LineStyle width`);
	const val = Number(el?.innerHTML);
	return Math.round(Number(val)); // parsing error will yield NaN which is falsy
}

function ensureData(kml, ed, key, value) {
	if (!value) { return; }

	let d = ed.querySelector(`Data[name="${key}"]`);
	if (!d) {
		d = kml.createElement('Data');
		d.setAttribute('name', key);
		ed.appendChild(d);
	}

	const v = d.querySelector('value') || d.appendChild(kml.createElement('value'));
	v.innerHTML = value;
}

function abgrToRgb(abgr) {
	// we omit alpha value as it is used dynamically in Partimap
	return `#${abgr[6]}${abgr[7]}${abgr[4]}${abgr[5]}${abgr[2]}${abgr[3]}`;
}
