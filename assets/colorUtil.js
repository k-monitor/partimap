export const DEFAULT_FILL_OPACITY_100 = 10;

// "opacity100" means opacity on a scale of 0 to 100 :)

export function parseFillOpacity100(feature) {
	const opacity = parseInt(feature.get('fillOpacity'), 10);
	return isNaN(opacity) ? DEFAULT_FILL_OPACITY_100 : opacity;
}

export function parseOpacity100(feature) {
	const opacity = parseInt(feature.get('opacity'), 10);
	return isNaN(opacity) ? 100 : opacity;
}
