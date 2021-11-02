<template>
	<div>
		<h1 class="h3">{{ sheet.title }}</h1>
		<p
			v-for="(p,i) in (sheet.description || '').split('\n')"
			:key="i + p"
			v-text="p"
		/>
		<div v-if="sheet.survey">
			<Survey
				v-if="JSON.parse(sheet.survey).demographic"
				v-model="visitorAnswers"
				:survey="demographicSurvey"
			/>
			<Survey
				v-else
				v-model="visitorAnswers"
				:survey="sheet.survey"
			/>
		</div>
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
		>
			<b-form-checkbox
				v-model="consent"
				:disabled="consented"
			>
				Elolvastam és elfogadom az <a
					class="alert-link"
					href="javascript:void(0)"
				>Adatvédelmi nyilatkozatot</a>
			</b-form-checkbox>
		</b-alert>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	props: {
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
