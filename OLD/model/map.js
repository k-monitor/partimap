class Map {
	/**
	 * @param {Object} data
	 * @param {Number} data.id
	 * @param {Number} data.userId
	 * @param {String} data.title
	 * @param {String} data.features
	 */
	constructor(data) {
		this.id = data.id;
		this.userId = data.userId;
		this.title = data.title;
		this.features = data.features;
	}
}

module.exports = Map;
