import GeoJSON from 'ol/format/GeoJSON';

export const state = () => ({
	visitorFeatures: {},
	visitorRatings: {},
});

export const mutations = {
	addFeatures(state, payload) {
		const featureArray = payload.features;
		const sheetIdKey = payload.sheetId.toString();
		state.visitorFeatures[sheetIdKey] = featureArray;
	},
	clear(state) {
		state.visitorFeatures = {};
	},
	addRatings(state, payload) {
		const sheetIdKey = payload.sheetId.toString();
		const ratings = payload.ratings;
		state.visitorRatings[sheetIdKey] = ratings;
	}
};

export const getters = {
	getVisitorFeatures: state => sheetId => state.visitorFeatures[sheetId.toString()],
	getVisitorRatings: state => sheetId => state.visitorRatings[sheetId.toString()],
	getSubmissionData: state => sheetIds => {
		const data = {};
		sheetIds.forEach(id => {
			const f = state.visitorFeatures[id.toString()];
			if (f && f.length) {
				data[id] = data[id] || {};
				data[id].features = f.map(e => JSON.parse(new GeoJSON().writeFeature(e)));
			}

			const r = state.visitorRatings[id.toString()];
			if (r && Object.keys(r).length) {
				data[id] = data[id] || {};
				data[id].ratings = r;
			}
		});
		return data;
	}
};
