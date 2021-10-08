class Submission {
	/**
	 * @param {Object} data
	 * @param {Number} data.id
	 * @param {Number} data.projectId
	 * @param {Number} data.timestamp
	 * @param {String} data.ip
	 * @param {String} data.ua
	 */
	constructor(data) {
		this.id = data.id;
		this.projectId = data.projectId;
		this.timestamp = data.timestamp;
		this.ip = data.ip;
		this.ua = data.ua;
	}
};

module.exports = Submission;
