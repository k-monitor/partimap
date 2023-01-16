import { Tile as TileLayer } from 'ol/layer';
import { OSM, Stamen, XYZ } from 'ol/source';

const cycleOsmAttribution = 'Map tiles by <a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a>; Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const stamenAttribution = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const BASEMAPS = {
	osm: new TileLayer({ source: new OSM() }),
	cycleosm: new TileLayer({
		source: new XYZ({
			attributions: cycleOsmAttribution,
			url: 'https://c.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
		}),
	}),
	toner: new TileLayer({ source: new Stamen({ attribution: stamenAttribution, layer: 'toner' }) }),
	terrain: new TileLayer({ source: new Stamen({ attribution: stamenAttribution, layer: 'terrain' }) }),
};

export default BASEMAPS;
