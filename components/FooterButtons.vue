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
			:disabled="disableSave"
			:variant="disableSave ? 'outline-success' : 'success'"
			@click="$emit('save')"
		>
			<i
				class="fas fa-fw mr-1"
				:class="disableSave ? 'fa-check' : 'fa-save'"
			/>
			<span>{{ disableSave ? 'Mentve' : 'Mentés' }}</span>
		</b-button>

		<b-button
			v-if="showSubmit"
			:disabled="disableSubmit"
			:variant="disableSubmit ? 'outline-success' : 'success'"
			@click="$emit('submit')"
		>
			<i
				class="fas fa-fw mr-1"
				:class="disableSubmit ? 'fa-check' : 'fa-paper-plane'"
			/>
			<span>{{ disableSubmit ? 'Beküldve' : 'Beküldés' }}</span>
		</b-button>

		<div
			v-else
			class="fixed-width"
		>
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
		disableSubmit: {
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
		showSubmit: {
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
