class AggregatedRating {
	/**
	 * @param {Object} data
	 * @param {Number} data.average
	 * @param {Number} data.count
	 * @param {Number} data.dislikeCount
	 * @param {Number} data.featureId
	 * @param {Number} data.likeCount
	 * @param {Number} data.sum
	 */
	constructor(data) {
		this.id = data.id;
		this.average = parseFloat(data.average);
		this.count = parseInt(data.count, 10);
		this.dislikeCount = parseInt(data.dislikeCount, 10);
		this.featureId = data.featureId;
		this.likeCount = parseInt(data.likeCount, 10);
		this.sum = parseInt(data.sum, 10);
	}
}

module.exports = AggregatedRating;
