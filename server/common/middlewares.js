const { StatusCodes } = require('http-status-codes');

function resolveRecord(idFromReq, findById, field, optional) {
	return async (req, res, next) => {
		const id = idFromReq(req);
		if (!id && !optional) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}

		field = field || 'record';
		req[field] = await findById(id);
		if (!req[field] && !optional) {
			return res.sendStatus(StatusCodes.NOT_FOUND);
		}
		next();
	};
}

module.exports = {
	resolveRecord
};
