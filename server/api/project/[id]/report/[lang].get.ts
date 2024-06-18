import { Readable } from 'stream';
import xl from 'excel4node';
import type { Feature as GeoJsonFeature } from 'geojson';
import StatusCodes from 'http-status-codes';
import isMobile from 'is-mobile';
import transformation from 'transform-coordinates';
import { z } from 'zod';
import * as pdb from '~/server/data/projects';
import * as rdb from '~/server/data/ratings';
import * as sdb from '~/server/data/sheets';
import * as sadb from '~/server/data/surveyAnswers';
import * as sfdb from '~/server/data/submittedFeatures';
import * as smdb from '~/server/data/submissions';
import { Survey } from '~/server/data/surveyAnswers';
import { deserializeInteractions } from '~/utils/interactions';

const OL2GM = transformation('EPSG:3857', 'EPSG:4326'); // TODO use common constants
function ol2gm(coords: number[]) {
	// TODO can't we use OL's conversion utility here?
	const { x, y } = OL2GM.forward({ x: coords[0], y: coords[1] });
	return [y, x];
}

const paramsSchema = z.object({
	id: z.coerce.number(),
	lang: z.string(),
});

export default defineEventHandler(async (event) => {
	const { id, lang } = await getValidatedRouterParams(event, paramsSchema.parse);

	await ensureLoggedIn(event);

	const project = await pdb.findById(id);
	if (!project) throw createError({ statusCode: StatusCodes.NOT_FOUND });

	await ensureAdminOr(event, project.userId);

	const m = i18n(lang).report;
	const sheets = await sdb.findAllByProjectId(project.id);
	const submissions = await smdb.findByProjectId(project.id);
	const answers = await sadb.findAllByProjectId(project.id);
	const ratings = await rdb.findAllByProjectId(project.id);
	const submittedFeatures = await sfdb.findAllByProjectId(project.id);

	const questions: sadb.Question[] = [];
	sheets.forEach((s) => {
		const survey: Survey | null = safeParseJSON(s.survey);
		questions.push(...(survey?.questions || []));
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
		const CELL = (col: number) => sas.cell(row + 2, col);
		CELL(1).number(s.id);
		CELL(2).date(new Date(s.timestamp));
		CELL(3).string(s.ip);
		CELL(4).string(isMobile({ ua: s.ua }) ? m.isMobileYes : m.isMobileNo);

		let COL = 5;
		questions.forEach((q) => {
			let a: any = answers.filter(
				(a) => a.submissionId === s.id && String(a.questionId) === String(q.id),
			)[0];
			if (a) a = a.answer;
			a = a || '';

			function writeCell(a: string | number | null) {
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
				a = safeParseJSON(a) || a;

				const subkeys = q.rows || q.options;
				(subkeys || []).forEach((subkey) => {
					sas.cell(1, COL).string(`${q.label} [${subkey}]`);
					writeCell(a[subkey]);
					COL++;
				});
			} else {
				// single column
				sas.cell(1, COL).string(q.label);
				if (q.type === 'checkbox') {
					a = safeParseJSON(a) || a;
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
		const sheet = sheets.filter((sh) => sh.id === r.sheetId)[0];
		if (sheet && sheet.features) {
			const features = safeParseJSONArray(sheet.features) as GeoJsonFeature[];
			const feature = features.find((f) => String(f.id) === String(r.featureId));
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
		const features = safeParseJSONArray(sheet.features) as GeoJsonFeature[]; // TODO redundant
		const interactions = deserializeInteractions(sheet);
		const stars = interactions.stars;

		const ar = await rdb.aggregateBySheetId(sheet.id);
		for (let j = 0; j < ar.length; j++) {
			const r = ar[j];
			const feature = features.find((f) => String(f.id) === String(r.featureId));
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

			const rs = ratings.filter((r) => r.sheetId === sheet.id && r.featureId === feature.id);
			ars.cell(row, 7).string(rs[rs.length - 1]?.question || '');
			ars.cell(row, 8).string(
				rs
					.map((r) => r.answer || '')
					.map((a) => a.replace(/\s+/g, ' ').trim())
					.filter(Boolean)
					.join(';'),
			);
			ars.cell(row, 9).string(
				rs
					.map((r) => r.pros || '')
					.map((a) => a.replace(/\s+/g, ' ').trim())
					.filter(Boolean)
					.join(';'),
			);
			ars.cell(row, 10).string(
				rs
					.map((r) => r.cons || '')
					.map((a) => a.replace(/\s+/g, ' ').trim())
					.filter(Boolean)
					.join(';'),
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
		const sheet = sheets.filter((s) => s.id === sf.sheetId)[0];
		if (sheet) {
			const features = ((safeParseJSONArray(sf.features) || []) as GeoJsonFeature[]).filter(
				(f) => !!f.id,
			);
			const interactions = deserializeInteractions(sheet);
			for (let j = 0; j < features.length; j++) {
				const f = features[j];
				const name = f?.properties?.name || '';

				let coords = (f.geometry as any).coordinates; // TODO need proper type
				// flatten completely
				while (Array.isArray(coords[0])) {
					coords = coords.flat();
				}
				// make pairs
				coords = coords.reduce(
					(result: number[][], value: number, index: number, array: number[]) => {
						index % 2 === 0 && result.push(array.slice(index, index + 2));
						return result;
					},
					[],
				);
				// convert coordinate pairs to right projection (used on GM)
				coords = coords.map((pair: number[]) => ol2gm(pair));
				// convert to string, 1 point per line
				coords = coords.map((pair: number[]) => pair.join(';')).join('\n');

				const type = (m.geometry as any)[f.geometry.type];
				const descriptionLabel =
					(interactions.descriptionLabels || {})[f.geometry.type] || '';
				const featureLabel = (interactions.featureLabels || {})[f.geometry.type] || type;
				const answer = safeParseJSONArray(f?.properties?.partimapFeatureQuestion_ans).join(
					', ',
				);

				row++;
				sfs.cell(row, 1).number(sf.submissionId);
				sfs.cell(row, 2).string(featureLabel);
				sfs.cell(row, 3).string(type);
				sfs.cell(row, 4).string(coords);
				sfs.cell(row, 5).string(String(f.id));
				sfs.cell(row, 6).string(String(name));
				sfs.cell(row, 7).string(descriptionLabel);
				sfs.cell(row, 8).string(f?.properties?.description || '');
				sfs.cell(row, 9).string(f?.properties?.partimapFeatureQuestion);
				sfs.cell(row, 10).string(answer);
			}
		}
	}

	const buffer: Buffer = await wb.writeToBuffer();
	const filename = `${project.title || 'export'}.xlsx`;
	setHeader(event, 'content-disposition', `attachment; filename=${filename}`);
	await sendStream(event, Readable.from(buffer, {}));
});
