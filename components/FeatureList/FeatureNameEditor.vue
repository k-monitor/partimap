<template>
	<b-form-group :label="$t('FeatureListElement.name')">
		<b-form-input
			v-model="name"
			size="sm"
			type="text"
		/>
	</b-form-group>
</template>

<script>
export default {
	inject: ['feature'],
	data() {
		const anon = this.$t('FeatureListElement.defaultName')[
			this.feature.getGeometry().getType()
		];
		return {
			name: this.feature.get('name') || anon,
		};
	},
	watch: {
		name(newName) {
			this.feature.set('name', newName);
			this.$nuxt.$emit('contentModified');
		},
	},
};
</script>
