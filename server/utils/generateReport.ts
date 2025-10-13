import xl from 'excel4node';
import type { Feature as GeoJsonFeature } from 'geojson';
import isMobile from 'is-mobile';
import transformation from 'transform-coordinates';
import type * as pdb from '~/server/data/projects';
import * as rdb from '~/server/data/ratings';
import * as sdb from '~/server/data/sheets';
import type { SheetTime } from '../data/sheetTimes';
import { findSheetTimes } from '../data/sheetTimes';
import * as sadb from '~/server/data/surveyAnswers';
import * as sfdb from '~/server/data/submittedFeatures';
import * as smdb from '~/server/data/submissions';
import type { Survey } from '~/server/data/surveyAnswers';
import i18n from '~/server/utils/i18n';
import { safeParseJSON, safeParseJSONArray } from '~/server/utils/json';
import { deserializeInteractions, lookupDrawingInteraction } from '~/utils/interactions';
import { OTHER_ANSWER, OTHER_PREFIX } from '~/utils/constants';
// Yes, we need explicit imports for utils as we use this file outside Nuxt context.

// TODO refactor: use xlsx.js instead of excel4node
// TODO refactor: use Nuxt i18n server side

const OL2GM = transformation('EPSG:3857', 'EPSG:4326'); // TODO use common constants
function ol2gm(coords: number[]) {
	// TODO can't we use OL's conversion utility here?
	const { x, y } = OL2GM.forward({ x: coords[0], y: coords[1] });
	return [y, x];
}

function createBenchmarkFunctions(enabled: boolean) {
	return {
		start(s: string) {
			if (enabled) console.time(s);
		},
		end(s: string) {
			if (enabled) console.timeEnd(s);
		},
	};
}

type ServerMessages = ReturnType<typeof i18n>;

export default async function (
	project: pdb.Project,
	lang: string,
	enableBenchmark: boolean = false,
) {
	const b = createBenchmarkFunctions(enableBenchmark);

	const m: ServerMessages['report'] = i18n(lang).report;
	const sheets = await sdb.findAllByProjectId(project.id);

	b.start('query: submissions');
	const submissions = await smdb.findByProjectId(project.id);
	b.end('query: submissions');

	b.start('query: answers');
	const answers = await sadb.findAllByProjectId(project.id);
	b.end('query: answers');

	b.start('query: aggregatedAnswers');
	const aggregatedAnswers = await sadb.aggregateByProjectId(project.id, true);
	b.end('query: aggregatedAnswers');

	b.start('query: ratings');
	const ratings = await rdb.findAllByProjectId(project.id);
	b.end('query: ratings');

	b.start('query: submitted features');
	const submittedFeatures = await sfdb.findAllByProjectId(project.id);
	b.end('query: submitted features');

	b.start('query: times');
	const sheetTimesArr = await findSheetTimes(sheets.map((s) => s.id));
	b.end('query: times');

	const questions: sadb.Question[] = [];
	sheets.forEach((s) => {
		const survey: Survey | null = safeParseJSON(s.survey);
		questions.push(...(survey?.questions || []));
	});

	const wb = new xl.Workbook({
		dateFormat: m.dateFormat,
	});

	b.start('sheet: answers');
	generateAnswersSheet(wb, m, questions, submissions, answers);
	b.end('sheet: answers');

	b.start('sheet: aggregated answers');
	generateAggregatedAnswersSheet(wb, m, questions, aggregatedAnswers);
	b.end('sheet: aggregated answers');

	if (ratings.length > 0) {
		b.start('sheet: ratings');
		generateRatingsSheet(wb, m, sheets, ratings);
		b.end('sheet: ratings');

		b.start('sheet: aggregated ratings');
		await generateAggregatedRatingsSheet(wb, m, sheets, ratings);
		b.end('sheet: aggregated ratings');
	}

	if (submittedFeatures.length > 0) {
		b.start('sheet: submitted features');
		generateSubmittedFeaturesSheet(wb, m, sheets, submittedFeatures);
		b.end('sheet: submitted features');
	}

	if (sheetTimesArr.length > 0) {
		b.start('sheet: times');
		generateSheetTimesSheet(wb, m, sheets, sheetTimesArr);
		b.end('sheet: times');
	}

	return wb;
}

function generateAnswersSheet(
	wb: xl.Workbook,
	m: ServerMessages['report'],
	questions: sadb.Question[],
	submissions: smdb.Submission[],
	answers: sadb.SurveyAnswer[],
) {
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
		const submissionAnswers = answers.filter((a) => a.submissionId === s.id);
		questions.forEach((q) => {
			const sa = submissionAnswers.find((a) => String(a.questionId) === String(q.id));
			let a = sa?.answer || '';

			function writeCell(a: string | number | null) {
				if (!a && String(a) !== '0') return;

				const c = CELL(COL);

				if (Array.isArray(a)) return c.string(a.join('; '));

				const asNum = Number(a);
				if (!isNaN(asNum)) {
					c.number(asNum);
				} else {
					c.string(a);
				}
			}

			if (q.type === 'checkbox') {
				// multiple columns, one per option
				const arr: string[] = safeParseJSON(a) || a;
				(q.options || []).forEach((option) => {
					sas.cell(1, COL).string(`${q.label} [${option}]`);
					writeCell(arr.includes(option) ? option : '');
					COL++;
				});
				if (q.other) {
					sas.cell(1, COL).string(`${q.label} [${m.other}]`);
					const otherAns = arr.find((o) => o.startsWith?.(OTHER_PREFIX));
					writeCell(otherAns ? otherAns.slice(OTHER_PREFIX.length) : '');
					COL++;
				}
			} else if (q.type === 'multipleChoiceMatrix') {
				// multiple columns, one per cell
				a = safeParseJSON(a) || a;
				const rows = q.rows || [];
				const cols = q.columns || [];
				rows.forEach((row) => {
					cols.forEach((col) => {
						sas.cell(1, COL).string(`${q.label} [${row}] [${col}]`);
						writeCell(a?.[row]?.includes?.(col) ? col : '');
						COL++;
					});
				});
			} else if (['distributeUnits', 'singleChoiceMatrix'].includes(q.type)) {
				// multiple columns, one per row
				a = safeParseJSON(a) || a;
				const subkeys = q.rows || q.options;
				(subkeys || []).forEach((subkey) => {
					sas.cell(1, COL).string(`${q.label} [${subkey}]`);
					writeCell(a[subkey]);
					COL++;
				});
			} else {
				// single column
				const suffix = q.minLabel && q.maxLabel ? ` [${q.minLabel} - ${q.maxLabel}]` : '';
				sas.cell(1, COL).string(q.label + suffix);
				if (a.startsWith?.(OTHER_PREFIX)) {
					a = `${m.other}: ${a.slice(OTHER_PREFIX.length)}`;
				}
				writeCell(a);
				COL++;
			}
		});
	});
}

function generateAggregatedAnswersSheet(
	wb: xl.Workbook,
	m: ServerMessages['report'],
	questions: sadb.Question[],
	aggregatedAnswers: sadb.AggregatedAnswers[],
) {
	const sheet = wb.addWorksheet(m.aggregatedAnswers);
	sheet.cell(1, 1).string(m.question);
	sheet.cell(1, 2).string(m.answer);
	sheet.cell(1, 3).string(m.count);
	sheet.cell(1, 4).string(m.percent);
	sheet.cell(1, 5).string(m.average);
	let row = 1;
	aggregatedAnswers.forEach((aa) => {
		const qid = aa.questionId.split('/')[0];
		const q = questions.find((q) => q.id === Number(qid));
		if (!q) return;
		const suffix = q.minLabel && q.maxLabel ? ` [${q.minLabel} - ${q.maxLabel}]` : '';
		const question = aa.question + suffix;

		row++;
		sheet.cell(row, 1).string(question);
		sheet.cell(row, 2).string(m.allAnswers);
		sheet.cell(row, 3).number(aa.count);
		if (aa.average) {
			sheet.cell(row, 5).number(aa.average);
		}

		if (
			[
				'checkbox',
				'radiogroup',
				'dropdown',
				'rating',
				'singleChoiceMatrix',
				'multipleChoiceMatrix',
				'distributeUnits',
			].includes(q.type)
		) {
			(aa.options || []).forEach((o) => {
				row++;
				sheet.cell(row, 1).string(aa.question);
				sheet.cell(row, 2).string(o.answer === OTHER_ANSWER ? m.other : o.answer);
				if (o.count) sheet.cell(row, 3).number(o.count);
				if (o.percent) sheet.cell(row, 4).number(o.percent);
				if (o.average) sheet.cell(row, 5).number(o.average);
			});
		}
	});
}

function generateRatingsSheet(
	wb: xl.Workbook,
	m: ServerMessages['report'],
	sheets: sdb.Sheet[],
	ratings: rdb.Rating[],
) {
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
			const feature = features.find((f) => String(f.id || '') === String(r.featureId));
			const name = feature?.properties?.name || '';
			rs.cell(i + 2, 3).string(String(name));
		}
	});
}

async function generateAggregatedRatingsSheet(
	wb: xl.Workbook,
	m: ServerMessages['report'],
	sheets: sdb.Sheet[],
	ratings: rdb.Rating[],
) {
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
			const feature = features.find((f) => String(f.id || '') === String(r.featureId));
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
				(r) => r.sheetId === sheet.id && r.featureId === String(feature.id || ''),
			);
			ars.cell(row, 7).string(rs[rs.length - 1]?.question || '');
			ars.cell(row, 8).string(stringifyArray(rs.map((r) => r.answer || '')));
			ars.cell(row, 9).string(stringifyArray(rs.map((r) => r.pros || '')));
			ars.cell(row, 10).string(stringifyArray(rs.map((r) => r.cons || '')));
		}
	}
}

function stringifyArray(arr: string[]) {
	return arr
		.map((a) => a.replace(/\s+/g, ' ').trim())
		.filter(Boolean)
		.join(';');
}

function generateSubmittedFeaturesSheet(
	wb: xl.Workbook,
	m: ServerMessages['report'],
	sheets: sdb.Sheet[],
	submittedFeatures: sfdb.SubmittedFeatures[],
) {
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
	let row = 1;
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

				const di = lookupDrawingInteraction(interactions, f);
				const descriptionLabel =
					f?.properties?.descriptionLabel || di.descriptionLabel || '';
				const featureLabel = f?.properties?.featureLabel || di.featureLabel || type;
				const answer = safeParseJSONArray(f?.properties?.partimapFeatureQuestion_ans).join(
					', ',
				);

				row++;
				sfs.cell(row, 1).number(sf.submissionId);
				sfs.cell(row, 2).string(featureLabel);
				sfs.cell(row, 3).string(type);
				sfs.cell(row, 4).string(coords);
				sfs.cell(row, 5).string(String(f.id || ''));
				sfs.cell(row, 6).string(String(name));
				sfs.cell(row, 7).string(descriptionLabel);
				sfs.cell(row, 8).string(f?.properties?.description || '');
				sfs.cell(row, 9).string(f?.properties?.partimapFeatureQuestion || '');
				sfs.cell(row, 10).string(answer);
			}
		}
	}
}

function generateSheetTimesSheet(
	wb: xl.Workbook,
	m: ServerMessages['report'],
	sheets: sdb.Sheet[],
	sheetTimesArr: SheetTime[],
) {
	const sheetTitles = sheets.reduce<Record<number, string>>((acc, s) => {
		acc[s.id] = s.title;
		return acc;
	}, {});

	const sts = wb.addWorksheet(m.timeSpentOnSheet);
	sts.cell(1, 1).string(m.submissionId);
	sts.cell(1, 2).string(m.sheetTitle);
	sts.cell(1, 3).string(m.timeSpentOnSheet);
	sheetTimesArr.forEach((st, row) => {
		const CELL = (col: number) => sts.cell(row + 2, col);
		CELL(1).number(st.submissionId);
		CELL(2).string(sheetTitles[st.sheetId] || `${st.sheetId}`);
		CELL(3).number(Number(((st.spentTimeMs || 0) / 1000 / 60).toFixed(1)));
	});
}
