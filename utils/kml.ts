import type { Feature as GeoJsonFeature } from 'geojson';
import { decode } from 'html-entities';
import type { Feature as OlFeature } from 'ol';
import { GeoJSON, KML } from 'ol/format';
import CircleStyle from 'ol/style/Circle';
import { Fill, Stroke, Style } from 'ol/style';
import type { Options } from 'ol/style/Style';

const DEFAULT_COLOR = '#000000';
const DEFAULT_WIDTH = '6';
const EXPORTED_CATEGORY_NAME = 'partimapCategory';
const EXPORTED_DASH_NAME = 'partimapLineStyle';
const EXPORTED_DESCRIPTION_NAME = 'partimapDescription';
const EXPORTED_FILL_OPACITY_NAME = 'partimapFillOpacity';
const EXPORTED_ID_NAME = 'partimapId';
const EXPORTED_HIDDEN_NAME = 'partimapHidden';
const EXPORTED_OPACITY_NAME = 'partimapOpacity';
const EXPORTED_POINT_SIZE = 'partimapPointSize';

const options = {
	// TODO should use the same constants as in Map
	dataProjection: 'EPSG:4326',
	featureProjection: 'EPSG:3857',
};

export function featuresToKML(features: GeoJsonFeature[]) {
	const olFeatures = features.map(pm2ol);
	const kml = new KML().writeFeatures(olFeatures, options);
	return prepareKmlForExport('<?xml version="1.0" encoding="UTF-8"?>' + kml);
}

export function KMLToFeatures(kml: string) {
	const preparedKml = prepareKmlForImport(kml);
	const olFeatures = new KML().readFeatures(preparedKml, options);
	fixFeaturesAfterImport(olFeatures);
	const geoJson = new GeoJSON();
	return olFeatures.map((f) => geoJson.writeFeatureObject(f));
}

function pm2ol(pmf: GeoJsonFeature): OlFeature {
	const olf = new GeoJSON().readFeature(pmf);
	// since GeoJSON does not describe styles in a standard way,
	// we need to set it here similarly as in <ol-style>

	const options: Options = {
		geometry: olf.getGeometry(),
	};
	if (pmf.geometry.type === 'Point') {
		options.image = new CircleStyle({
			radius: pmf.properties?.width || DEFAULT_WIDTH,
			fill: new Fill({ color: pmf.properties?.color || DEFAULT_COLOR }),
		});
	} else {
		// LineString and Polygon
		options.stroke = new Stroke({
			color: pmf.properties?.color || DEFAULT_COLOR,
			lineCap: 'butt',
			lineDash: pmf.properties?.dash || '0',
			width: pmf.properties?.width || DEFAULT_WIDTH,
		});
		if (pmf.geometry.type === 'Polygon') {
			const fillOpacity100 = parseFillOpacity100(pmf);
			const polygonFillColor = pmf.properties?.color + percentToHex(fillOpacity100);
			options.fill = new Fill({
				color: polygonFillColor,
			});
		}
	}
	olf.setStyle(new Style(options));
	return olf;
}

function fixFeaturesAfterImport(features: OlFeature[]) {
	features.forEach((f) => {
		const id = f.getId();
		f.setId(Number(id));
		const d = f.get('description') || '';
		f.set('description', decode(d));
	});
}

function prepareKmlForExport(kmlString: string) {
	const kml = deserializeXML(kmlString);
	kml.querySelectorAll('Placemark').forEach((p) => {
		const ed = ensureElement(kml, p, 'ExtendedData');

		ensureData(kml, ed, EXPORTED_ID_NAME, p.getAttribute('id') || '');
		// TODO should we handle missing ID?

		if (p.querySelector('Point')) {
			// fix missing IconStyle
			const width =
				p.querySelector('ExtendedData Data[name="width"] value')?.innerHTML ||
				DEFAULT_WIDTH;
			const rgb =
				p.querySelector('ExtendedData Data[name="color"] value')?.innerHTML ||
				DEFAULT_COLOR;
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

		renameData(ed, 'fillOpacity', EXPORTED_FILL_OPACITY_NAME);
		renameData(ed, 'hidden', EXPORTED_HIDDEN_NAME);
		renameData(ed, 'opacity', EXPORTED_OPACITY_NAME);

		// cleanup ExtendedData
		ed.querySelectorAll('Data').forEach((d) => {
			const name = d.getAttribute('name');
			if (!name?.startsWith('partimap')) {
				d.remove();
			}

			// formatting partimapFeatureQuestion_ans
			const value = d.querySelector('value');
			if (name === 'partimapFeatureQuestion_ans' && value) {
				const arr = safeParseJSONArray(value.innerHTML);
				value.innerHTML = arr.join(', ');
			}
		});
	});

	return serializeXML(kml);
}

function prepareKmlForImport(kmlString: string) {
	const kml = deserializeXML(kmlString);
	const placemarks = kml.querySelectorAll('Placemark');

	const idBase = new Date().getTime() - placemarks.length;
	placemarks.forEach((p, i) => {
		const ed = ensureElement(kml, p, 'ExtendedData');

		// ensure ID
		const idValueEl = ed.querySelector(`Data[name="${EXPORTED_ID_NAME}"] value`);
		let pId = (idValueEl?.innerHTML || p.getAttribute('id') || '').trim();
		if (!pId || pId.length > 255) pId = String(idBase + i);
		p.setAttribute('id', String(pId));

		// rename back data entries
		renameData(ed, EXPORTED_CATEGORY_NAME, 'category');
		renameData(ed, EXPORTED_DASH_NAME, 'dash');
		renameData(ed, EXPORTED_FILL_OPACITY_NAME, 'fillOpacity');
		renameData(ed, EXPORTED_HIDDEN_NAME, 'hidden');
		renameData(ed, EXPORTED_OPACITY_NAME, 'opacity');
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
		const descValueEl = ed.querySelector(`Data[name="${EXPORTED_DESCRIPTION_NAME}"] value`);
		if (descValueEl && descValueEl.innerHTML) {
			descValueEl.parentElement?.remove();
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
		const autoLinkedDesc = descEl.innerHTML
			.replace(/^<!\[CDATA\[/, '') // remove CDATA header
			.replace(/\]\]>$/, '') // remove CDATA footer.replace(
			.replace(/(\s)(https?:[^ <>"\s]+)/g, '$1<a href="$2" target="_blank">$2</a>');
		descEl.innerHTML = `<![CDATA[${autoLinkedDesc}]]>`;
	});

	return serializeXML(kml);
}

function parseStyleColor(kml: Document, pId: string | number, sId: string | number) {
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

function parseStyleWidth(kml: Document, pId: string | number, sId: string | number) {
	const el =
		kml.querySelector(`Style[id="${sId}-normal"] LineStyle width`) ||
		kml.querySelector(`Style[id="${sId}"] LineStyle width`) ||
		kml.querySelector(`Placemark[id="${pId}"] LineStyle width`) ||
		kml.querySelector(`Placemark[id="${pId}"] Data[name="width"] value`);
	const val = Number(el?.innerHTML);
	return Math.round(Number(val)); // parsing error will yield NaN which is falsy
}

function ensureData(kml: Document, ed: Element, key: string, value: string | number) {
	let d = ed.querySelector(`Data[name="${key}"]`);
	if (!d) {
		d = kml.createElement('Data');
		d.setAttribute('name', key);
		ed.appendChild(d);
	}

	const v = ensureElement(kml, d, 'value');
	v.innerHTML = String(value);
}

function ensureElement(doc: Document, parent: Element, tagName: string) {
	return parent.querySelector(tagName) || parent.appendChild(doc.createElement(tagName));
}

function renameData(ed: Element, oldKey: string, newKey: string) {
	const dataEl = ed.querySelector(`Data[name="${oldKey}"]`);
	if (dataEl) {
		dataEl.setAttribute('name', newKey);
	}
}

function abgrToRgb(abgr: string) {
	// we omit alpha value as it is used dynamically in PARTIMAP
	return abgr.replace(/(\w\w)(\w\w)(\w\w)(\w\w)/, '#$4$3$2');
}

function rgbToAbgr(rgb: string) {
	return rgb.replace(/#(\w\w)(\w\w)(\w\w)/, 'ff$3$2$1');
}

function deserializeXML(str: string) {
	return new DOMParser().parseFromString(str, 'text/xml');
}

function serializeXML(xml: Document) {
	return new XMLSerializer().serializeToString(xml);
}
