// This file handles the (de)serialization of the sheet.interactions field
// in a backward-compatible way.

import type { Sheet } from '~/server/data/sheets';
import type { Question, Survey } from '~/server/data/surveyAnswers';

export type DrawType = 'Point' | 'LineString' | 'Polygon';

export type DrawingInteraction = {
	id: string;
	type: DrawType;

	/**
	 * Custom label for drawing button
	 */
	buttonLabel: string;

	/**
	 * Custom label for description field of features
	 */
	descriptionLabel: string;

	/**
	 * Custom label in report (export)
	 */
	featureLabel: string;

	/**
	 * Question to be displayed in feature box
	 */
	featureQuestions: Partial<Question>;
};

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
	//drawing: DrawingInteraction[];

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
	buttonLabels: Record<DrawType, string>;
	descriptionLabels: Record<DrawType, string>;
	featureLabels: Record<DrawType, string>;
	featureQuestions: Record<DrawType, Partial<Question>>;
};

export function isItInteractive(interactions: Interactions | null) {
	return (
		interactions?.enabled?.includes('Point') ||
		interactions?.enabled?.includes('LineString') ||
		interactions?.enabled?.includes('Polygon')
	);
}

export function createInteractions(data: Partial<Interactions>): Interactions {
	return {
		baseMap: data.baseMap || 'osm',
		//drawing: [],
		enabled: data.enabled || [],

		buttonLabels: {
			Point: data.buttonLabels?.Point || '',
			LineString: data.buttonLabels?.LineString || '',
			Polygon: data.buttonLabels?.Polygon || '',
		},
		descriptionLabels: {
			Point: data.descriptionLabels?.Point || '',
			LineString: data.descriptionLabels?.LineString || '',
			Polygon: data.descriptionLabels?.Polygon || '',
		},
		featureLabels: {
			Point: data.featureLabels?.Point || '',
			LineString: data.featureLabels?.LineString || '',
			Polygon: data.featureLabels?.Polygon || '',
		},
		featureQuestions: {
			Point: data.featureQuestions?.Point || {},
			LineString: data.featureQuestions?.LineString || {},
			Polygon: data.featureQuestions?.Polygon || {},
		},
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
	let interactions: Interactions | null = null;

	// #2346 backward compatibility
	const arr: OnOffInteraction[] = safeParseJSONArray(json);
	if (arr.length) {
		const enabled: OnOffInteraction[] = [];
		let stars = 5;
		arr.forEach((ia) => {
			if (ia.startsWith('stars=')) {
				stars = Number(ia.split('=')[1]);
			} else {
				enabled.push(ia);
			}
		});
		interactions = createInteractions({ enabled, stars });
	} else {
		interactions = createInteractions(safeParseJSON(json) || {});
	}

	// #2434 backward compatibility
	const survey: Survey = safeParseJSON(sheet?.survey) || {};
	if (survey?.showResultsOnly) interactions.enabled.push('ShowResultsOnly');

	// #2437 backward compatibility
	const descriptionLabel = sheet?.descriptionLabel || '';
	const dts: DrawType[] = ['Point', 'LineString', 'Polygon'];
	dts.forEach((dt) => {
		if (!interactions.descriptionLabels[dt]) {
			interactions.descriptionLabels[dt] = descriptionLabel;
		}
	});

	return interactions;
}
