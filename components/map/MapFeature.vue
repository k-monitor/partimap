<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';
import tinycolor from 'tinycolor2';
import wordWrap from 'word-wrap';

const props = defineProps<{
	f: GeoJsonFeature;
	labelOverride?: string;
	grayRated?: boolean;
	visitor?: boolean;
}>();

const { currentZoom, selectedFeatureId } = useStore();

const isSomeFeatureSelected = computed(() => !!selectedFeatureId.value);
const isSelected = computed(() => selectedFeatureId.value === props.f.id);
const isUnselected = computed(() => isSomeFeatureSelected.value && !isSelected.value);
const isHidden = computed(() => props.f.properties?.hidden);

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

	const font = `bold ${sizes.value.fontSize}px sans-serif`;
	return { font, rotation, text };
});

// line style
const lineDash = computed(() => {
	const dash = props.f.properties?.dash || '1'; // FIXME shouldn't this be 0? see Map.vue default
	return dash.split(',').map((w: string) => Number(w) * sizes.value.featureSize);
});
</script>

<template>
	<ol-feature>
		<ol-geom-point
			v-if="f.geometry.type === 'Point'"
			:coordinates="f.geometry.coordinates"
		/>
		<ol-geom-line-string
			v-else-if="f.geometry.type === 'LineString'"
			:coordinates="f.geometry.coordinates"
		/>
		<ol-geom-polygon
			v-else-if="f.geometry.type === 'Polygon'"
			:coordinates="f.geometry.coordinates"
		/>

		<ol-style :z-index="zIndex">
			<template v-if="f.geometry.type === 'Point'">
				<ol-style-circle :radius="sizes.featureSize * 3">
					<ol-style-fill :color="colors.colorWithOpacity" />
					<ol-style-stroke
						:color="null"
						:width="0"
					/>
				</ol-style-circle>
			</template>
			<template v-else>
				<!-- LineString or Polygon -->
				<ol-style-stroke
					:color="colors.colorWithOpacity"
					line-cap="butt"
					:line-dash="lineDash"
					:width="sizes.featureSize"
				/>
			</template>

			<ol-style-fill
				v-if="f.geometry.type === 'Polygon'"
				:color="colors.polygonFillColor"
			/>

			<ol-style-text
				:background-fill="colors.colorWithOpacity"
				:fill="colors.textColor"
				:font="textParams.font"
				:offset-y="1"
				:overflow="true"
				:padding="[3, 3, 3, 3]"
				placement="point"
				:rotation="textParams.rotation"
				:text="textParams.text"
			/>
		</ol-style>
	</ol-feature>
</template>
