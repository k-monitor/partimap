const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const { resolveRecord } = require('../common/middlewares');
const pdb = require('../project/project.db');
const sdb = require('../sheet/sheet.db');
const rdb = require('../rating/rating.db');
const sadb = require('../surveyAnswer/surveyAnswer.db');
const sfdb = require('../submittedFeatues/submittedFeatures.db');
const smdb = require('./submission.db');

router.post('/submission/:projectId',
	resolveRecord(req => req.params.projectId, pdb.findById, 'project'),
	async (req, res) => {
		/*
			{
				sheetID: {
					answers: {
						questionID: answer.toString(),
						...
					},
					features: [],
					ratings: {
						featureID: value,
						...
					}
				},
				...
			}
		*/
		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
		const ua = req.headers['user-agent'];
		const projectSheetIds = (await sdb.findByProjectId(req.project.id)).map(s => s.id);
		const submittedSheetIds = Object.keys(req.body).map(id => Number(id)).filter(id => projectSheetIds.includes(id));
		if (!submittedSheetIds.length) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}
		// TODO validate answers: filter for existing questionIDs in that same sheet
		// TODO validate ratings: filter for existing featureIDs in that same sheet
		// TODO send BAD_REQUEST if no answer, no feature and no rating present

		const submissionId = await smdb.create({
			projectId: req.project.id,
			timestamp: new Date().getTime(),
			ip,
			ua,
		});
		for (const sheetId of submittedSheetIds) {
			const s = req.body[sheetId];
			if (s.answers) {
				for (const questionId in s.answers) {
					await sadb.create({
						submissionId,
						sheetId,
						questionId,
						answer: s.answers[questionId]
					});
				}
			}
			if (s.features) {
				await sfdb.create({
					submissionId,
					sheetId,
					features: s.features
				});
			}
			if (s.ratings) {
				for (const fid in s.ratings) {
					const featureId = Number(fid);
					if (!featureId) { continue; }
					await rdb.create({
						submissionId,
						sheetId,
						featureId,
						rating: s.ratings[featureId]
					});
				}
			}
		}
		// TODO improvement I: insert in bulk by table
		// TODO improvement II: do all this in transaction
		res.json({ submissionId });
	}
);

module.exports = router;
