import { Tile as TileLayer } from 'ol/layer';
import { OSM, XYZ } from 'ol/source';

const cycleOsmAttribution =
	'Map tiles by <a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a>; Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const stamenAttribution =
	'&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> <a href="https://stamen.com/" target="_blank">&copy; Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors';

const esriAttribution =
	'Map tiles &copy; Esri; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community; Labels by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

function tl(attributions, url) {
	return new TileLayer({ source: new XYZ({ attributions, url }) });
}

const baseMapCreators = {
	osm: () => [new TileLayer({ source: new OSM() })],
	cycleosm: () => [
		tl(
			cycleOsmAttribution,
			'https://c.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png'
		),
	],
	toner: () => [
		tl(
			stamenAttribution,
			'https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png'
		),
	],
	terrain: () => [
		tl(
			stamenAttribution,
			'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png'
		),
	],
	'esri-wi': () => [
		tl(
			esriAttribution,
			'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
		),
		tl(
			'',
			'https://stamen-tiles-c.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.png'
		),
	],
};

export const baseMapList = Object.keys(baseMapCreators);

// Yes, it needs to be a function, so layers will be created for every Map instance.
// If we use it as a singleton object, map flickers as hell...
const createBaseMaps = () => {
	const maps = {};
	Object.keys(baseMapCreators).forEach(key => {
		maps[key] = baseMapCreators[key]();
	});
	return maps;
};

export default createBaseMaps;
