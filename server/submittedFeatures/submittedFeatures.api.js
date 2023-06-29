const router = require('express').Router();
const { ensureAdminOr, ensureLoggedIn } = require('../auth/middlewares');
const { resolveRecord } = require('../common/middlewares');
const pdb = require('../project/project.db');
const sdb = require('../sheet/sheet.db');
const sfdb = require('./submittedFeatures.db');

router.get(
	'/submitted-features/:sid',
	ensureLoggedIn,
	resolveRecord(req => req.params.sid, sdb.findById, 'sheet'),
	resolveRecord(req => req.sheet.projectId, pdb.findById, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	async (req, res) => {
		const features = await sfdb.findBySheetId(req.sheet.id);
		res.json(features);
	}
);

module.exports = router;
