<template>
	<div>
		<b-list-group>
			<b-list-group-item
				v-for="q in survey.questions"
				:key="q.id"
			>
				<span class="text-truncate">{{ q.label }}</span>
			</b-list-group-item>
			<b-list-group-item
				button
				@click="addQuestion"
			>
				<span class="text-success">
					<i class="fas fa-fw fa-plus mr-1" />
					Új kérdés hozzáadása
				</span>
			</b-list-group-item>
		</b-list-group>
		<b-modal>

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
		};
	},
	methods: {
		addQuestion() {
			const id = new Date().getTime();
			const label = `Kérdés #${this.survey.questions.length + 1}`;
			const q = { id, label, type: 'text' };
			this.survey.questions.push(q);
			// TODO open editor modal for last question
		},
	},
	// TODO emit "input", pass survey as JSON string
};
</script>
