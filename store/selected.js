
export const state = () => ({
	selectedFeature: null
});

export const mutations = {
	change(state, feature) {
		if (!(state.selectedFeature === feature)) {
			state.selectedFeature = feature;
		}
	},
	remove(state, feature) {
		if (feature === state.selectedFeature) {
			state.selectedFeature = null;
		}
	}
};

export const getters = {
	getSelectedFeature: state => state.selectedFeature
};
