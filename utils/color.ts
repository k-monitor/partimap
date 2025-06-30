import type { Feature as GeoJsonFeature } from 'geojson';

// "opacity100" means opacity on a scale of 0 to 100 :)

export const PARTIMAP_BLUE = '#007bff'; // Bootstrap 4 default primary color actually

export const DEFAULT_COLORS: Record<DrawTypeWithOffState, string> = {
	'': '#ffc107',
	Point: '#F44336',
	LineString: '#3F51B5',
	Polygon: '#49a238',
	box: '#000000',
};

export const COLOR_PALETTE = [
	'#F44336',
	'#E91E63',
	'#9C27B0',
	'#673AB7',
	'#3F51B5',
	'#2196F3',
	'#03A9F4',
	'#00BCD4',
	'#009688',
	'#4CAF50',
	'#8BC34A',
	'#CDDC39',
	'#FFEB3B',
	'#ffc107',
	'#FF9800',
	'#FF5722',
	'#795548',
	'#9E9E9E',
	'#000000',
	'#607D8B',
];

export const DEFAULT_FILL_OPACITY_100 = 10;

export function parseFillOpacity100(f: GeoJsonFeature) {
	const opacity = parseInt(f.properties?.fillOpacity, 10);
	return isNaN(opacity) ? DEFAULT_FILL_OPACITY_100 : opacity;
}

export function parseOpacity100(f: GeoJsonFeature) {
	const opacity = parseInt(f.properties?.opacity, 10);
	return isNaN(opacity) ? 100 : opacity;
}

export function percentToHex(value100: number) {
	const valueDec = Math.round(value100 * 2.55);
	return valueDec.toString(16).padStart(2, '0');
}
