const xl = require('excel4node');
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const { ensureAdminOr, ensureLoggedIn } = require('../auth/middlewares');
const { resolveRecord, validateCaptcha } = require('../common/middlewares');
const pdb = require('../project/project.db');
const sdb = require('../sheet/sheet.db');
const rdb = require('../rating/rating.db');
const sadb = require('../surveyAnswer/surveyAnswer.db');
const sfdb = require('../submittedFeatues/submittedFeatures.db');
const smdb = require('./submission.db');

router.post('/submission/:projectId',
	validateCaptcha(),
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

router.get('/submission/feature-counts/:id',
	ensureLoggedIn,
	resolveRecord(req => req.params.id, pdb.findById, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	async (req, res) => {
		const sfs = await sfdb.findByProjectId(req.project.id);
		const sfcs = {};
		sfs.forEach(({ sheetId, features }) => {
			const f = JSON.parse(features || '[]');
			sfcs[sheetId] = (sfcs[sheetId] || 0) + f.length;
		});
		res.json(sfcs);
	}
);

router.get('/submission/ratings/:id',
	ensureLoggedIn,
	resolveRecord(req => req.params.id, sdb.findById, 'sheet'),
	resolveRecord(req => req.sheet.projectId, pdb.findById, 'project'),
	ensureAdminOr(req => req.project.userId === req.user.id),
	async (req, res) => {
		const ars = await rdb.aggregateBySheetId(req.sheet.id);
		const frs = {};
		ars.forEach(({ featureId, average }) => {
			frs[featureId] = average;
		});
		res.json(frs);
	}
);

router.get('/submission/export/:id',
	ensureLoggedIn,
	resolveRecord(req => req.params.id, pdb.findById, 'project'),
	async (req, res) => {
		const sheets = await sdb.findByProjectId(req.project.id);
		const submissions = await smdb.findByProjectId(req.project.id);
		const answers = await sadb.findByProjectId(req.project.id);
		const ratings = await rdb.findByProjectId(req.project.id);

		const questions = [];
		sheets.forEach(s => {
			try {
				const survey = JSON.parse(s.survey);
				questions.push(...survey.questions);
			} catch { }
		});

		const wb = new xl.Workbook({
			dateFormat: 'YYYY-MM-DD HH:MM:SS',
		});

		const sas = wb.addWorksheet('Beküldött válaszok');
		sas.cell(1, 1).string('Azonosító');
		sas.cell(1, 2).string('Időbélyeg');
		questions.forEach((q, i) => {
			sas.cell(1, i + 3).string(q.label);
		});
		submissions.forEach((s, i) => {
			sas.cell(i + 2, 1).number(s.id);
			sas.cell(i + 2, 2).date(new Date(s.timestamp));
			questions.forEach((q, j) => {
				const ans = answers.filter(a => a.id === s.id && String(a.questionId) === String(q.id))[0];
				const a = ans ? ans.answer : '';
				if (Number.isInteger(a)) {
					sas.cell(i + 2, j + 3).number(a);
				} else {
					sas.cell(i + 2, j + 3).string(a);
				}
			});
		});

		const rs = wb.addWorksheet('Értékelések');
		rs.cell(1, 1).string('Kitöltés azonosító');
		rs.cell(1, 2).string('Térkép elem');
		rs.cell(1, 3).string('Értékelés');
		ratings.forEach((r, i) => {
			rs.cell(i + 2, 1).number(r.submissionId);
			rs.cell(i + 2, 2).string(String(r.featureId));
			rs.cell(i + 2, 3).number(r.rating);
			const sheet = sheets.filter(sh => sh.id === r.sheetId)[0];
			if (sheet && sheet.features) {
				const features = JSON.parse(sheet.features);
				const feature = features.filter(f => f.id === r.featureId)[0];
				const name = feature?.properties?.name || feature.id;
				rs.cell(i + 2, 2).string(String(name));
			}
		});

		const ars = wb.addWorksheet('Aggregált értékelések');
		ars.cell(1, 1).string('Térkép elem');
		ars.cell(1, 2).string('Értékelések száma');
		ars.cell(1, 3).string('Átlagos értékelés');
		let arsi = 1;
		for (let i = 0; i < sheets.length; i++) {
			const sheet = sheets[i];
			const features = JSON.parse(sheet.features);
			const ar = await rdb.aggregateBySheetId(sheet.id);
			for (let j = 0; j < ar.length; j++) {
				const r = ar[j];
				arsi++;
				const feature = features.filter(f => f.id === r.featureId)[0];
				const name = feature?.properties?.name || feature.id;
				ars.cell(arsi, 1).string(String(name));
				ars.cell(arsi, 2).number(r.count);
				ars.cell(arsi, 3).number(Number(r.average));
			}
		}

		// const sfs = wb.addWorksheet('Beküldött térkép elemek');

		wb.write('export.xlsx', res);
	}
);

module.exports = router;
