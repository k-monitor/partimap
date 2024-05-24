import type { Question } from '~/server/data/surveyAnswers';

export function canShowQuestion(question: Question, allVisitorAnswers: AnswersByQuestion) {
	if (!Array.isArray(question.showIf)) return true;
	return question.showIf
		.map((condition) => {
			const [[id, row], exp] = condition;
			let act = allVisitorAnswers[id];
			if (!act && act !== 0) return false;
			if (row && act[row]) act = act[row];
			if (act === exp) return true;
			if (Array.isArray(act)) return act.includes(exp);
			if (Number.isInteger(Number(act))) {
				let [min, max] = exp.split('-').map((v) => Number(v));
				if (min > max) {
					const t = min;
					min = max;
					max = t;
				}
				return min <= act && act <= max;
			}
			return false;
		})
		.every((condition) => !!condition);
}
