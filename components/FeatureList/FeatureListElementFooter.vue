<template>
	<div class="align-items-center d-flex justify-content-between">
		<button
			class="btn btn-outline-danger"
			@click="$emit('delete')"
		>
			<i class="fas fa-fw fa-trash mr-1" />
			{{ $t('FeatureListElement.deleteFeature') }}
		</button>
		<button
			v-if="save"
			class="btn btn-success"
			@click="$emit('save')"
		>
			{{ $t('SaveButton.save') }}
		</button>
	</div>
</template>

<script>
export default {
	props: {
		save: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
