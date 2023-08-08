<template>
	<div>
		<b-form-group
			v-for="q in questions"
			:key="q.id"
			class="my-4"
		>
			<template #label>
				<div class="row">
					<div class="col-9">
						<span
							v-if="q.required"
							class="text-danger"
						>
							*
						</span>
						<strong class="text-primary">{{ q.label }}</strong>
					</div>
					<div
						v-if="
							answers[q.id] &&
							'dropdown|radiogroup|range|rating|singleChoiceMatrix'.includes(
								q.type
							)
						"
						class="col small text-muted text-right"
						role="button"
						@click="removeAnswer(q.id)"
					>
						{{ $t('Survey.removeAnswer') }}
					</div>
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
					class="border d-flex font-weight-bold justify-content-center p-2 vue-star-rating-wrapper"
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
		</b-form-group>
	</div>
</template>

<script>
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
	},
	watch: {
		answers: {
			handler(a) {
				this.$emit('input', a);
			},
			deep: true,
		},
	},
	methods: {
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
.vue-star-rating-wrapper > .vue-star-rating {
	display: -webkit-flex;
	display: flex;
	flex: 1 0 auto;
	flex-grow: 1;
}
.vue-star-rating > .vue-star-rating {
	display: -webkit-flex;
	display: flex;
	flex: 1 0 auto;
	flex-grow: 1;
	justify-content: space-around;
}
</style>
