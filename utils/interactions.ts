// This file handles the (de)serialization of the sheet.interactions field
// in a backward-compatible way.

import type { Question } from '~/server/data/surveyAnswers';

export type OnOffInteraction =
	| 'Rating'
	| 'RatingExplanation'
	| 'RatingProsCons'
	| 'RatingResults'
	| 'ShowResultsOnly'
	| 'SocialSharing'
	// legacy:
	| 'naming'
	| 'Point'
	| 'LineString'
	| 'Polygon';

export type Interactions = {
	enabled: OnOffInteraction[];
	baseMap: string;
	/**
	 * Custom labels for drawing buttons
	 */
	buttonLabels: Record<string, string>;
	/**
	 * Custom labels for description field of features
	 */
	descriptionLabels: Record<string, string>;
	/**
	 * Custom labels for features in report (export)
	 */
	featureLabels: Record<string, string>;
	/**
	 * Question to be displayed in feature boxes
	 */
	featureQuestions: Record<string, Partial<Question>>;
	/**
	 * Question to be displayed for rating explanation
	 */
	ratingQuestion: string;
	/**
	 * Number of stars for Rating interaction
	 */
	stars: number;
};

export function createInteractions(data: Partial<Interactions>): Interactions {
	return {
		enabled: data.enabled || [],
		baseMap: data.baseMap || 'osm',
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
	return JSON.stringify(interactions);
}

export function deserializeInteractions(json: string | undefined) {
	const parsed = safeParseJSON(json || '[]');
	if (Array.isArray(parsed)) {
		const enabled: OnOffInteraction[] = [];
		let stars = 5;
		parsed.forEach((ia) => {
			if (ia.startsWith('stars=')) {
				stars = Number(ia.split('=')[1]);
			} else {
				enabled.push(ia);
			}
		});
		return createInteractions({ enabled, stars });
	}
	return createInteractions(parsed);
}

export function isItInteractive(interactions: Interactions | null) {
	return (
		interactions?.enabled?.includes('Point') ||
		interactions?.enabled?.includes('LineString') ||
		interactions?.enabled?.includes('Polygon')
	);
}
