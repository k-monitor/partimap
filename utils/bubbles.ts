import type { Feature as GeoJsonFeature } from 'geojson';

export function isFeatureDescriptionEmpty(feature: GeoJsonFeature) {
	return !(feature.properties?.description || '')
		.replace(/<iframe.*?>/, 'iframe')
		.replace(/<.*?>/g, '')
		.trim();
}
