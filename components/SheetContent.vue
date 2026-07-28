<script setup lang="ts">
import type { Project } from '~/server/data/projects';
import type { Sheet } from '~/server/data/sheets';
import type { AggregatedAnswers } from '~/server/data/surveyAnswers';

const props = defineProps<{
	brandColor?: string | null;
	project: Project;
	results?: boolean;
	resultsData?: AggregatedAnswers[];
	showConsent?: boolean;
}>();

const sheet = inject<Ref<Sheet | null>>('sheet', ref(null));
const interactions = inject<Ref<Interactions | null>>('interactions', ref(null));

const { consent, submitted } = useStore();

const termsModalVisible = ref(false);
const privacyModalVisible = ref(false);

const localConsentTerms = ref(false);
const localConsentPrivacy = ref(false);

// disable checkboxes later, when user comes back to this sheet
const consented = ref(false);
onMounted(() => {
	consented.value = consent.value;
	if (consent.value) {
		localConsentTerms.value = true;
		localConsentPrivacy.value = true;
	}
});

watch([localConsentTerms, localConsentPrivacy], ([t, p]) => {
	consent.value = t && p;
});

const { capturedParams } = useCapturedParams();
const sheetDescription = computed(() => {
	return interpolateParams(sheet.value?.description || '', capturedParams.value);
});
const thanks = computed(() => {
	return interpolateParams(props.project.thanks || '', capturedParams.value);
});
const thanksUrl = computed(() => {
	return interpolateParams(props.project.thanksUrl || '', capturedParams.value);
});

const { t } = useI18n();
</script>

<template>
	<div v-if="!submitted">
		<b-navbar class="m-0 mb-4 p-0">
			<div v-if="results">
				<h1 class="h3 text-primary">
					{{ t('SheetContent.results') }}
				</h1>
				<h2 class="h4">
					{{ sheet?.title }}
				</h2>
				{{ t('SheetContent.resultsDescription') }}
			</div>
			<h1
				v-else
				class="h3"
			>
				{{ sheet?.title }}
			</h1>
		</b-navbar>

		<TipTapDisplay
			v-if="!results"
			class="my-4"
			:html="sheetDescription"
		/>
		<div
			v-if="sheet?.survey"
			class="my-4"
		>
			<div v-if="results">
				<SurveyResults
					:brand-color="brandColor"
					:data="resultsData || []"
				/>
			</div>
			<div v-else>
				<Survey
					:sheet-id="sheet.id"
					:survey-json="sheet.survey"
				/>
			</div>
		</div>

		<VisitorDrawButtonsInner :interactions="interactions" />

		<ShareButtons
			v-if="interactions?.enabled.includes('SocialSharing')"
			class="mt-5 mb-4"
		/>
		<div
			v-if="showConsent"
			class="alert alert-dark mt-4"
		>
			<div class="form-check">
				<input
					id="consentTerms"
					v-model="localConsentTerms"
					class="form-check-input"
					:disabled="consented"
					name="consentTerms"
					required
					type="checkbox"
				/>
				<label
					for="consentTerms"
					class="form-check-label"
				>
					{{ t('legal.consentTerms1') }}
					<a
						class="alert-link"
						href="javascript:void(0)"
						@click.stop="termsModalVisible = true"
						v-html="t('legal.consentTerms2')"
					/>
				</label>
			</div>
			<div class="form-check mt-2">
				<input
					id="consentPrivacy"
					v-model="localConsentPrivacy"
					class="form-check-input"
					:disabled="consented"
					name="consentPrivacy"
					required
					type="checkbox"
				/>
				<label
					for="consentPrivacy"
					class="form-check-label"
				>
					{{ t('legal.consentPrivacy1') }}
					<a
						class="alert-link"
						href="javascript:void(0)"
						@click.stop="privacyModalVisible = true"
						v-html="t('legal.consentPrivacy2')"
					/>
				</label>
			</div>
		</div>
		<b-modal
			v-model="termsModalVisible"
			no-footer
			scrollable
			size="lg"
			:title="t('legal.termsOfUse')"
		>
			<Terms hide-title />
		</b-modal>
		<b-modal
			v-model="privacyModalVisible"
			no-footer
			scrollable
			size="lg"
			:title="t('legal.privacyPolicy')"
		>
			<Privacy
				hide-title
				:project-data-processor="project.privacyPolicy"
			/>
		</b-modal>
	</div>
	<div v-else>
		<TipTapDisplay
			class="mb-5"
			:html="thanks"
		/>
		<div
			v-if="thanksUrl"
			class="text-center mb-5"
		>
			<b-button
				:href="thanksUrl"
				variant="primary"
			>
				{{ t('SheetContent.next') }}
				<i class="fas fa-chevron-right ms-2" />
			</b-button>
		</div>

		<ShareButtons
			v-if="project.thanksSocial"
			class="mt-5 mb-4"
		/>
	</div>
</template>
