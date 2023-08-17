export function canShowQuestion(question, allVisitorAnswers) {
	if (!Array.isArray(question.showIf)) return true;
	return question.showIf
		.map(condition => {
			const [[id, row], exp] = condition;
			let act = allVisitorAnswers[id];
			if (!act && act !== 0) return false;
			if (act[row]) act = act[row];
			if (act === exp) return true;
			if (Array.isArray(act)) return act.includes(exp);
			if (Number.isInteger(Number(act))) {
				const [min, max] = exp.split('-').map(v => Number(v));
				return min <= act && act <= max;
			}
			return false;
		})
		.every(condition => !!condition);
}
