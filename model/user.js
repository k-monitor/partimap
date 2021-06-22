class Inst {
	/**
	 * @param {Object} data
	 * @param {Number} data.id
	 * @param {String} data.email
	 * @param {String} data.password
	 * @param {String} data.name
	 * @param {Number} data.registered
	 * @param {Number} data.instId
	 * @param {Boolean} data.isAdmin
	 */
	constructor(data) {
		this.id = data.id;
		this.email = data.email;
		this.password = data.password;
		this.name = data.name;
		this.registered = data.registered || new Date().getTime();
		this.instId = data.instId;
		this.isAdmin = data.isAdmin || false;
	}
};

module.exports = Inst;
