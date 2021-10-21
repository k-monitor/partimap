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
					v-if="'checkbox|radiogroup|dropdown'.includes(question.type)"
				>
				</b-form-group>
			</b-form>
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
		saveQuestion() {
			this.$bvModal.hide('survey-question-editor');
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
