<template>
	<div>
		<b-list-group>
			<b-list-group-item
				v-for="(q, i) in survey.questions"
				:key="q.id"
				button
				@click="editQuestion(i)"
				class="d-flex align-items-center"
			>
				<i
					class="fas fa-fw mr-2"
					:class="icon[q.type]"
				/>
				<strong class="flex-grow-1 text-truncate">{{ q.label }}</strong>
			</b-list-group-item>
			<b-list-group-item
				button
				@click="addQuestion"
				class="d-flex align-items-center text-success"
			>
				<i class="fas fa-fw fa-plus mr-2" />
				Új kérdés hozzáadása
			</b-list-group-item>
		</b-list-group>
		<b-modal
			id="survey-question-editor"
			cancel-title="Mégsem"
			:title="`Kérdés #${questionIndex + 1}`"
			@ok="saveQuestion"
		>
			<b-form @submit.prevent="saveQuestion">
				<b-form-group label="Kérdés szövege:">
					<b-form-input v-model="question.label" />
				</b-form-group>
				<b-form-group label="Kérdés típusa:">
					<b-form-select
						v-model="question.type"
						:options="questionTypes"
					/>
				</b-form-group>
				<b-form-group
					label="Opciók:"
					v-if="hasOptions"
				>
					<b-input-group
						v-for="(o,i) in (question.options || [])"
						:key="i"
						class="mb-2"
					>
						<b-form-input v-model="question.options[i]" />
						<template #append>
							<b-button variant="outline-danger" @click="delOption(i)">
								<i class="fas fa-fw fa-trash" />
							</b-button>
						</template>
					</b-input-group>
					<b-button
						variant="success"
						@click="addOption"
					>Új opció</b-button>
				</b-form-group>
			</b-form>
			<p>{{ JSON.stringify(question) }}</p>
		</b-modal>
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: String, // survey definition as JSON string
			default: null,
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
				checkbox: 'fa-check-square',
				radiogroup: 'fa-dot-circle',
				dropdown: 'fa-caret-square-down',
				rating: 'fa-star-half-alt',
			},
			questionTypes: [
				{ value: 'text', text: 'Szöveges válasz' },
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
			this.$emit('input', JSON.stringify(this.survey));
		},
	},
	// TODO emit "input", pass survey as JSON string
};
</script>