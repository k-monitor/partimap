<script setup lang="ts">
import type { Feature as GeoJsonFeature } from 'geojson';

const feature = inject<GeoJsonFeature>('feature');

const { t } = useI18n();

const dashOptions = [
	{
		text: t('FeatureListElement.dashTypes.p0'),
		value: '0',
	},
	{
		text: t('FeatureListElement.dashTypes.p11'),
		value: '1,1',
	},
	{
		text: t('FeatureListElement.dashTypes.p21'),
		value: '2,1',
	},
	{
		text: t('FeatureListElement.dashTypes.p41'),
		value: '4,1',
	},
	{
		text: t('FeatureListElement.dashTypes.p1131'),
		value: '1,1,3,1',
	},
];

const extraStrokeOptions = computed(() =>
	[
		// TODO would be nice to use types (in feature.properties too)
		{ value: 'no', text: t('FeatureListElement.extraStrokeOptions.no') },
		{ value: 'bk', text: t('FeatureListElement.extraStrokeOptions.bk') },
		{ value: 'bk2', text: t('FeatureListElement.extraStrokeOptions.bk2') },
		{ value: 'wh', text: t('FeatureListElement.extraStrokeOptions.wh') },
		{ value: 'wh2', text: t('FeatureListElement.extraStrokeOptions.wh2') },
		{ value: 'gr', text: t('FeatureListElement.extraStrokeOptions.gr') },
		{ value: 'gr2', text: t('FeatureListElement.extraStrokeOptions.gr2') },
		{ value: 'own2', text: t('FeatureListElement.extraStrokeOptions.own2') },
		{ value: 'dwh', text: t('FeatureListElement.extraStrokeOptions.dwh') },
	].filter((o) => o.value != 'dwh' || feature?.geometry?.type != 'Point'),
);

onMounted(() => {
	if (!feature) return;
	const p = feature.properties || {};
	feature.properties = feature.properties || {};
	feature.properties = {
		...feature.properties,
		extraStroke: p.extraStroke || DEFAULT_EXTRA_STROKE,
		partimapMapLabel: p.partimapMapLabel || '',
		partimapMapLabelAngle: parseInt(p.partimapMapLabelAngle, 10) || 0,
		fillOpacity: parseFillOpacity100(feature),
		opacity: parseOpacity100(feature),
	};
});
</script>

<template>
	<div v-if="feature && feature.properties">
		<b-row
			align-h="between"
			align-v="center"
		>
			<b-col>
				<b-form-group :label="$t('FeatureListElement.color')">
					<b-form-input
						id="type-color"
						v-model="feature.properties.color"
						class="w-100"
						size="sm"
						type="color"
						list="presetColors"
					/>
					<datalist id="presetColors">
						<option
							v-for="c in COLOR_PALETTE"
							:key="c"
						>
							{{ c }}
						</option>
					</datalist>
				</b-form-group>
			</b-col>
			<b-col>
				<b-form-group :label="$t('FeatureListElement.size')">
					<b-form-input
						v-model.number="feature.properties.width"
						size="sm"
						type="number"
					/>
				</b-form-group>
			</b-col>
		</b-row>

		<b-row
			align-h="between"
			align-v="center"
		>
			<b-col v-if="feature.geometry.type !== 'Point'">
				<b-form-group :label="$t('FeatureListElement.dashType')">
					<b-form-select
						v-model="feature.properties.dash"
						size="sm"
						:options="dashOptions"
					/>
				</b-form-group>
			</b-col>
			<b-col>
				<b-form-group :label="$t('FeatureListElement.extraStroke')">
					<b-form-select
						v-model="feature.properties.extraStroke"
						size="sm"
						:options="extraStrokeOptions"
					/>
				</b-form-group>
			</b-col>
		</b-row>
		<b-form-group :label="$t('FeatureListElement.opacity')">
			<div class="d-flex align-items-center">
				<i class="far fa-square fa-w me-2" />
				<div>0%</div>
				<b-form-input
					v-model.number="feature.properties.opacity"
					class="mx-2 mb-1"
					max="100"
					min="0"
					step="10"
					type="range"
				/>
				<div>100%</div>
			</div>
			<div
				v-if="
					feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon'
				"
				class="d-flex align-items-center mt-2"
			>
				<i class="fas fa-square fa-w me-2" />
				<div>0%</div>
				<b-form-input
					v-model.number="feature.properties.fillOpacity"
					class="mx-2 mb-1"
					max="100"
					min="0"
					step="10"
					type="range"
				/>
				<div>100%</div>
			</div>
		</b-form-group>

		<b-form-group :label="$t('FeatureListElement.mapLabel')">
			<b-form-input
				v-model.trim="feature.properties.partimapMapLabel"
				size="sm"
				type="text"
			/>
		</b-form-group>

		<b-form-group v-if="feature.properties.partimapMapLabel">
			<div class="d-flex align-items-center">
				<div>-90°</div>
				<b-form-input
					v-model.number="feature.properties.partimapMapLabelAngle"
					class="mx-2 mb-1"
					max="90"
					min="-90"
					step="5"
					type="range"
				/>
				<div>90°</div>
			</div>
		</b-form-group>
	</div>
</template>
