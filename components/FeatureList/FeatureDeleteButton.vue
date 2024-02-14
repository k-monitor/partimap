<template>
	<span
		class="text-danger"
		role="button"
		@click="$emit('click')"
	>
		<i class="fas fa-fw fa-trash mr-1" />
		{{ $t('FeatureListElement.deleteFeature') }}
	</span>
</template>

<script>
export default {};
</script>
