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
	</div>
</template>

<script>
export default {
	props: {
		feature: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
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
			width: this.feature.get('width'),
		};
	},
	computed: {
		style() {
			return [this.color, this.width, this.dash];
		},
	},
	watch: {
		style() {
			this.feature.set('color', this.color);
			this.feature.set('dash', this.dash);
			this.feature.set('width', this.width);
			this.$nuxt.$emit(
				'changeStyle',
				this.feature,
				this.color,
				this.dash,
				this.width
			);
			this.$nuxt.$emit('contentModified');
		},
	},
};
</script>
