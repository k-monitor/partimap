<template>
	<div>
		<b-row
			align-h="between"
			align-v="center"
		>
			<b-col>
				<b-form-group :label="$t('FeatureListElement.color')">
					<b-form-input
						id="type-color"
						v-model="color"
						size="sm"
						type="color"
						list="presetColors"
					/>
					<datalist id="presetColors">
						<option
							v-for="c in colors"
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
						v-model="width"
						size="sm"
						type="number"
					/>
				</b-form-group>
			</b-col>
		</b-row>

		<b-form-group
			v-if="feature.getGeometry().getType() !== 'Point'"
			:label="$t('FeatureListElement.dashType')"
		>
			<b-form-select
				v-model="dash"
				size="sm"
				:options="dashOptions"
			/>
		</b-form-group>

		<b-form-group :label="$t('FeatureListElement.opacity')">
			<div class="d-flex align-items-center">
				<i class="far fa-square fa-w mr-2" />
				<div>0%</div>
				<b-form-input
					v-model.number="opacity"
					class="mx-2 mb-1"
					max="100"
					min="0"
					step="10"
					type="range"
				/>
				<div>100%</div>
			</div>
			<div
				v-if="feature.getGeometry().getType() === 'Polygon'"
				class="d-flex align-items-center mt-2"
			>
				<i class="fas fa-square fa-w mr-2" />
				<div>0%</div>
				<b-form-input
					v-model.number="fillOpacity"
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
				v-model.trim="label"
				size="sm"
				type="text"
			/>
		</b-form-group>

		<b-form-group v-if="label">
			<div class="d-flex align-items-center">
				<div>-90°</div>
				<b-form-input
					v-model.number="angle"
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

<script>
import { parseFillOpacity100, parseOpacity100 } from '@/assets/colorUtil';
export default {
	inject: ['feature'],
	data() {
		const fillOpacity = parseFillOpacity100(this.feature);
		const opacity = parseOpacity100(this.feature);

		return {
			angle: parseInt(this.feature.get('partimapMapLabelAngle'), 10) || 0,
			color: this.feature.get('color'),
			colors: [
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
			],
			dash: this.feature.get('dash'),
			dashOptions: [
				{
					text: this.$t('FeatureListElement.dashTypes.p0'),
					value: '0',
				},
				{
					text: this.$t('FeatureListElement.dashTypes.p11'),
					value: '1,1',
				},
				{
					text: this.$t('FeatureListElement.dashTypes.p21'),
					value: '2,1',
				},
				{
					text: this.$t('FeatureListElement.dashTypes.p41'),
					value: '4,1',
				},
				{
					text: this.$t('FeatureListElement.dashTypes.p1131'),
					value: '1,1,3,1',
				},
			],
			fillOpacity,
			label: this.feature.get('partimapMapLabel') || '',
			opacity,
			width: this.feature.get('width'),
		};
	},
	computed: {
		style() {
			return [
				this.angle,
				this.color,
				this.dash,
				this.fillOpacity,
				this.label,
				this.opacity,
				this.width,
			];
		},
	},
	watch: {
		style() {
			this.feature.set('partimapMapLabelAngle', this.angle);
			this.feature.set('color', this.color);
			this.feature.set('dash', this.dash);
			this.feature.set('partimapMapLabel', this.label);
			this.feature.set('fillOpacity', this.fillOpacity);
			this.feature.set('opacity', this.opacity);
			this.feature.set('width', this.width);
			this.$nuxt.$emit(
				'changeStyle',
				this.feature,
				this.color,
				this.dash,
				this.fillOpacity,
				this.opacity,
				this.width
			);
			this.$nuxt.$emit('contentModified');
		},
	},
};
</script>
