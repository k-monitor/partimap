// This file handles the (de)serialization of the sheet.interactions field
// in a backward-compatible way.

export class Interactions {
	/**
	 * @param {Object} data Derserialized interactions object
	 * @param {String[]} data.enabled List of enabled interactions
	 * @param {{Point: String, LineString: String, Polygon: String}} data.buttonLabels Custom labels for drawing buttons
	 * @param {{Point: String, LineString: String, Polygon: String}} data.descriptionLabels Custom labels for description field of features
	 * @param {{Point: String, LineString: String, Polygon: String}} data.featureLabels Custom labels for features in report (export)
	 * @param {{Point: Object, LineString: Object, Polygon: Object}} data.featureQuestions Question to be displayed in feature boxes
	 * @param {String} data.ratingQuestion Question to be displayed for rating explanation.
	 * @param {Number} data.stars Number of stars for Rating interaction
	 */
	constructor(data) {
		data = data || {};
		this.enabled = data.enabled || [];
		this.baseMap = data.baseMap || 'osm';
		this.buttonLabels = {
			Point: data.buttonLabels?.Point || '',
			LineString: data.buttonLabels?.LineString || '',
			Polygon: data.buttonLabels?.Polygon || '',
		};
		this.descriptionLabels = {
			Point: data.descriptionLabels?.Point || '',
			LineString: data.descriptionLabels?.LineString || '',
			Polygon: data.descriptionLabels?.Polygon || '',
		};
		this.featureLabels = {
			Point: data.featureLabels?.Point || '',
			LineString: data.featureLabels?.LineString || '',
			Polygon: data.featureLabels?.Polygon || '',
		};
		this.featureQuestions = {
			Point: data.featureQuestions?.Point || {},
			LineString: data.featureQuestions?.LineString || {},
			Polygon: data.featureQuestions?.Polygon || {},
		};
		this.ratingQuestion = data.ratingQuestion || '';
		this.stars = data.stars || 5;
	}
}

export function serializeInteractions(interactions) {
	return JSON.stringify(interactions);
}

function silentParse(json, defaultValue) {
	try {
		return JSON.parse(json);
	} catch {
		return defaultValue;
	}
}

/**
 * @param {String} json
 * @returns {Interactions}
 */
export function deserializeInteractions(json) {
	const parsed = silentParse(json, []);
	if (Array.isArray(parsed)) {
		const enabled = [];
		let stars = 5;
		parsed.forEach(ia => {
			if (ia.startsWith('stars=')) {
				stars = Number(ia.split('=')[1]);
			} else {
				enabled.push(ia);
			}
		});
		return new Interactions({ enabled, stars });
	}
	return new Interactions(parsed);
}
