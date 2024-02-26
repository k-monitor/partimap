<template>
	<div class="align-items-center d-flex">
		<button
			v-if="showDelete"
			class="btn btn-outline-danger"
			@click="$emit('delete')"
		>
			<i class="fas fa-fw fa-trash mr-1" />
			{{ $t('FeatureListElement.deleteFeature') }}
		</button>
		<button
			v-if="showSave"
			class="btn btn-success ml-auto"
			@click="$emit('save')"
		>
			{{ $t('SaveButton.save') }}
		</button>
	</div>
</template>

<script>
export default {
	props: {
		showDelete: {
			type: Boolean,
			default: false,
		},
		showSave: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
