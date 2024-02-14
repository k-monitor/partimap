<template>
	<div>
		<b-badge
			v-if="feature.get('category')"
			class="border border-secondary mb-2"
			variant="light"
			v-text="feature.get('category')"
		/>
		<TipTapDisplay
			class="mb-3"
			:html="feature.get('description')"
		/>
	</div>
</template>

<script>
export default {
	inject: ['feature'],
};
</script>
