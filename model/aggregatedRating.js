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
		this.average = data.average;
		this.count = data.count;
		this.dislikeCount = data.dislikeCount;
		this.featureId = data.featureId;
		this.likeCount = data.likeCount;
		this.sum = data.sum;
	}
};

module.exports = AggregatedRating;
