export default function ({ $auth, redirect }) {
	if (!$auth.user.isAdmin) {
		return redirect('/admin');
	}
};
