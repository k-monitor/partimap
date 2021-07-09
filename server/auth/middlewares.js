const { StatusCodes } = require('http-status-codes');

function ensureLoggedIn(req, res, next) {
	if (!req.isAuthenticated || !req.isAuthenticated()) {
		res.sendStatus(StatusCodes.UNAUTHORIZED);
	} else {
		next();
	}
}

function ensureAdmin(req, res, next) {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		res.sendStatus(StatusCodes.UNAUTHORIZED);
	}
}

function ensureAdminOr(cond) {
	return (req, res, next) => {
		if ((req.user && req.user.isAdmin) || cond(req)) {
			next();
		} else {
			res.sendStatus(StatusCodes.UNAUTHORIZED);
		}
	};
}

module.exports = {
	ensureLoggedIn,
	ensureAdmin,
	ensureAdminOr
};
