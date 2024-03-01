<template>
	<b-form-group
		v-if="question"
		:label="question.label"
	>
		<CheckboxGroup
			v-model="answer"
			:q="question"
		/>
	</b-form-group>
</template>

<script>
export default {
	inject: ['feature', 'interactions'],
	props: {},
	data() {
		let answer = [];
		try {
			answer = JSON.parse(
				this.feature.get('partimapFeatureQuestion_ans')
			);
			if (!Array.isArray(answer)) answer = [];
		} catch {}
		return {
			answer,
		};
	},
	computed: {
		question() {
			const dt = this.feature.getGeometry().getType();
			const q = this.interactions?.featureQuestions[dt] || {};
			return q.label ? q : null;
		},
	},
	watch: {
		answer(newAnswer) {
			this.feature.set('partimapFeatureQuestion', this.question.label);
			this.feature.set(
				'partimapFeatureQuestion_ans',
				JSON.stringify(newAnswer)
			);
			this.$nuxt.$emit('contentModified');
		},
	},
};
</script>
