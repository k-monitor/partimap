<template>
	<div v-if="!submitted">
		<h1
			v-if="!hideTitle"
			class="h3 mb-4"
		>
			{{ sheet.title }}
		</h1>
		<div
			class="my-4 rich"
			v-html="sheet.description"
		/>
		<div v-if="sheet.survey" class="my-4">
			<div v-if="results">
				<client-only>
					<SurveyResults :data="sheet.answers" />
				</client-only>
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
			v-if="interactions.includes('SocialSharing')"
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
					class="fa-fw fa-2x"
					:class="s.icon"
				/>
			</ShareNetwork>
		</div>
		<b-alert
			:show="showConsent"
			variant="primary"
			class="mt-5"
		>
			<b-form-checkbox
				v-model="consent"
				:disabled="consented"
				name="consent"
				required
			>
				Elolvastam és elfogadom a <a
					class="alert-link"
					href="javascript:void(0)"
					@click.stop="$bvModal.show('privacy-modal')"
				>felhasználási feltételeket és az adatkezelési tájékoztatót.</a>
			</b-form-checkbox>
		</b-alert>
	</div>
	<div v-else>
		<div
			class="mb-5 rich"
			v-html="project.thanks"
		/>
		<div
			v-if="project.thanksUrl"
			class="text-center mb-5"
		>
			<b-button
				:href="project.thanksUrl"
				variant="primary"
			>
				Tovább
				<i class="fas fa-chevron-right ml-2" />
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
					class="fa-fw fa-2x"
					:class="s.icon"
				/>
			</ShareNetwork>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	props: {
		hideTitle: {
			type: Boolean,
			default: false,
		},
		project: {
			// for thank you stuff
			type: Object,
			default: null,
		},
		results: {
			type: Boolean,
			default: false,
		},
		sheet: {
			type: Object,
			default: null,
		},
		showConsent: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			consented: false,
			projectUrl: null,
			social: [
				{ network: 'facebook', icon: 'fab fa-facebook-f'.split(' ') },
				{ network: 'twitter', icon: 'fab fa-twitter'.split(' ') },
				{ network: 'email', icon: 'fas fa-envelope'.split(' ') },
			],
		};
	},
	computed: {
		...mapGetters(['getConsent']),
		...mapGetters({
			getVisitorAnswers: 'visitordata/getVisitorAnswers',
		}),
		submitted() {
			return this.$store.state.submitted;
		},
		consent: {
			get() {
				return this.getConsent;
			},
			set(v) {
				this.$store.commit('setConsent', v);
			},
		},
		interactions() {
			// no need for JSON parse, String also has `includes()`
			return this.sheet ? this.sheet.interactions || '' : '';
		},
		visitorAnswers: {
			get() {
				return this.getVisitorAnswers(this.sheet.id);
			},
			set(answers) {
				const payload = {
					answers,
					sheetId: this.sheet.id,
				};
				this.$store.commit('visitordata/addAnswers', payload);
			},
		},
	},
	mounted() {
		this.projectUrl = window.location.href.replace(/\/\d+\/?/, ''); // need to set here to avoid SSR error
		this.consented = this.getConsent; // this will disable checkbox on the next mount (next sheet view)
	},
};
</script>
