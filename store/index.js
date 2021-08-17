export const state = () => ({
	editState: false
});

export const mutations = {
	toggleEditState(state, flag) {
		state.editState = flag;
	}
};

export const getters = {
	getEditState: state => state.editState
};
