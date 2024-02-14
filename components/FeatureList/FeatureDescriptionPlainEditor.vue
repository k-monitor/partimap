<template>
	<b-form-group :label="label">
		<b-textarea v-model="description" />
	</b-form-group>
</template>

<script>
export default {
	inject: ['feature', 'interactions', 'sheet'],
	data() {
		return {
			description: this.feature.get('description'),
		};
	},
	computed: {
		label() {
			const dt = this.feature.getGeometry().getType();
			const lab = this.interactions?.descriptionLabels[dt];
			return (
				lab ||
				this.sheet?.descriptionLabel ||
				this.$t('sheetEditor.defaultDescriptionLabel')
			);
		},
	},
	watch: {
		description(newDescription) {
			this.feature.set('description', newDescription);
			this.$nuxt.$emit('contentModified');
		},
	},
};
</script>
