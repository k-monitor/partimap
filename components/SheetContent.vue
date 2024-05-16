<script setup lang="ts">
import type { Project } from '~/server/data/projects';
import type { Sheet } from '~/server/data/sheets';

const props = defineProps<{
	brandColor?: string;
	project: Project;
	results?: boolean;
	resultsData?: any[]; // FIXME type
	sheet: Sheet;
	showConsent?: boolean;
}>();
const sheet = toRef(props, 'sheet');
const interactions = computed(() => deserializeInteractions(sheet.value?.interactions));

const social = [
	{ network: 'facebook', icon: 'fab fa-facebook-f'.split(' ') },
	{ network: 'twitter', icon: 'fab fa-twitter'.split(' ') },
	{ network: 'email', icon: 'fas fa-envelope'.split(' ') },
];

const { consent, submitted } = useStore();
const { getVisitorAnswers, setVisitorAnswers } = useVisitorData();

const visitorAnswers = ref<Record<string, any>>({}); // FIXME type?

onBeforeMount(() => {
	visitorAnswers.value = getVisitorAnswers(sheet.value.id);
});

watch(
	visitorAnswers,
	(answers) => {
		Object.entries(answers || {})
			.filter(([k, v]) => {
				if (v === null || v === undefined) return true;
				if (Array.isArray(v) && !v.length) return true;
				if (typeof v === 'object') {
					if (Object.keys(v).length === 0) return true;
					if (Object.values(v).every((x) => !x)) return true;
					if (Object.values(v).every((x) => Array.isArray(x) && !x.length)) return true;
				}
				return false;
			})
			.forEach(([k]) => delete answers[k]);
		setVisitorAnswers(sheet.value.id, answers);
	},
	{ deep: true },
);

const consented = ref(false);
const projectUrl = ref<string | null>(null);
onMounted(() => {
	projectUrl.value = window.location.href.replace(/\/\d+\/?/, '');

	// FIXME still needed?
	consented.value = consent.value; // this will disable checkbox on the next mount (next sheet view)
});

const privacyModalVisible = ref(false);
</script>

<template>
	<div v-if="!submitted">
		<b-navbar class="m-0 mb-4 p-0">
			<div v-if="results">
				<h1 class="h3 text-primary">
					{{ $t('SheetContent.results') }}
				</h1>
				<h2 class="h4">
					{{ sheet.title }}
				</h2>
				<p class="my-4">{{ $t('SheetContent.resultsDescription') }}</p>
			</div>
			<h1
				v-else
				class="h3"
			>
				{{ sheet.title }}
			</h1>
		</b-navbar>

		<TipTapDisplay
			v-if="!results"
			class="my-4"
			:html="sheet.description"
		/>
		<div
			v-if="sheet.survey"
			class="my-4"
		>
			<div v-if="results">
				<SurveyResults
					:brand-color="brandColor"
					:data="resultsData"
				/>
			</div>
			<div v-else>
				<Survey
					v-model="visitorAnswers"
					:survey="sheet.survey"
				/>
			</div>
		</div>
		<DrawButtons
			class="my-4"
			:sheet="sheet"
		/>
		<div
			v-if="interactions.enabled.includes('SocialSharing')"
			class="d-flex justify-content-around mt-5 mb-4"
		>
			<ShareNetwork
				v-for="s in social"
				:key="s.network"
				:network="s.network"
				:url="projectUrl || ''"
				title=""
			>
				<i
					class="fa-fw fa-2x share-icon"
					:class="s.icon"
				/>
			</ShareNetwork>
		</div>
		<b-alert
			:show="showConsent"
			variant="dark"
			class="mt-4"
		>
			<b-form-checkbox
				v-model="consent"
				:disabled="consented"
				name="consent"
				required
			>
				{{ $t('SheetContent.consent1') }}
				<a
					class="alert-link"
					href="javascript:void(0)"
					@click.stop="privacyModalVisible = true"
					v-html="$t('SheetContent.consent2')"
				/>
			</b-form-checkbox>
		</b-alert>
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
		<div
			v-if="project.thanksSocial"
			class="d-flex justify-content-around mt-5 mb-4"
		>
			<ShareNetwork
				v-for="s in social"
				:key="s.network"
				:network="s.network"
				:url="projectUrl || ''"
				title=""
			>
				<i
					class="fa-fw fa-2x share-icon"
					:class="s.icon"
				/>
			</ShareNetwork>
		</div>
	</div>
</template>
