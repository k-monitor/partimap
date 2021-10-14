const { StatusCodes } = require('http-status-codes');

function ensureLoggedIn(req, res, next) {
	if (!req.isAuthenticated || !req.isAuthenticated()) {
		res.sendStatus(StatusCodes.UNAUTHORIZED);
	} else {
		next();
	}
}

function ensureAdmin(req, res, next) {
	if (isAdminAuthenticated(req)) {
		next();
	} else {
		res.sendStatus(StatusCodes.UNAUTHORIZED);
	}
}

function ensureAdminOr(cond) {
	return (req, res, next) => {
		if (isAdminAuthenticated(req) || cond(req)) {
			next();
		} else {
			res.sendStatus(StatusCodes.UNAUTHORIZED);
		}
	};
}

function isAdminAuthenticated(req) {
	return req.isAuthenticated && req.isAuthenticated() &&
		req.user && req.user.isAdmin;
}

module.exports = {
	ensureLoggedIn,
	ensureAdmin,
	ensureAdminOr
};
