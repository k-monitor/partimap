class Project {
	/**
	 * @param {Object} data
	 * @param {Number} data.id
	 * @param {Number} data.userId
	 * @param {String} data.lang
	 * @param {String} data.slug
	 * @param {String} data.title
	 * @param {String} data.description
	 * @param {String} data.image
	 * @param {String} data.privacyPolicy
	 * @param {String} data.thanks,
	 * @param {String} data.thanksUrl,
	 * @param {Boolean} data.thanksSocial,
	 * @param {String} data.password
	 * @param {Number} data.views
	 * @param {Number} data.submissions
	 */
	constructor(data) {
		this.id = data.id;
		this.userId = data.userId;
		this.lang = data.lang;
		this.slug = data.slug;
		this.title = data.title;
		this.description = data.description;
		this.image = data.image;
		this.privacyPolicy = data.privacyPolicy;
		this.thanks = data.thanks;
		this.thanksUrl = data.thanksUrl;
		this.thanksSocial = data.thanksSocial;
		this.password = data.password;
		this.views = data.views;

		// calculated:
		this.submissions = data.submissions;
	}
};

module.exports = Project;
