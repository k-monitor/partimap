import GeoJSON from 'ol/format/GeoJSON';

export const state = () => ({
	visitorAnswers: {},
	visitorFeatures: {},
	visitorRatings: {},
});

export const mutations = {
	addAnswers(state, payload) {
		const answers = payload.answers;
		const sheetId = payload.sheetId.toString();
		state.visitorAnswers = {
			...state.visitorAnswers,
			[sheetId]: answers,
		};
	},
	addFeatures(state, payload) {
		const featureArray = payload.features;
		const sheetIdKey = payload.sheetId.toString();
		state.visitorFeatures = {
			...state.visitorFeatures,
			[sheetIdKey]: featureArray,
		};
	},
	clear(state) {
		state.visitorFeatures = {};
	},
	addRatings(state, payload) {
		const sheetIdKey = payload.sheetId.toString();
		const ratings = payload.ratings;
		state.visitorRatings = {
			...state.visitorRatings,
			[sheetIdKey]: ratings,
		};
	},
};

export const getters = {
	getVisitorAnswers: state => sheetId =>
		state.visitorAnswers[sheetId.toString()],
	getVisitorFeatures: state => sheetId =>
		state.visitorFeatures[sheetId.toString()],
	getVisitorRatings: state => sheetId =>
		state.visitorRatings[sheetId.toString()],
	getSubmissionData: state => sheetIds => {
		const data = {};
		sheetIds.forEach(id => {
			const a = state.visitorAnswers[id.toString()];
			if (a && Object.keys(a).length) {
				data[id] = data[id] = {};
				data[id].answers = a;
			}

			const f = state.visitorFeatures[id.toString()];
			if (f && f.length) {
				data[id] = data[id] || {};
				data[id].features = f.map(e => {
					const json = new GeoJSON().writeFeature(e);
					const feature = JSON.parse(json);
					delete feature.properties.visitorFeature;
					return feature;
				});
			}

			const r = state.visitorRatings[id.toString()];
			if (r && Object.keys(r).length) {
				data[id] = data[id] || {};
				data[id].ratings = r;
			}
		});
		return data;
	},
};
