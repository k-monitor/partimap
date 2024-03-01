<template>
	<b-button
		:disabled="!contentModified"
		:variant="!contentModified ? 'outline-success' : 'success'"
		@click="$emit('save')"
	>
		<i
			class="fas fa-fw mr-1"
			:class="!contentModified ? 'fa-check' : 'fa-save'"
		/>
		<span>{{
			!contentModified ? $t('SaveButton.saved') : $t('SaveButton.save')
		}}</span>
	</b-button>
</template>

<script>
export default {
	props: {
		contentModified: Boolean,
	},
};
</script>
