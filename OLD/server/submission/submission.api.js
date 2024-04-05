const xl = require('excel4node');
const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');
const isMobile = require('is-mobile');
const transformation = require('transform-coordinates');
const { ensureAdminOr, ensureLoggedIn } = require('../auth/middlewares');
const i18n = require('../common/i18n');
const { safeParseJSONArray } = require('../common/json');
const { resolveRecord, validateCaptcha } = require('../common/middlewares');
const pdb = require('../project/project.db');
const sdb = require('../sheet/sheet.db');
const rdb = require('../rating/rating.db');
const sadb = require('../surveyAnswer/surveyAnswer.db');
const sfdb = require('../submittedFeatures/submittedFeatures.db');
const smdb = require('./submission.db');

const OL2GM = transformation('EPSG:3857', 'EPSG:4326'); // TODO use common constants
function ol2gm(coords) {
	const { x, y } = OL2GM.forward({ x: coords[0], y: coords[1] });
	return [y, x];
}

router.post(
	'/submission/:projectId',
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
						featureID: {
							value: number,
							question: string,
							answer: string,
							pros: string,
							cons: string,
						},
						...
					}
				},
				...
			}
		*/
		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
		const ua = req.headers['user-agent'];
		const projectSheetIds = (await sdb.findByProjectId(req.project.id)).map(
			s => s.id
		);
		const submittedSheetIds = Object.keys(req.body)
			.map(id => Number(id))
			.filter(id => projectSheetIds.includes(id));
		if (!submittedSheetIds.length) {
			return res.sendStatus(StatusCodes.BAD_REQUEST);
		}
		// TODO validate answers: filter for existing questionIDs in that same sheet
		// TODO validate ratings: filter for existing featureIDs in that same sheet
		// TODO send BAD_REQUEST if no answer, no feature and no rating present

		const submission = {
			projectId: req.project.id,
			timestamp: new Date().getTime(),
			ip,
			ua,
		};
		const ratings = [];
		const surveyAnswers = [];
		const submittedFeatures = [];

		for (const sheetId of submittedSheetIds) {
			const s = req.body[sheetId];
			if (s.answers) {
				for (const questionId in s.answers) {
					surveyAnswers.push({
						sheetId,
						questionId,
						answer: s.answers[questionId],
					});
				}
			}
			if (s.features) {
				submittedFeatures.push({
					sheetId,
					features: s.features,
				});
			}
			if (s.ratings) {
				for (const fid in s.ratings) {
					const featureId = Number(fid);
					if (!featureId) continue;
					const ratingObj = s.ratings[featureId];
					ratings.push({
						sheetId,
						featureId,
						rating: ratingObj.value,
						question: ratingObj.question,
						answer: ratingObj.answer,
						pros: ratingObj.pros,
						cons: ratingObj.cons,
					});
				}
			}
		}
		const submissionId = await smdb.create(
			submission,
			ratings,
			surveyAnswers,
			submittedFeatures
		);
		res.json({ submissionId });
	}
);

router.get(
	'/submission/export/:lang/:id',
	ensureLoggedIn,
	resolveRecord(req => req.params.id, pdb.findById, 'project'),
	async (req, res) => {
		const m = i18n(req.params.lang).report;
		const sheets = await sdb.findByProjectId(req.project.id);
		const submissions = await smdb.findByProjectId(req.project.id);
		const answers = await sadb.findByProjectId(req.project.id);
		const ratings = await rdb.findByProjectId(req.project.id);
		const submittedFeatures = await sfdb.findByProjectId(req.project.id);

		const questions = [];
		sheets.forEach(s => {
			try {
				const survey = JSON.parse(s.survey);
				questions.push(...survey.questions);
			} catch {}
		});

		const wb = new xl.Workbook({
			dateFormat: m.dateFormat,
		});

		const sas = wb.addWorksheet(m.submittedAnswers);
		sas.cell(1, 1).string(m.submissionId);
		sas.cell(1, 2).string(m.timestamp);
		sas.cell(1, 3).string('IP');
		sas.cell(1, 4).string(m.isMobile);
		submissions.forEach((s, row) => {
			const CELL = col => sas.cell(row + 2, col);
			CELL(1).number(s.id);
			CELL(2).date(new Date(s.timestamp));
			CELL(3).string(s.ip);
			CELL(4).string(
				isMobile({ ua: s.ua }) ? m.isMobileYes : m.isMobileNo
			);

			let COL = 5;
			questions.forEach(q => {
				let a = answers.filter(
					a =>
						a.submissionId === s.id &&
						String(a.questionId) === String(q.id)
				)[0];
				if (a) a = a.answer;
				a = a || '';

				function writeCell(a) {
					if (!a && String(a) !== '0') return;
					const asNum = Number(a);
					if (!isNaN(asNum)) {
						CELL(COL).number(asNum);
					} else if (Array.isArray(a)) {
						CELL(COL).string(a.join('; '));
					} else {
						CELL(COL).string(a);
					}
				}

				if (q.type === 'distributeUnits' || q.type.includes('Matrix')) {
					// multiple columns
					try {
						a = JSON.parse(a);
					} catch {}

					const subkeys = q.rows || q.options;
					(subkeys || []).forEach(subkey => {
						sas.cell(1, COL).string(`${q.label} [${subkey}]`);
						writeCell(a[subkey]);
						COL++;
					});
				} else {
					// single column
					sas.cell(1, COL).string(q.label);
					if (q.type === 'checkbox') {
						try {
							a = JSON.parse(a);
						} catch {}
					}
					writeCell(a);
					COL++;
				}
			});
		});

		const rs = wb.addWorksheet(m.ratings);
		rs.cell(1, 1).string(m.submissionId);
		rs.cell(1, 2).string(m.feature);
		rs.cell(1, 3).string(m.featureName);
		rs.cell(1, 4).string(m.rating);
		rs.cell(1, 5).string(m.ratingQuestion);
		rs.cell(1, 6).string(m.ratingAnswer);
		rs.cell(1, 7).string(m.ratingPros);
		rs.cell(1, 8).string(m.ratingCons);
		ratings.forEach((r, i) => {
			rs.cell(i + 2, 1).number(r.submissionId);
			rs.cell(i + 2, 2).string(String(r.featureId));
			rs.cell(i + 2, 4).number(r.rating);
			rs.cell(i + 2, 5).string(r.question || '');
			rs.cell(i + 2, 6).string(r.answer || '');
			rs.cell(i + 2, 7).string(r.pros || '');
			rs.cell(i + 2, 8).string(r.cons || '');
			const sheet = sheets.filter(sh => sh.id === r.sheetId)[0];
			if (sheet && sheet.features) {
				const features = JSON.parse(sheet.features);
				const feature = features.find(
					f => String(f.id) === String(r.featureId)
				);
				const name = feature?.properties?.name || '';
				rs.cell(i + 2, 3).string(String(name));
			}
		});

		const ars = wb.addWorksheet(m.aggregatedRatings);
		ars.cell(1, 1).string(m.feature);
		ars.cell(1, 2).string(m.featureName);
		ars.cell(1, 3).string(m.ratingCount);
		ars.cell(1, 4).string(m.aggregatedRating);
		ars.cell(1, 5).string(m.likeCount);
		ars.cell(1, 6).string(m.dislikeCount);
		ars.cell(1, 7).string(m.ratingQuestion);
		ars.cell(1, 8).string(m.ratingAnswer);
		ars.cell(1, 9).string(m.ratingPros);
		ars.cell(1, 10).string(m.ratingCons);
		let row = 1;
		for (let i = 0; i < sheets.length; i++) {
			const sheet = sheets[i];
			const features = JSON.parse(sheet.features);
			let stars = 0;
			try {
				stars = JSON.parse(sheet.interactions).stars;
			} catch {}

			/** @type {AggregatedRating[]} */
			const ar = await rdb.aggregateBySheetId(sheet.id);
			for (let j = 0; j < ar.length; j++) {
				const r = ar[j];
				const feature = features.find(
					f => String(f.id) === String(r.featureId)
				);
				if (!feature) continue;

				row++;
				const name = feature.properties?.name || '';
				ars.cell(row, 1).string(String(r.featureId));
				ars.cell(row, 2).string(String(name));
				ars.cell(row, 3).number(r.count);
				if (stars === -2) {
					ars.cell(row, 4).number(Number(r.sum));
					ars.cell(row, 5).number(Number(r.likeCount));
					ars.cell(row, 6).number(Number(r.dislikeCount));
				} else {
					ars.cell(row, 4).number(Number(r.average));
				}

				const rs = ratings.filter(
					r => r.sheetId === sheet.id && r.featureId === feature.id
				);
				ars.cell(row, 7).string(rs[rs.length - 1]?.question || '');
				ars.cell(row, 8).string(
					rs
						.map(r => r.answer || '')
						.map(a => a.replace(/\s+/g, ' ').trim())
						.filter(Boolean)
						.join(';')
				);
				ars.cell(row, 9).string(
					rs
						.map(r => r.pros || '')
						.map(a => a.replace(/\s+/g, ' ').trim())
						.filter(Boolean)
						.join(';')
				);
				ars.cell(row, 10).string(
					rs
						.map(r => r.cons || '')
						.map(a => a.replace(/\s+/g, ' ').trim())
						.filter(Boolean)
						.join(';')
				);
			}
		}

		const sfs = wb.addWorksheet(m.submittedFeatures);
		sfs.cell(1, 1).string(m.submissionId);
		sfs.cell(1, 2).string(m.featureLabel);
		sfs.cell(1, 3).string(m.featureType);
		sfs.cell(1, 4).string(m.coords);
		sfs.cell(1, 5).string(m.feature);
		sfs.cell(1, 6).string(m.featureName);
		sfs.cell(1, 7).string(m.descriptionLabel);
		sfs.cell(1, 8).string(m.featureDesc);
		sfs.cell(1, 9).string(m.featureQuestion);
		sfs.cell(1, 10).string(m.featureQuestionAnswer);
		row = 1;
		for (let i = 0; i < submittedFeatures.length; i++) {
			const sf = submittedFeatures[i];
			const sheet = sheets.filter(s => s.id === sf.sheetId)[0];
			if (sheet) {
				const features = safeParseJSONArray(sf.features).filter(
					f => !!f.id
				);
				const interactions = JSON.parse(sheet.interactions || '{}');
				for (let j = 0; j < features.length; j++) {
					const f = features[j];
					const name = f?.properties?.name || '';

					let coords = f.geometry.coordinates;
					// flatten completely
					while (Array.isArray(coords[0])) {
						coords = coords.flat();
					}
					// make pairs
					coords = coords.reduce((result, value, index, array) => {
						index % 2 === 0 &&
							result.push(array.slice(index, index + 2));
						return result;
					}, []);
					// convert coordinate pairs to right projection (used on GM)
					coords = coords.map(pair => ol2gm(pair));
					// convert to string, 1 point per line
					coords = coords.map(c => c.join(';')).join('\n');

					const type = m.geometry[f.geometry.type];
					const descriptionLabel =
						(interactions.descriptionLabels || {})[
							f.geometry.type
						] || '';
					const featureLabel =
						(interactions.featureLabels || {})[f.geometry.type] ||
						type;

					const rawAnswer =
						f?.properties?.partimapFeatureQuestion_ans || '';
					let answer = '';
					try {
						const v = JSON.parse(rawAnswer);
						if (Array.isArray(v)) answer = v.join(', ');
					} catch {}

					row++;
					sfs.cell(row, 1).number(sf.submissionId);
					sfs.cell(row, 2).string(featureLabel);
					sfs.cell(row, 3).string(type);
					sfs.cell(row, 4).string(coords);
					sfs.cell(row, 5).string(String(f.id));
					sfs.cell(row, 6).string(String(name));
					sfs.cell(row, 7).string(descriptionLabel);
					sfs.cell(row, 8).string(f?.properties?.description || '');
					sfs.cell(row, 9).string(
						f?.properties?.partimapFeatureQuestion
					);
					sfs.cell(row, 10).string(answer);
				}
			}
		}

		wb.write((req.project.title || 'export') + '.xlsx', res);
	}
);

module.exports = router;
