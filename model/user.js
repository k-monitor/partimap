class User {
	/**
	 * @param {Object} data
	 * @param {Number} data.id
	 * @param {Boolean} data.active
	 * @param {String} data.email
	 * @param {String} data.password
	 * @param {String} data.name
	 * @param {String} data.color
	 * @param {String} data.logo
	 * @param {String} data.website
	 * @param {Number} data.registered
	 * @param {Number} data.lastLogin
	 * @param {String} data.token
	 * @param {Number} data.tokenExpires
	 * @param {Boolean} data.isAdmin
	 */
	constructor(data) {
		this.id = data.id;
		this.active = data.active;
		this.email = data.email;
		this.password = data.password;
		this.name = data.name;
		this.color = data.color;
		this.logo = data.logo;
		this.website = data.website;
		this.registered = data.registered || new Date().getTime();
		this.lastLogin = data.lastLogin || 0;
		this.isAdmin = data.isAdmin || false;
		this.token = data.token;
		this.tokenExpires = data.tokenExpires;
	}
}

module.exports = User;
