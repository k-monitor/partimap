<template>
	<b-form-checkbox
		v-model="hidden"
		class="mb-3"
		name="hidden"
	>
		{{ $t('FeatureListElement.hidden') }}
	</b-form-checkbox>
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
