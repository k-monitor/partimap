import { Tile as TileLayer } from 'ol/layer';
import { OSM, Stamen, XYZ } from 'ol/source';

const cycleOsmAttribution = 'Map tiles by <a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a>; Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const stamenAttribution = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const esriAttribution = 'Map tiles &copy; Esri; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community; Labels by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function tl(attributions, url) {
	return new TileLayer({ source: new XYZ({ attributions, url }) });
}

const BASEMAPS = {
	osm: [new TileLayer({ source: new OSM() })],
	cycleosm: [tl(cycleOsmAttribution, 'https://c.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png')],
	toner: [new TileLayer({ source: new Stamen({ attribution: stamenAttribution, layer: 'toner' }) })],
	terrain: [new TileLayer({ source: new Stamen({ attribution: stamenAttribution, layer: 'terrain' }) })],
	'esri-wi': [
		tl(esriAttribution, 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
		tl('', 'https://stamen-tiles-c.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.png'),
	],
};

export default BASEMAPS;
