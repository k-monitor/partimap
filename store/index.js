export const strict = false; // feature referenciát tárolok, ami változik

export const state = () => ({
	editState: false,
	hit: false,
});

export const mutations = {
	hit(state) {
		state.hit = true;
	},
	toggleEditState(state, flag) {
		state.editState = flag;
	}
};

export const getters = {
	getEditState: state => state.editState,
	getHit: state => state.hit
};
