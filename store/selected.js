export const state = () => ({
	selectedFeature: null
});

export const mutations = {
	changeFeature(state, feature) {
		if (!state.selectedFeature === feature) {
			state.selectedFeature = feature;
		}
	},
	removeFeature(state) {
		state.selectedFeature = null;
	}
};

export const getters = {
	getSelectedFeature: state => state.selectedFeature
};
