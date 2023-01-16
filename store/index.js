export const strict = false; // feature referenciát tárolok, ami változik

export const state = () => ({
	baseMap: 'osm',
	consent: false,
	drawType: '',
	hit: false,
	sidebarVisible: true,
	submitted: false,
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
	setBaseMap(state, value) {
		state.baseMap = value;
	},
	setConsent(state, value) {
		state.consent = value;
	},
	setDrawType(state, drawType) {
		state.drawType = drawType;
	},
	setSidebarVisible(state, visible) {
		state.sidebarVisible = visible;
	},
	setSubmitted(state) {
		state.submitted = true;
	},
	toggleSidebarVisible(state) {
		state.sidebarVisible = !state.sidebarVisible;
	}
};

export const getters = {
	getBaseMap: state => state.baseMap,
	getConsent: state => state.consent,
	getDrawType: state => state.drawType,
	getHit: state => state.hit,
	getSidebarVisible: state => state.sidebarVisible,
};
