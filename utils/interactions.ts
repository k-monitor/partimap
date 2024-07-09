// This file handles the (de)serialization of the sheet.interactions field
// in a backward-compatible way.

import type { Feature as GeoJsonFeature } from 'geojson';
import { nanoid } from 'nanoid';
import type { Sheet } from '~/server/data/sheets';
import type { Question, Survey } from '~/server/data/surveyAnswers';

export const DRAW_TYPES = ['Point', 'LineString', 'Polygon'] as const;
export type DrawType = (typeof DRAW_TYPES)[number];

export const DRAW_TYPE_ICONS: Record<DrawTypeWithOffState, string> = {
	'': 'fa-times',
	Point: 'fa-map-marker-alt',
	LineString: 'fa-route',
	Polygon: 'fa-draw-polygon',
};

export type DrawingInteraction = {
	id: string;
	type: DrawType;

	/**
	 * Custom label for drawing button
	 */
	buttonLabel: string;

	/**
	 * Color of drawing button and features
	 */
	color: string;

	/**
	 * Whether visitor can describe features
	 */
	describing: boolean;

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
	featureQuestion: Partial<Question>;

	/**
	 * Maximum number of features to be drawn (0 = unlimited)
	 */
	max: number;

	/**
	 * Whether visitor can name their features
	 */
	naming: boolean;
};

export function createDrawingInteraction(di: Partial<DrawingInteraction>): DrawingInteraction {
	return {
		id: di.id || nanoid(),
		type: di.type || 'Point',
		buttonLabel: di.buttonLabel || '',
		color: di.color || DEFAULT_COLORS[di.type || 'Point'],
		describing: Object.hasOwn(di, 'describing') ? !!di.describing : true, // true because of backward-compatibility
		descriptionLabel: di.descriptionLabel || '',
		featureLabel: di.featureLabel || '',
		featureQuestion: di.featureQuestion || {},
		max: Math.max(0, di.max || 0),
		naming: !!di.naming,
	};
}

export type OnOffInteraction =
	| 'Rating'
	| 'RatingExplanation'
	| 'RatingProsCons'
	| 'RatingResults'
	| 'ShowResultsOnly'
	| 'SocialSharing';

type LegacyOnOffInteraction = OnOffInteraction | DrawType | 'naming' | `stars=${number}`;

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
};

export type LegacyInteractions =
	| LegacyOnOffInteraction[]
	| (Omit<Interactions, 'enabled'> & {
			enabled: LegacyOnOffInteraction[];
			buttonLabels: Record<DrawType, string>;
			descriptionLabels: Record<DrawType, string>;
			featureLabels: Record<DrawType, string>;
			featureQuestions: Record<DrawType, Partial<Question>>;
	  });

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

	const parsed: Partial<LegacyInteractions> = safeParseJSON(json) || {};
	if (Array.isArray(parsed)) {
		// #2346, #2841 backward compatibility
		parsed.forEach((ia: LegacyOnOffInteraction | undefined) => {
			if (!ia) return;
			if (DRAW_TYPES.includes(ia as DrawType)) {
				interactions.drawing.push(
					createDrawingInteraction({
						id: ia,
						type: ia as DrawType,
						naming: parsed.includes('naming'),
					}),
				);
			} else if (ia.startsWith('stars=')) {
				interactions.stars = Number(ia.split('=')[1]);
			} else if (ia !== 'naming') {
				interactions.enabled.push(ia as OnOffInteraction);
			}
		});
	} else {
		interactions = createInteractions(parsed as Interactions);

		// #2841 backward compatibility
		const filteredEnabled: OnOffInteraction[] = [];
		(parsed.enabled || []).forEach((ia: LegacyOnOffInteraction) => {
			if (ia === 'naming') return;

			if (!DRAW_TYPES.includes(ia as DrawType)) {
				return filteredEnabled.push(ia as OnOffInteraction);
			}

			const dt = ia as DrawType;
			interactions.drawing.push(
				createDrawingInteraction({
					id: ia,
					type: ia as DrawType,
					buttonLabel: parsed.buttonLabels?.[dt],
					descriptionLabel: parsed.descriptionLabels?.[dt],
					featureLabel: parsed.featureLabels?.[dt],
					featureQuestion: parsed.featureQuestions?.[dt],
					naming: parsed.enabled?.includes('naming'),
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

export function lookupDrawingInteraction(
	interactions: Interactions | null | undefined,
	feature: GeoJsonFeature | undefined,
): DrawingInteraction {
	if (!feature) return createDrawingInteraction({});
	const vf = feature.properties?.visitorFeature; // boolean (old) or string (new)
	const diId: string = !vf || vf === true ? feature.geometry.type : vf;
	const dis = interactions?.drawing || [];
	return dis.find((di) => di.id === diId) || createDrawingInteraction({ id: diId });

	// TODO test
}
