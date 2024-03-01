<template>
	<b-form-group
		class="rich"
		:label="$t('FeatureListElement.description')"
	>
		<client-only>
			<tiptap v-model="description" />
		</client-only>
	</b-form-group>
</template>

<script>
export default {
	inject: ['feature'],
	data() {
		return {
			description: this.feature.get('description') || '',
		};
	},
	watch: {
		description(newDescription) {
			this.feature.set('description', newDescription);
			this.$nuxt.$emit('contentModified');
		},
	},
};
</script>
