// This file handles the (de)serialization of the sheet.interactions field
// in a backward-compatible way.

class Interactions {
	/**
	 * @param {Object} data Derserialized interactions object
	 * @param {String[]} data.enabled List of enabled interactions
	 * @param {{Point: String, LineString: String, Polygon: String}} data.buttonLabels Custom labels for drawing buttons
	 * @param {Number} data.stars Number of stars for Rating interaction
	 */
	constructor(data) {
		data = data || {};
		this.enabled = [...data.enabled];
		this.buttonLabels = {
			Point: data.buttonLabels?.Point || '',
			LineString: data.buttonLabels?.LineString || '',
			Polygon: data.buttonLabels?.Polygon || '',
		};
		this.stars = data.stars || 5;
	}
}

export function serializeInteractions(interactions) {
	return JSON.stringify(interactions);
}

export function deserializeInteractions(json) {
	let parsed;
	try {
		parsed = JSON.parse(json);
	} catch {
		parsed = [];
	}
	if (Array.isArray(parsed)) { // backward-compatibility for format ['Point', 'stars=5', ...]
		const arr = parsed;
		const interactions = new Interactions();
		arr.forEach(ia => {
			if (ia.startsWith('stars=')) {
				interactions.stars = Number(ia.split('=')[1]);
			} else {
				interactions.enabled.push(ia);
			}
		});
		return interactions;
	}
	return new Interactions(parsed);
}
