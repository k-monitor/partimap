import type { Feature as GeoJsonFeature } from 'geojson';

// "opacity100" means opacity on a scale of 0 to 100 :)

export const DEFAULT_FILL_OPACITY_100 = 10;

export function parseFillOpacity100(f: GeoJsonFeature) {
	const opacity = parseInt(f.properties?.fillOpacity, 10);
	return isNaN(opacity) ? DEFAULT_FILL_OPACITY_100 : opacity;
}

export function parseOpacity100(f: GeoJsonFeature) {
	const opacity = parseInt(f.properties?.opacity, 10);
	return isNaN(opacity) ? 100 : opacity;
}
