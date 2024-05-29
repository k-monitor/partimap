import type { Feature as GeoJsonFeature } from 'geojson';

export type VisitorAnswer = any; // TODO type: string | number | array | record ?
export type AnswersByQuestion = Record<string, VisitorAnswer>;

export type VisitorRating = {
	value?: number;
	answer?: string;
	pros?: string;
	cons?: string;
};
export type RatingsByFeature = Record<string, VisitorRating>;

export type SubmissionDataBySheet = Record<
	number,
	{
		answers?: globalThis.AnswersByQuestion | undefined;
		features?: GeoJsonFeature[] | undefined;
		ratings?: globalThis.RatingsByFeature | undefined;
	}
>;

export default function useVisitorData() {
	const visitorAnswers = useState<Record<number, AnswersByQuestion>>(
		'visitorAnswers',
		() => ({}),
	);
	const getVisitorAnswers = (sheetId: number) => visitorAnswers.value[sheetId] || {};
	const setVisitorAnswers = (sheetId: number, answers: AnswersByQuestion) => {
		visitorAnswers.value = {
			...visitorAnswers.value,
			[sheetId]: answers,
		};
	};
	const getAllVisitorAnswers = () =>
		Object.values(visitorAnswers.value).reduce(
			(all, sheetAnswers) => ({
				...all,
				sheetAnswers,
			}),
			{},
		);

	const visitorFeatures = useState<Record<number, GeoJsonFeature[]>>(
		'visitorFeatures',
		() => ({}),
	);
	const getVisitorFeatures = (sheetId: number) => visitorFeatures.value[sheetId] || [];
	const setVisitorFeatures = (sheetId: number, features: GeoJsonFeature[]) => {
		visitorFeatures.value = {
			...visitorFeatures.value,
			[sheetId]: features,
		};
	};

	const visitorRatings = useState<Record<number, RatingsByFeature>>('visitorRatings', () => ({}));
	const getVisitorRatings = (sheetId: number) => visitorRatings.value[sheetId] || {};
	const setVisitorRatings = (sheetId: number, ratings: RatingsByFeature) => {
		visitorRatings.value = {
			...visitorRatings.value,
			[sheetId]: ratings,
		};
	};

	const getSubmissionData = (sheetIds: number[]) =>
		sheetIds.reduce((data, id) => {
			const a = getVisitorAnswers(id);
			const f = getVisitorFeatures(id);
			const r = getVisitorRatings(id);

			const sd: Record<string, any> = {};
			if (Object.keys(a).length) sd.answers = a;
			if (f.length) sd.features = f;
			if (Object.keys(r).length) sd.ratings = r;
			if (Object.keys(sd).length) data[id] = sd;

			return data;
		}, {} as SubmissionDataBySheet);

	return {
		getAllVisitorAnswers,
		getVisitorAnswers,
		setVisitorAnswers,

		getVisitorFeatures,
		setVisitorFeatures,

		getVisitorRatings,
		setVisitorRatings,

		getSubmissionData,
	};
}
