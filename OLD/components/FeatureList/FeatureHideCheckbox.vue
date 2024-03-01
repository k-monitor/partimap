<template>
	<b-form-group>
		<b-form-checkbox
			v-model="hidden"
			name="hidden"
		>
			{{ $t('FeatureListElement.hidden') }}
		</b-form-checkbox>
	</b-form-group>
</template>

<script>
export default {
	inject: ['feature'],
	data() {
		return {
			hidden: this.feature.get('hidden') || false,
		};
	},
	watch: {
		hidden(newHidden) {
			if (newHidden) {
				this.feature.set('hidden', true);
			} else {
				this.feature.unset('hidden');
			}
			this.$nuxt.$emit('contentModified');
		},
	},
};
</script>
