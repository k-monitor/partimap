export const state = () => ({
	visitorFeatures: {}
});

export const mutations = {
	addFeatures(state, payload) {
		const featureArray = payload.features;
		const sheetIdKey = payload.sheetId.toString();
		state.visitorFeatures[sheetIdKey] = featureArray;
	},
	clear(state) {
		state.visitorFeatures = {};
	}
};

export const getters = {
	getVisitorFeatures: state => sheetId => state.visitorFeatures[sheetId.toString()]
};
