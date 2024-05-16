<script setup lang="ts">
withDefaults(
	defineProps<{
		disableSave?: boolean;
		disableSubmit?: boolean;
		showNext?: boolean;
		showPrev?: boolean;
		showSubmit?: boolean;
		step?: number;
		steps?: number;
	}>(),
	{
		step: 0,
		steps: 0,
	},
);

defineEmits(['next', 'prev', 'submit']);
</script>

<template>
	<div class="m-0 w-100">
		<b-progress
			v-if="step && steps"
			class="mb-2 rounded-0"
			height="4px"
			:value="step"
			:max="steps"
			:variant="showSubmit && disableSubmit ? 'success' : 'primary'"
		/>
		<div class="align-items-center d-flex justify-content-between p-2 w-100">
			<div class="fixed-width">
				<b-button
					v-if="showPrev"
					variant="outline-primary"
					@click="$emit('prev')"
				>
					<i class="fas fa-fw fa-chevron-left" />
				</b-button>
			</div>
			<div v-if="step && steps && !showSubmit">{{ step }} / {{ steps }}</div>
			<b-button
				v-if="showSubmit"
				:disabled="disableSubmit"
				:variant="disableSubmit ? 'outline-success' : 'success'"
				@click="$emit('submit')"
			>
				<i
					class="fas fa-fw me-1"
					:class="disableSubmit ? 'fa-check' : 'fa-paper-plane'"
				/>
				<span>{{
					disableSubmit ? $t('FooterButtons.submitted') : $t('FooterButtons.submit')
				}}</span>
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
	</div>
</template>

<style scoped>
.fixed-width {
	min-width: 50px;
}
</style>
