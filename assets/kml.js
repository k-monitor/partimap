import KML from 'ol/format/KML';

const DEFAULT_COLOR = '#000000';
const DEFAULT_WIDTH = '6';
const EXPORTED_CATEGORY_NAME = 'partimapCategory';
const EXPORTED_DASH_NAME = 'partimapLineStyle';
const EXPORTED_DESCRIPTION_NAME = 'partimapDescription';
const EXPORTED_ID_NAME = 'partimapId';
const EXPORTED_HIDDEN_NAME = 'partimapHidden';
const EXPORTED_POINT_SIZE = 'partimapPointSize';

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
		const ed = ensureElement(kml, p, 'ExtendedData');

		ensureData(kml, ed, EXPORTED_ID_NAME, p.getAttribute('id'));

		if (p.querySelector('Point')) {
			// fix missing IconStyle
			const width =
				p.querySelector('ExtendedData Data[name="width"] value')
					?.innerHTML || DEFAULT_WIDTH;
			const rgb =
				p.querySelector('ExtendedData Data[name="color"] value')
					?.innerHTML || DEFAULT_COLOR;
			const argb = rgbToAbgr(rgb);
			const style = ensureElement(kml, p, 'Style');
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
			p.removeChild(descEl);
		}
		ensureData(kml, ed, EXPORTED_DESCRIPTION_NAME, descEl?.innerHTML || '');

		// rename "category" and "dash" data entries to less confusing names
		renameData(ed, 'category', EXPORTED_CATEGORY_NAME);
		if (!p.querySelector('Point')) {
			// points don't need dash, cleanup below will delete it
			renameData(ed, 'dash', EXPORTED_DASH_NAME);
		}

		renameData(ed, 'hidden', EXPORTED_HIDDEN_NAME);

		// cleanup ExtendedData
		ed.querySelectorAll('Data').forEach(d => {
			const name = d.getAttribute('name');
			if (!name.startsWith('partimap')) {
				d.remove();
			}

			// formatting partimapFeatureQuestion_ans
			if (name === 'partimapFeatureQuestion_ans') {
				const value = d.querySelector('value');
				try {
					const v = JSON.parse(value.innerHTML);
					if (Array.isArray(v)) value.innerHTML = v.join(', ');
				} catch {}
			}
		});
	});

	return serializeXML(kml);
}

function prepareKmlForImport(kmlString) {
	const kml = deserializeXML(kmlString);
	const placemarks = kml.querySelectorAll('Placemark');

	const idBase = new Date().getTime() - placemarks.length;
	placemarks.forEach((p, i) => {
		const ed = ensureElement(kml, p, 'ExtendedData');

		// ensure ID
		const idValueEl = ed.querySelector(
			`Data[name="${EXPORTED_ID_NAME}"] value`
		);
		const pId = idValueEl?.innerHTML || p.getAttribute('id') || idBase + i;
		p.setAttribute('id', pId);

		// rename back data entries
		renameData(ed, EXPORTED_CATEGORY_NAME, 'category');
		renameData(ed, EXPORTED_DASH_NAME, 'dash');
		renameData(ed, EXPORTED_HIDDEN_NAME, 'hidden');
		renameData(ed, EXPORTED_POINT_SIZE, 'width'); // needed for width parsing

		// parse style parameters
		const styleUrlEl = p.querySelector('styleUrl');
		const sId = (styleUrlEl?.innerHTML || '').split('#')[1];
		// we need that split thing, sometimes it's a full URL
		const color = parseStyleColor(kml, pId, sId);
		const width = parseStyleWidth(kml, pId, sId);

		// remove styleUrl as it is unnecessary now and creates bugs later on
		styleUrlEl?.remove();

		// update ExtendedData
		ensureData(kml, ed, 'color', color || DEFAULT_COLOR);
		ensureData(kml, ed, 'width', width || DEFAULT_WIDTH);

		// move back `description` from `ExtendedData` (see exporter)
		const descEl = ensureElement(kml, p, 'description');
		const descValueEl = ed.querySelector(
			`Data[name="${EXPORTED_DESCRIPTION_NAME}"] value`
		);
		if (descValueEl && descValueEl.innerHTML) {
			descValueEl.parentElement.remove();
			descEl.innerHTML = descValueEl.innerHTML;
		} else {
			// no partimapDescription, using <description>
			// but trying to clean it up
			const desc = descEl.innerHTML
				.replace(/^<!\[CDATA\[/, '') // remove CDATA header
				.replace(/\]\]>$/, '') // remove CDATA footer
				.trim()
				.replace(/^[^ :<]+: /, '') // remove leading "desc:" part (can be any language...)
				.replace(/<br>partimap\w+:.*?(?=<br>\w+:|$)/g, '') // remove PARTIMAP data fields
				.replace(/<br>\w+:\s*(?=<br>\w+:|$)/g, '') // remove empty key-value pairs
				.replace(/<br>/gi, '<br/>'); // make BR tags valid
			descEl.innerHTML = desc.trim();
		}

		// auto linking
		descEl.innerHTML = descEl.innerHTML
			.replace(/^<!\[CDATA\[/, '') // remove CDATA header
			.replace(/\]\]>$/, '') // remove CDATA footer.replace(
			.replace(
				/\s(https?:[^ <>"\s]+)/g,
				'<a href="$1" target="_blank">$1</a>'
			);
		descEl.innerHTML = `<![CDATA[${descEl.innerHTML}]]>`;
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
		kml.querySelector(`Placemark[id="${pId}"] Data[name="width"] value`);
	const val = Number(el?.innerHTML);
	return Math.round(Number(val)); // parsing error will yield NaN which is falsy
}

function ensureData(kml, ed, key, value) {
	let d = ed.querySelector(`Data[name="${key}"]`);
	if (!d) {
		d = kml.createElement('Data');
		d.setAttribute('name', key);
		ed.appendChild(d);
	}

	const v = ensureElement(kml, d, 'value');
	v.innerHTML = value;
}

function ensureElement(doc, parent, tagName) {
	return (
		parent.querySelector(tagName) ||
		parent.appendChild(doc.createElement(tagName))
	);
}

function renameData(ed, oldKey, newKey) {
	const dataEl = ed.querySelector(`Data[name="${oldKey}"]`);
	if (dataEl) {
		dataEl.setAttribute('name', newKey);
	}
}

function abgrToRgb(abgr) {
	// we omit alpha value as it is used dynamically in PARTIMAP
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
