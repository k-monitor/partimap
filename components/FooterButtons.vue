<script setup lang="ts">
import type { Project } from '~/server/data/projects';

const props = withDefaults(
	defineProps<{
		disableSave?: boolean;
		project: Project;
		nextSheetOrd: number;
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

const quizMode = ref(props.project.quizMode);
onMounted(() => {
	if (quizMode.value <= 0) return;

	async function update() {
		const id = props.project.id;
		const res = await $fetch(`/api/project/${id}/quiz`);
		quizMode.value = res.quizMode;
		if (res.quizMode > 0) setTimeout(update, 1000);
	}
	setTimeout(update, 2000);
});

const quizModeBlocks = computed(() => {
	if (quizMode.value <= 0) return false;
	if (quizMode.value > props.nextSheetOrd + 1) return false;
	return true;
});

const { consent, loading, selectedFeatureId, sheetCaptcha: captcha, submitted } = useStore();

const disableNext = computed(() => loading.value || quizModeBlocks.value);

const disableSubmit = computed(
	() =>
		!captcha.value ||
		loading.value ||
		!consent.value ||
		!!selectedFeatureId.value ||
		submitted.value ||
		quizModeBlocks.value,
);

defineEmits<{
	(e: 'next' | 'prev'): void;
	(e: 'submit', captcha: string): void;
}>();
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
		<NuxtTurnstile
			v-if="nextSheetOrd < 0 || showSubmit"
			v-model="captcha"
		/>
		<div class="align-items-center d-flex justify-content-between p-2 w-100">
			<div class="fixed-width">
				<b-button
					v-if="showPrev"
					:disabled="loading"
					variant="outline-primary"
					@click="$emit('prev')"
				>
					<i class="fas fa-fw fa-chevron-left" />
				</b-button>
			</div>
			<div
				v-if="showSubmit"
				class="d-flex align-items-center"
			>
				<div
					v-if="!captcha"
					class="spinner-border spinner-border-sm text-success me-2"
					role="status"
				>
					<span class="visually-hidden">Loading...</span>
				</div>
				<b-button
					:disabled="disableSubmit"
					:variant="disableSubmit ? 'outline-success' : 'success'"
					@click="$emit('submit', captcha)"
				>
					<i
						class="fas fa-fw me-1"
						:class="submitted ? 'fa-check' : 'fa-paper-plane'"
					/>
					<span>{{
						submitted ? $t('FooterButtons.submitted') : $t('FooterButtons.submit')
					}}</span>
				</b-button>
			</div>
			<div
				v-else
				class="fixed-width"
			>
				<b-button
					v-if="showNext"
					:disabled="disableNext"
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
