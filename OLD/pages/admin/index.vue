<script>
export default {
	middleware({ localePath, redirect }) {
		return redirect(localePath('/admin/projects'));
	},
};
</script>
