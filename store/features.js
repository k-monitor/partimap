export const state = () => ({
	features: []
});

export const mutations = {
	add(state, feature) {
		if (!state.features.includes(feature)) {
			state.features.push(feature);
		}
	},
	remove(state, feature) {
		const idx = state.features.indexOf(feature);
		if (idx !== -1) {
			state.features.splice(idx, 1);
		}
	}
};

export const getters = {
	getAllFeature: state => state.features
};
