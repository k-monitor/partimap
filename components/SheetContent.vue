<script setup lang="ts">
import type { Project } from '~/server/data/projects';
import type { Sheet } from '~/server/data/sheets';
import type { AggregatedAnswers } from '~/server/data/surveyAnswers';

defineProps<{
	brandColor?: string | null;
	project: Project;
	results?: boolean;
	resultsData?: AggregatedAnswers[];
	showConsent?: boolean;
}>();

const sheet = inject<Ref<Sheet | null>>('sheet', ref(null));
const interactions = inject<Ref<Interactions | null>>('interactions', ref(null));

const { consent, submitted } = useStore();

const privacyModalVisible = ref(false);

// disable checkbox later, when user comes back to this sheet
const consented = ref(false);
onMounted(() => (consented.value = consent.value));
</script>

<template>
	<div v-if="!submitted">
		<b-navbar class="m-0 mb-4 p-0">
			<div v-if="results">
				<h1 class="h3 text-primary">
					{{ $t('SheetContent.results') }}
				</h1>
				<h2 class="h4">
					{{ sheet?.title }}
				</h2>
				<p class="my-4">{{ $t('SheetContent.resultsDescription') }}</p>
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
			:html="sheet?.description"
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
					id="consent"
					v-model="consent"
					class="form-check-input"
					:disabled="consented"
					name="consent"
					required
					type="checkbox"
				/>
				<label
					for="consent"
					class="form-check-label"
				>
					{{ $t('SheetContent.consent1') }}
					<a
						class="alert-link"
						href="javascript:void(0)"
						@click.stop="privacyModalVisible = true"
						v-html="$t('SheetContent.consent2')"
					/>
				</label>
			</div>
		</div>
		<b-modal
			v-model="privacyModalVisible"
			hide-footer
			scrollable
			size="lg"
			:title="$t('sheet.privacyPolicy')"
		>
			<Terms :project-data-processor="project.privacyPolicy" />
		</b-modal>
	</div>
	<div v-else>
		<TipTapDisplay
			class="mb-5"
			:html="project.thanks"
		/>
		<div
			v-if="project.thanksUrl"
			class="text-center mb-5"
		>
			<b-button
				:href="project.thanksUrl"
				variant="primary"
			>
				{{ $t('SheetContent.next') }}
				<i class="fas fa-chevron-right ms-2" />
			</b-button>
		</div>

		<ShareButtons
			v-if="project.thanksSocial"
			class="mt-5 mb-4"
		/>
	</div>
</template>
