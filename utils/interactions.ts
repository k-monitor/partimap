// This file handles the (de)serialization of the sheet.interactions field
// in a backward-compatible way.

import { nanoid } from 'nanoid';
import type { Sheet } from '~/server/data/sheets';
import type { Question, Survey } from '~/server/data/surveyAnswers';

export const DRAW_TYPES = ['Point', 'LineString', 'Polygon'] as const;
export type DrawType = (typeof DRAW_TYPES)[number];

export type DrawingInteraction = {
	id: string;
	type: DrawType;

	/**
	 * Custom label for drawing button
	 */
	buttonLabel?: string;

	/**
	 * Custom label for description field of features
	 */
	descriptionLabel?: string;

	/**
	 * Custom label in report (export)
	 */
	featureLabel?: string;

	/**
	 * Question to be displayed in feature box
	 */
	featureQuestion?: Partial<Question> | null;
};

export function createDrawingInteraction(di: Partial<DrawingInteraction>): DrawingInteraction {
	return {
		id: di.id || nanoid(),
		type: di.type || 'Point',
		buttonLabel: di.buttonLabel || '',
		descriptionLabel: di.descriptionLabel || '',
		featureLabel: di.featureLabel || '',
		featureQuestion: di.featureQuestion || null,
	};
}

export type OnOffInteraction =
	| 'Rating'
	| 'RatingExplanation'
	| 'RatingProsCons'
	| 'RatingResults'
	| 'ShowResultsOnly'
	| 'SocialSharing'
	// legacy:
	| 'naming'
	| `stars=${number}`
	| 'Point'
	| 'LineString'
	| 'Polygon';

export type Interactions = {
	/**
	 * Name of basemap to pre-select for visitor
	 */
	baseMap: string;

	/**
	 * Drawing interactions
	 */
	drawing: DrawingInteraction[];

	/**
	 * Enabled non-drawing interactions
	 */
	enabled: OnOffInteraction[];

	/**
	 * Question to be displayed for rating explanation
	 */
	ratingQuestion: string;

	/**
	 * Number of stars for Rating interaction
	 */
	stars: number;

	// legacy:
	buttonLabels?: Record<DrawType, string>;
	descriptionLabels?: Record<DrawType, string>;
	featureLabels?: Record<DrawType, string>;
	featureQuestions?: Record<DrawType, Partial<Question>>;
};

export function isItInteractive(interactions: Interactions | null) {
	return (interactions?.drawing || []).length > 0;
}

export function createInteractions(data: Partial<Interactions>): Interactions {
	return {
		baseMap: data.baseMap || 'osm',
		drawing: Array.isArray(data.drawing) ? data.drawing.map(createDrawingInteraction) : [],
		enabled: data.enabled || [],
		ratingQuestion: data.ratingQuestion || '',
		stars: data.stars || 5,
	};
}

export function serializeInteractions(interactions: Interactions) {
	// TODO would be nice to remove fields that are holding default values
	return JSON.stringify(interactions);
}

export function deserializeInteractions(sheet: Partial<Sheet> | null | undefined) {
	const json = sheet?.interactions;
	let interactions: Interactions = createInteractions({});

	const parsed = safeParseJSON(json) || {};
	if (Array.isArray(parsed)) {
		// #2346 backward compatibility
		parsed.forEach((ia: string) => {
			if (DRAW_TYPES.includes(ia as DrawType)) {
				interactions.drawing.push(
					createDrawingInteraction({
						id: ia,
						type: ia as DrawType,
					}),
				);
			} else if (ia.startsWith('stars=')) {
				interactions.stars = Number(ia.split('=')[1]);
			} else {
				interactions.enabled.push(ia as OnOffInteraction);
			}
		});
	} else {
		interactions = createInteractions(parsed);

		// #2841 backward compatibility
		const filteredEnabled: OnOffInteraction[] = [];
		(parsed.enabled || []).forEach((ia: string) => {
			if (!DRAW_TYPES.includes(ia as DrawType)) return filteredEnabled.push(ia as DrawType);
			interactions.drawing.push(
				createDrawingInteraction({
					id: ia,
					type: ia as DrawType,
					buttonLabel: parsed.buttonLabels?.[ia],
					descriptionLabel: parsed.descriptionLabels?.[ia],
					featureLabel: parsed.featureLabels?.[ia],
					featureQuestion: parsed.featureQuestions?.[ia],
				}),
			);
		});
		interactions.enabled = filteredEnabled;
	}

	// #2434 backward compatibility
	const survey: Survey = safeParseJSON(sheet?.survey) || {};
	if (survey?.showResultsOnly) interactions.enabled.push('ShowResultsOnly');

	// #2437 backward compatibility
	const descriptionLabel = sheet?.descriptionLabel || '';
	interactions.drawing.forEach((di) => {
		if (!di.descriptionLabel) di.descriptionLabel = descriptionLabel;
	});

	return interactions;
}
