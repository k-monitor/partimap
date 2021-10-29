<template>
	<div>
		<h1 class="h3">{{ sheet.title }}</h1>
		<p
			v-for="p in (sheet.description || '').split('\n')"
			:key="p"
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
	},
	data() {
		return {
			projectUrl: null,
			social: [
				{ network: 'facebook', icon: 'fab fa-facebook-f'.split(' ') },
				{ network: 'twitter', icon: 'fab fa-twitter'.split(' ') },
				{ network: 'email', icon: 'fas fa-envelope'.split(' ') },
			],
		};
	},
	computed: {
		...mapGetters({
			getVisitorAnswers: 'visitordata/getVisitorAnswers',
		}),
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
	},
};
</script>
