export const strict = false; // feature referenciát tárolok, ami változik

export const state = () => ({
	editState: false,
	hit: false,
	sidebarVisible: true,
	visitId: null,
});

export const mutations = {
	hit(state) {
		state.hit = true;
	},
	generateVisitId(state) {
		if (!state.visitId) {
			state.visitId = new Date().getTime();
		}
	},
	toggleEditState(state, flag) {
		state.editState = flag;
	},
	setSidebarVisible(state, visible) {
		state.sidebarVisible = visible;
	},
	toggleSidebarVisible(state) {
		state.sidebarVisible = !state.sidebarVisible;
	}
};

export const getters = {
	getEditState: state => state.editState,
	getHit: state => state.hit,
	getSidebarVisible: state => state.sidebarVisible,
};
