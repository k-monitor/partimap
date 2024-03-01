export default function ({ redirect, route }) {
	if (route.fullPath.match(/^\/hogyan-mukodik\/?/)) {
		// since we set localized routes, the old route is not working
		// so we need to set a redirect manually
		redirect(301, '/hu/hogyan-mukodik');
	}
}
