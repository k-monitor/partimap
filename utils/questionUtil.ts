import type { Sheet } from '~/server/data/sheets';
import type { Question, Survey } from '~/server/data/surveyAnswers';

export const OPTION_SEPARATOR = '|';

export function parseSurvey(json: string | null | undefined) {
	const survey: Survey | null = safeParseJSON(json);
	if (!survey) return null;
	if (!survey.questions) survey.questions = [];
	if (survey.showResults) {
		survey.questions.forEach((q) => (q.showResult = true));
	}
	return survey;
}

export function canShowQuestion(
	question: Question | DrawingInteraction,
	allVisitorAnswers: AnswersByQuestion,
) {
	if (!Array.isArray(question.showIf)) return true;
	return question.showIf
		.map((condition) => {
			const [[id, row], exp] = condition;
			let act = allVisitorAnswers[id];
			if (!act && act !== 0) return false;
			if (row && act[row]) act = act[row];
			if (exp.split(OPTION_SEPARATOR).some((exp) => act === exp)) return true;
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

export function isQuestionConditional(question: Question) {
	return Array.isArray(question.showIf) && question.showIf.length;
}

export function allQuestions(sheet: Sheet) {
	return [
		...deserializeInteractions(sheet).drawing,
		...(parseSurvey(sheet.survey)?.questions || []),
	];
}
