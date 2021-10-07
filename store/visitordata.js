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
	getVisitorRatings: state => sheetId => state.visitorRatings[sheetId.toString()]
};
