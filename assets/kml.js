import KML from 'ol/format/KML';

const EXPORTED_DASH_NAME = 'partimapLineStyle';
const EXPORTED_DESCRIPTION_NAME = 'partimapDescription';
const EXPORTED_POINT_SIZE = 'partimapPointSize';
const ALLOWED_DATA = [
	EXPORTED_DASH_NAME,
	EXPORTED_DESCRIPTION_NAME,
	EXPORTED_POINT_SIZE,
];

const options = {
	dataProjection: 'EPSG:4326',
	featureProjection: 'EPSG:3857',
};

export function featuresToKML(features) {
	const kml = new KML().writeFeatures(features, options);
	return prepareKmlForExport('<?xml version="1.0" encoding="UTF-8"?>' + kml);
}

export function KMLToFeatures(kml) {
	const preparedKml = prepareKmlForImport(kml);
	return new KML().readFeatures(preparedKml, options);
}

function prepareKmlForExport(kmlString) {
	const kml = deserializeXML(kmlString);
	kml.querySelectorAll('Placemark').forEach(p => {
		// ensure ExtendedData
		const ed = p.querySelector('ExtendedData') || p.appendChild(kml.createElement('ExtendedData'));

		if (p.querySelector('Point')) {
			// fix missing IconStyle
			const width = p.querySelector('ExtendedData Data[name="width"] value')?.innerHTML || '4';
			const rgb = p.querySelector('ExtendedData Data[name="color"] value')?.innerHTML || '#000000';
			const argb = rgbToAbgr(rgb);
			const style = p.querySelector('Style') || p.appendChild(kml.createElement('Style'));
			style.innerHTML = `
				<IconStyle>
					<color>${argb}</color>
					<scale>1</scale>
					<Icon>
						<href>https://www.gstatic.com/mapspro/images/stock/503-wht-blank_maps.png</href>
					</Icon>
					<hotSpot x="32" xunits="pixels" y="64" yunits="insetPixels"/>
				</IconStyle>
			`;

			// save point size in a dedicated data entry
			ensureData(kml, ed, EXPORTED_POINT_SIZE, width);
			// other geometry types will have their
			// line widths in Style due to `writeFeatures`
		}

		// move `description` into `ExtendedData` with custom key
		// (because Google MyMaps messes up `description` on export)
		const descEl = p.querySelector('description');
		if (descEl) {
			const desc = descEl.innerHTML;
			p.removeChild(descEl);
			ensureData(kml, ed, EXPORTED_DESCRIPTION_NAME, desc);
		}

		// rename "dash" data entry to less confusing name
		const dashEl = ed.querySelector('Data[name="dash"]');
		if (dashEl && !p.querySelector('Point')) {
			dashEl.setAttribute('name', EXPORTED_DASH_NAME);
		}

		// cleanup ExtendedData
		ed.querySelectorAll('Data').forEach(d => {
			const name = d.getAttribute('name');
			if (!ALLOWED_DATA.includes(name)) { d.remove(); }
		});
	});

	return serializeXML(kml);
}

function prepareKmlForImport(kmlString) {
	const kml = deserializeXML(kmlString);
	const placemarks = kml.querySelectorAll('Placemark');

	const idBase = new Date().getTime() - placemarks.length;
	placemarks.forEach((p, i) => {
		// ensure ID
		const pId = p.getAttribute('id') || idBase + i;
		p.setAttribute('id', pId);

		// parse style parameters
		const styleUrlEl = p.querySelector('styleUrl');
		const sId = (styleUrlEl?.innerHTML || '').split('#')[1];
		// we need that split thing, sometimes it's a full URL
		const color = parseStyleColor(kml, pId, sId);
		const width = parseStyleWidth(kml, pId, sId);

		// remove styleUrl as it is unnecessary now and creates bugs later on
		styleUrlEl?.remove();

		// ensure ExtendedData
		const ed = p.querySelector('ExtendedData') || p.appendChild(kml.createElement('ExtendedData'));

		// update ExtendedData
		ensureData(kml, ed, 'color', color);
		ensureData(kml, ed, 'width', width);

		// move back `description` from `ExtendedData` (see exporter)
		const descValueEl = ed.querySelector(`Data[name="${EXPORTED_DESCRIPTION_NAME}"] value`);
		const desc = descValueEl?.innerHTML;
		if (desc) {
			descValueEl.parentElement.remove();
			const descEl = p.querySelector('description') || p.appendChild(kml.createElement('description'));
			descEl.innerHTML = desc;
		}

		// rename "dash" data entry back to original name (see exporter)
		const dashEl = ed.querySelector(`Data[name="${EXPORTED_DASH_NAME}"]`);
		if (dashEl) { dashEl.setAttribute('name', 'dash'); }
	});

	return serializeXML(kml);
}

function parseStyleColor(kml, pId, sId) {
	const el =
		kml.querySelector(`Style[id="${sId}-normal"] LineStyle color`) ||
		kml.querySelector(`Style[id="${sId}"] LineStyle color`) ||
		kml.querySelector(`Style[id="${sId}-normal"] IconStyle color`) ||
		kml.querySelector(`Style[id="${sId}"] IconStyle color`) ||
		kml.querySelector(`Placemark[id="${pId}"] LineStyle color`) ||
		kml.querySelector(`Placemark[id="${pId}"] IconStyle color`);
	const val = el?.innerHTML;
	return val ? abgrToRgb(val) : null;
}

function parseStyleWidth(kml, pId, sId) {
	const el =
		kml.querySelector(`Style[id="${sId}-normal"] LineStyle width`) ||
		kml.querySelector(`Style[id="${sId}"] LineStyle width`) ||
		kml.querySelector(`Placemark[id="${pId}"] LineStyle width`) ||
		kml.querySelector(`Placemark[id="${pId}"] Data[name="${EXPORTED_POINT_SIZE}"] value`);
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
	return abgr.replace(/(\w\w)(\w\w)(\w\w)(\w\w)/, '#$4$3$2');
}

function rgbToAbgr(rgb) {
	return rgb.replace(/#(\w\w)(\w\w)(\w\w)/, 'ff$3$2$1');
}

function deserializeXML(str) {
	return new DOMParser().parseFromString(str, 'text/xml');
}

function serializeXML(xml) {
	return new XMLSerializer().serializeToString(xml);
}
