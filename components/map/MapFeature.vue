<script setup lang="ts">
import type { Feature } from 'geojson';
import tinycolor from 'tinycolor2';
import wordWrap from 'word-wrap';

const props = defineProps<{
	f: Feature;
	labelOverride?: string;
	grayRated?: boolean;
	visitor?: boolean;
}>();

const { currentZoom } = useStore();

const selFeatureId = ref(0); // FIXME read selected feature ID from store
const isSomeFeatureSelected = computed(() => !!selFeatureId.value);
const isSelected = computed(() => selFeatureId.value === props.f.id);
const isUnselected = computed(() => isSomeFeatureSelected.value && !isSelected.value);
const isHidden = computed(() => props.f.properties?.hidden);

// FIXME filter... maybe on Map level?
/*
// filter
const isFilterActive = this.filteredIds !== null;
const featureIncluded = this.filteredIds?.includes(feature.getId()) || isHidden;
if (isFilterActive && !featureIncluded) {
	return feature.setStyle(() => false); // hide
}
*/

// z-index
const zIndex = computed(() => {
	if (isHidden.value) return -1;
	if (isSelected.value) return 1;
	return 0;
});

// color and opacity
function toHex(value100: number) {
	const valueDec = Math.round(value100 * 2.55);
	return valueDec.toString(16).padStart(2, '0');
}
const colors = computed(() => {
	let color = props.f.properties?.color || '#000000';
	if (props.grayRated) {
		const rating = props.f.properties?.rating;
		const isRated = Number.isInteger(rating) && rating !== 0;
		if (isRated) color = '#666666';
	}

	const opacity100 = parseOpacity100(props.f) * (isUnselected.value ? 0.35 : 1);
	const fillOpacity100 = parseFillOpacity100(props.f) * (isUnselected.value ? 0.35 : 1);
	const textOpacity100 = 100 * (isUnselected.value ? 0.8 : 1);

	const colorWithOpacity = color + toHex(opacity100);
	const polygonFillColor = color + toHex(fillOpacity100);

	let reference = tinycolor.mix('#ffffff', color, opacity100);
	if (props.f.geometry.type === 'Polygon') {
		reference = tinycolor.mix(reference, color, fillOpacity100);
	}
	const isLight = reference.isLight();
	const textOpacity = toHex(textOpacity100);
	const textColor = (isLight ? '#000000' : '#ffffff') + textOpacity;

	return { colorWithOpacity, polygonFillColor, textColor };
});

// size
const sizes = computed(() => {
	const baseFeatureSize = Math.max(1, Number(props.f.properties?.width) || 1);
	let featureSize = baseFeatureSize;
	if (props.visitor) {
		const isPoint = props.f.geometry.type === 'Point';
		if (!isHidden.value && isSelected.value && !isPoint) featureSize += 5;
	}
	const zoom = currentZoom.value;
	featureSize -= 0.75 * (19 - zoom);
	let fontSize = featureSize * 3.5;
	if (baseFeatureSize < 5) {
		const featureSizeAdj = 5 - baseFeatureSize + 1;
		fontSize += featureSizeAdj * 3.5;
	}
	featureSize = Math.max(2, featureSize);
	return { featureSize, fontSize };
});

// text
const textParams = computed(() => {
	let rotation = 0;
	let text = '';
	if (sizes.value.fontSize >= 8) {
		const isInResultsMode = !!props.labelOverride;
		const angle = Number(props.f.properties?.partimapMapLabelAngle || 0); // deg
		rotation = isInResultsMode ? 0 : angle * (Math.PI / 180); // rad
		text =
			isInResultsMode && !isHidden
				? props.labelOverride
				: props.f.properties?.partimapMapLabel;
		text = wordWrap(text || '', {
			indent: '',
			trim: true,
			width: 25, // chars
		});
	}
	return { rotation, text };
});

// line style
const lineDash = computed(() => {
	const dash = props.f.properties?.dash || '1';
	return dash.split(',').map((w: string) => Number(w) * sizes.value.featureSize);
});

// FIXME
/*
const style = new Style({
	text: new Text({
		font: `bold ${fontSize}px sans-serif`,
		text,
		placement: 'point',
		backgroundFill: fill(colorWithOpacity),
		fill: fill(textColor),
		offsetY: 1,
		overflow: true,
		padding: [3, 3, 3, 3],
		rotation,
	}),
});
 */
</script>

<template>
	<template v-if="f.geometry.type === 'Point'">
		<ol-geom-point :coordinates="f.geometry.coordinates" />
		<ol-style :z-index="zIndex">
			<ol-style-circle :radius="sizes.featureSize * 3">
				<ol-style-fill :color="colors.colorWithOpacity" />
				<ol-style-stroke
					:color="null"
					:width="0"
				/>
			</ol-style-circle>
		</ol-style>
	</template>

	<template v-else-if="f.geometry.type === 'LineString'">
		<ol-geom-line-string :coordinates="f.geometry.coordinates" />
		<ol-style :z-index="zIndex">
			<ol-style-stroke
				:color="colors.colorWithOpacity"
				line-cap="butt"
				:line-dash="lineDash"
				:width="sizes.featureSize"
			/>
		</ol-style>
	</template>

	<template v-else-if="f.geometry.type === 'Polygon'">
		<ol-geom-polygon :coordinates="f.geometry.coordinates" />
		<ol-style :z-index="zIndex">
			<ol-style-stroke
				:color="colors.colorWithOpacity"
				line-cap="butt"
				:line-dash="lineDash"
				:width="sizes.featureSize"
			/>
			<ol-style-fill :color="colors.polygonFillColor" />
		</ol-style>
	</template>
</template>
