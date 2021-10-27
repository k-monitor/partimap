export const strict = false; // feature referenciát tárolok, ami változik

export const state = () => ({
	drawType: '',
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
	setDrawType(state, drawType) {
		state.drawType = drawType;
	},
	setSidebarVisible(state, visible) {
		state.sidebarVisible = visible;
	},
	toggleSidebarVisible(state) {
		state.sidebarVisible = !state.sidebarVisible;
	}
};

export const getters = {
	getDrawType: state => state.drawType,
	getHit: state => state.hit,
	getSidebarVisible: state => state.sidebarVisible,
};
