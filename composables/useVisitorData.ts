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

type SubmissionData = {
	answers?: globalThis.AnswersByQuestion | undefined;
	features?: GeoJsonFeature[] | undefined;
	ratings?: globalThis.RatingsByFeature | undefined;
	spentTime: number;
};

export type SubmissionDataBySheet = Record<number, SubmissionData>;

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
	const getAllVisitorAnswers = computed(() =>
		Object.values(visitorAnswers.value).reduce(
			(all, sheetAnswers) => ({
				...all,
				...sheetAnswers,
			}),
			{},
		),
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
	const featureCountByInteraction = computed(() => {
		const counts: Record<string, number> = {};
		Object.values(visitorFeatures.value).forEach((features) => {
			features.forEach((f) => {
				const di = f.properties?.visitorFeature || '';
				if (!counts[di]) counts[di] = 0;
				counts[di]++;
			});
		});
		return counts;
	});

	const visitorRatings = useState<Record<number, RatingsByFeature>>('visitorRatings', () => ({}));
	const getVisitorRatings = (sheetId: number) => visitorRatings.value[sheetId] || {};
	const setVisitorRatings = (sheetId: number, ratings: RatingsByFeature) => {
		visitorRatings.value = {
			...visitorRatings.value,
			[sheetId]: ratings,
		};
	};

	const getSubmissionData = (sheetIds: number[], sheetTimes: Record<number, number>) =>
		sheetIds.reduce((data, id) => {
			const a = getVisitorAnswers(id);
			const f = getVisitorFeatures(id);
			const r = getVisitorRatings(id);
			const t = sheetTimes[id] || 0;

			f.forEach((f) => {
				if (f.properties?.visitorFeature) {
					delete f.properties.visitorFeature;
				}
			});

			const sd: SubmissionData = {
				answers: Object.keys(a).length ? a : undefined,
				features: f.length ? f : undefined,
				ratings: Object.keys(r).length ? r : undefined,
				spentTime: t,
			};
			if (sd.answers || sd.features || sd.ratings) {
				data[id] = sd;
			}

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
		featureCountByInteraction,
	};
}
