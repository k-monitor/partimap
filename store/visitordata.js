export const state = () => ({
	visitorFeatures: {},
	ratings: {}
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
		state.ratings[sheetIdKey] = ratings;
	}
};

export const getters = {
	getVisitorFeatures: state => sheetId => state.visitorFeatures[sheetId.toString()],
	getFeatureRatings: state => sheetId => state.ratings[sheetId.toString()]
};
