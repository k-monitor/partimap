class AggregatedRating {
	/**
	 * @param {Object} data
	 * @param {Number} data.featureId
	 * @param {Number} data.count
	 * @param {Number} data.average
	 */
	constructor(data) {
		this.id = data.id;
		this.featureId = data.featureId;
		this.count = data.count;
		this.average = data.average;
	}
};

module.exports = AggregatedRating;
