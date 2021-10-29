<template>
	<div class="d-flex justify-content-between w-100">
		<div class="fixed-width">
			<b-button
				v-if="showPrev"
				variant="primary"
				@click="$emit('prev')"
			>
				<i class="fas fa-fw fa-chevron-left" />
			</b-button>
		</div>

		<b-button
			v-if="showSave"
			class="mx-auto"
			:disabled="disableSave"
			:variant="disableSave ? 'outline-success' : 'success'"
			@click="$emit('save')"
		>
			<i class="fas fa-fw mr-1" :class="disableSave ? 'fa-check' : 'fa-save'" />
			<span>{{ disableSave ? 'Mentve' : 'Mentés' }}</span>
		</b-button>

		<div class="fixed-width">
			<b-button
				v-if="showNext"
				variant="primary"
				@click="$emit('next')"
			>
				<i class="fas fa-fw fa-chevron-right" />
			</b-button>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		disableSave: {
			type: Boolean,
			default: false,
		},
		showNext: {
			type: Boolean,
			default: false,
		},
		showPrev: {
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

<style scoped>
.fixed-width {
	min-width: 50px;
}
</style>
