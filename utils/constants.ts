/**
 * This is used where answers are aggregated and results
 * are shown. Additional user input given to 'other' options
 * are grouped together on charts.
 */
export const OTHER_ANSWER = 'other';

/**
 * This is used on the UI to prefix answers, so the answer
 * indicates that the 'other' option was selected and also
 * contains the additional user input.
 */
export const OTHER_PREFIX = 'other: ';

export const SHEET_TYPES = [
	{
		name: 'text',
		icon: 'fa-paragraph',
	},
	{
		name: 'survey',
		icon: 'fa-poll',
	},
	{
		name: 'staticMap',
		icon: 'fa-map',
	},
	{
		name: 'interactiveMap',
		icon: 'fa-map-marker-alt',
	},
];
