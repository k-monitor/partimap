export const strict = false; // feature referenciát tárolok, ami változik

export const state = () => ({
	editState: false,
});

export const mutations = {
	toggleEditState(state, flag) {
		state.editState = flag;
	}
};

export const getters = {
	getEditState: state => state.editState
};
