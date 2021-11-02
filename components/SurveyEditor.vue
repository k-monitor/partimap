<template>
	<div>
		<b-list-group>
			<draggable
				v-model="survey.questions"
				:draggable="readonly ? null : '.item'"
				@end="emitSurvey"
			>
				<b-list-group-item
					v-for="(q, i) in survey.questions"
					:key="q.id"
					button
					class="d-flex align-items-center item"
					@click="editQuestion(i)"
				>
					<i
						class="fas fa-fw mr-2"
						:class="icon[q.type]"
					/>
					<strong class="flex-grow-1 text-truncate">{{ q.label }}</strong>
					<span
						v-if="!readonly"
						class="text-danger"
						role="button"
						@click.stop="delQuestion(i)"
					>
						<i class="fas fa-fw fa-trash" />
					</span>
				</b-list-group-item>
				<b-list-group-item
					v-if="!readonly"
					slot="footer"
					button
					class="d-flex align-items-center text-success"
					@click="addQuestion"
				>
					<i class="fas fa-fw fa-plus mr-2" />
					Új kérdés hozzáadása
				</b-list-group-item>
			</draggable>
		</b-list-group>
		<b-modal
			id="survey-question-editor"
			cancel-title="Mégsem"
			:ok-disabled="readonly"
			:title="`Kérdés #${questionIndex + 1}`"
			@ok="saveQuestion"
			@shown="$refs.questionLabelInput.focus()"
		>
			<b-form @submit.prevent="saveQuestion">
				<b-form-group label="Kérdés szövege:">
					<b-form-input
						ref="questionLabelInput"
						v-model="question.label"
						:readonly="readonly"
						:disabled="readonly"
					/>
				</b-form-group>
				<b-form-group label="Kérdés típusa:">
					<b-form-select
						v-model="question.type"
						:options="questionTypes"
						:disabled="readonly"
					/>
				</b-form-group>
				<b-row v-if="question.type === 'number'">
					<b-col>
						<b-form-group label="Minimum érték:">
							<b-form-input
								v-model="question.min"
								type="number"
							/>
						</b-form-group>
					</b-col>
					<b-col>
						<b-form-group label="Maximum érték:">
							<b-form-input
								v-model="question.max"
								type="number"
							/>
						</b-form-group>
					</b-col>
				</b-row>

				<b-form-group
					v-if="hasOptions"
					label="Opciók:"
				>
					<b-input-group
						v-for="(o,i) in (question.options || [])"
						:key="i"
						class="mb-2"
					>
						<b-form-input
							v-model="question.options[i]"
							:readonly="readonly"
							:disabled="readonly"
						/>
						<template #append>
							<b-button
								v-if="!readonly"
								variant="outline-danger"
								@click="delOption(i)"
							>
								<i class="fas fa-fw fa-trash" />
							</b-button>
						</template>
					</b-input-group>
					<b-button
						v-if="!readonly"
						variant="success"
						@click="addOption"
					>
						Új opció
					</b-button>
				</b-form-group>
			</b-form>
		</b-modal>
	</div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
	components: {
		draggable,
	},
	props: {
		value: {
			type: String, // survey definition as JSON string
			default: null,
		},
		readonly: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		const survey = JSON.parse(this.value || '{}');
		if (!survey.questions) {
			survey.questions = [];
		}
		return {
			survey,
			icon: {
				text: 'fa-keyboard',
				number: 'fa-hashtag',
				checkbox: 'fa-check-square',
				radiogroup: 'fa-dot-circle',
				dropdown: 'fa-caret-square-down',
				rating: 'fa-star-half-alt',
			},
			questionTypes: [
				{ value: 'text', text: 'Szöveges válasz' },
				{ value: 'number', text: 'Numerikus válasz' },
				{ value: 'checkbox', text: 'Opciók (többet lehet vál.)' },
				{ value: 'radiogroup', text: 'Opciók (egyet lehet vál.)' },
				{
					value: 'dropdown',
					text: 'Opciók lenyíló listában (egyet lehet vál.)',
				},
				{ value: 'rating', text: 'Értékelés (5 csillag)' },
			],
			questionIndex: 0,
			question: {},
		};
	},
	computed: {
		hasOptions() {
			return 'checkbox|radiogroup|dropdown'.includes(this.question.type);
		},
	},
	methods: {
		addQuestion() {
			const id = new Date().getTime();
			const label = `Kérdés #${this.survey.questions.length + 1}`;
			const q = { id, label, type: 'text' };
			this.survey.questions.push(q);
			this.emitSurvey();
			this.editQuestion(this.survey.questions.length - 1);
		},
		editQuestion(i) {
			this.questionIndex = i;
			this.question = { ...this.survey.questions[i] };
			this.$bvModal.show('survey-question-editor');
		},
		async delQuestion(i) {
			const confirmed = await this.confirmDeletion(
				this.survey.questions[i].label
			);
			if (confirmed) {
				this.survey.questions.splice(i, 1);
				this.emitSurvey();
			}
		},
		addOption() {
			if (!this.question.options) {
				this.$set(this.question, 'options', []);
			}
			this.question.options.push(`Opció #${this.question.options.length + 1}`);
		},
		delOption(i) {
			this.question.options.splice(i, 1);
		},
		saveQuestion() {
			this.$bvModal.hide('survey-question-editor');
			if (!this.hasOptions) {
				this.$delete(this.question, 'options');
			}
			this.$set(this.survey.questions, this.questionIndex, this.question);
			this.emitSurvey();
		},
		emitSurvey() {
			if (this.readonly) {
				// all form controls are disabled so this won't be called
				// but let's just add this condition just in case :)
				return true;
			}
			this.$emit('input', JSON.stringify(this.survey));
		},
	},
};
</script>
