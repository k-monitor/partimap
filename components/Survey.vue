<template>
	<div>
		<b-form-group
			v-for="q in visibleQuestions"
			:key="q.id"
			class="my-4"
		>
			<template #label>
				<div class="position-relative pr-5">
					<div>
						<span
							v-if="q.required"
							class="text-danger"
						>
							*
						</span>
						<strong class="text-primary">{{ q.label }}</strong>
					</div>
					<b-button
						v-if="canRemoveAnswer(q)"
						v-b-tooltip.hover.bottom
						class="position-absolute ml-4 small text-muted text-right"
						size="sm"
						style="top: 0; right: 0"
						:title="$t('Survey.removeAnswer')"
						variant="light"
						@click="removeAnswer(q.id)"
					>
						<i class="fas fa-fw fa-eraser text-danger" />
					</b-button>
				</div>
			</template>
			<CheckboxGroup
				v-if="q.type == 'checkbox'"
				v-model="answers[q.id]"
				:q="q"
			/>
			<b-form-input
				v-else-if="q.type === 'text'"
				v-model="answers[q.id]"
				:name="'q' + q.id"
				:required="q.required"
			/>
			<div v-else-if="'number|range'.includes(q.type)">
				<div
					v-if="q.type === 'range' && q.minLabel && q.maxLabel"
					class="align-items-end d-flex justify-content-between small"
				>
					<span>{{ q.minLabel }}</span>
					<strong class="mx-2">{{
						answers[q.id] || '&nbsp;'
					}}</strong>
					<span class="text-right">{{ q.maxLabel }}</span>
				</div>
				<div class="align-items-center d-flex position-relative">
					<b-form-input
						:min="q.min"
						:max="q.max"
						:name="'q' + q.id"
						:required="q.required"
						:type="q.type"
						:value="answers[q.id]"
						@input="numberInput(q.id, $event)"
					/>
					<strong
						v-if="q.type == 'range' && (!q.minLabel || !q.maxLabel)"
						class="ml-2 text-right"
						style="min-width: 2rem"
						>{{ answers[q.id] }}</strong
					>
					<input
						v-if="q.type == 'range' && q.required"
						v-model="answers[q.id]"
						class="position-absolute"
						required
						style="
							bottom: 0;
							left: 50%;
							width: 50%;
							height: 0;
							opacity: 0;
						"
					/>
				</div>
			</div>
			<b-form-radio-group
				v-else-if="q.type === 'radiogroup'"
				v-model="answers[q.id]"
				:name="'q' + q.id"
				:options="q.options"
				:required="q.required"
				stacked
			/>
			<DropdownGroup
				v-else-if="q.type === 'dropdown'"
				v-model="answers[q.id]"
				:q="q"
			/>
			<ChoiceMatrix
				v-else-if="
					q.type === 'singleChoiceMatrix' ||
					q.type === 'multipleChoiceMatrix'
				"
				v-model="answers[q.id]"
				:question="q"
			/>
			<div
				v-else-if="q.type === 'rating'"
				class="position-relative"
			>
				<div
					class="border font-weight-bold p-2 vue-star-rating-wrapper"
				>
					<StarRating
						v-model="answers[q.id]"
						active-color="var(--brand)"
						animate
						border-color="var(--brand)"
						:border-width="2"
						clearable
						inactive-color="#fff"
						:max-rating="5"
						:star-size="16"
						:show-rating="false"
					/>
				</div>
				<input
					v-if="q.required"
					v-model="answers[q.id]"
					class="position-absolute"
					required
					style="bottom: 0; left: 0; height: 0; opacity: 0"
				/>
			</div>
			<DistributeUnitsQuestion
				v-else-if="q.type === 'distributeUnits'"
				v-model="answers[q.id]"
				:question="q"
			/>
		</b-form-group>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { canShowQuestion } from '~/assets/questionUtil';

export default {
	props: {
		survey: {
			type: String, // survey definition as JSON string
			default: '{}',
		},
		value: {
			type: Object, // answers
			default: () => {},
		},
	},
	data() {
		return {
			answers: this.value || {},
		};
	},
	computed: {
		...mapGetters('visitordata', ['getAllVisitorAnswers']),
		questions() {
			let s;
			try {
				s = JSON.parse(this.survey);
			} catch (e) {
				s = {};
			}
			if (!s.questions) {
				s.questions = [];
			}
			return s.questions;
		},
		visibleQuestions() {
			return this.questions.filter(this.canShowQuestion);
		},
	},
	watch: {
		visibleQuestions(vq) {
			const visibleIds = vq.map(q => String(q.id));
			const answeredIds = Object.keys(this.answers);
			const hiddenIds = answeredIds.filter(
				id => !visibleIds.includes(String(id))
			);
			hiddenIds.forEach(id => this.removeAnswer(id));
		},
		answers: {
			handler(a) {
				this.$emit('input', a);
			},
			deep: true,
		},
	},
	methods: {
		canRemoveAnswer(q) {
			return (
				this.answers[q.id] &&
				'distributeUnits|dropdown|radiogroup|range|rating|singleChoiceMatrix'.includes(
					q.type
				)
			);
		},
		canShowQuestion(question) {
			return canShowQuestion(question, this.getAllVisitorAnswers);
		},
		removeAnswer(questionId) {
			this.$delete(this.answers, questionId);
		},
		numberInput(qId, ans) {
			// Intentionally NOT using v-model, because that way
			// removed answer comes back to range input when another
			// question is modified...
			this.$set(this.answers, qId, ans);
		},
	},
};
</script>

<style>
.vue-star-rating-wrapper {
	display: block;
	width: 100%;
}
.vue-star-rating-wrapper > .vue-star-rating {
	display: block;
	width: 100%;
}
.vue-star-rating > .vue-star-rating {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	width: 100%;
}
span.vue-star-rating-star {
	text-align: center;
	width: 100%;
}
</style>
