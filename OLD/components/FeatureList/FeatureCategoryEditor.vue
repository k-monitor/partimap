<template>
	<b-form-group :label="$t('FeatureListElement.category')">
		<VueTypeaheadBootstrap
			v-model="category"
			:data="categories"
			:min-matching-chars="0"
			:placeholder="$t('FeatureListElement.category')"
			show-all-results
			show-on-focus
			size="sm"
		/>
	</b-form-group>
</template>

<script>
import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap';

export default {
	components: {
		VueTypeaheadBootstrap,
	},
	inject: ['feature'],
	props: {
		categories: {
			type: Array,
			required: true,
		},
	},
	data() {
		return {
			category: this.feature.get('category') || '', // empty string is important for typeahead comp
		};
	},
	watch: {
		category(newCategory) {
			this.feature.set('category', newCategory);
			this.$nuxt.$emit('contentModified');
			this.$emit('change');
		},
	},
};
</script>
