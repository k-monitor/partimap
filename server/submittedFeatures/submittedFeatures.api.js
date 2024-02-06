const router = require('express').Router();
const { ensureAdminOr, ensureLoggedIn } = require('../auth/middlewares');
const { safeParseJSONArray } = require('../common/json');
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
		const sfs = await sfdb.findBySheetId(req.sheet.id);
		sfs.forEach(sf => {
			sf.features = safeParseJSONArray(sf.features);
			sf.features = JSON.stringify(sf.features);
		});
		res.json(sfs);
	}
);

module.exports = router;
