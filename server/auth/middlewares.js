const { StatusCodes } = require('http-status-codes');

function ensureLoggedIn(req, res, next) {
	if (!req.isAuthenticated || !req.isAuthenticated()) {
		res.sendStatus(StatusCodes.UNAUTHORIZED);
	} else {
		next();
	}
}

function ensureAdmin(req, res, next) {
	if (!req.user.isAdmin) {
		res.sendStatus(StatusCodes.UNAUTHORIZED);
	} else {
		next();
	}
}

module.exports = {
	ensureLoggedIn,
	ensureAdmin
};
